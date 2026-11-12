<?php
declare(strict_types=1);
require dirname(__DIR__).'/app.php';
use Tria\App;
use Tria\Response;
$dir=sys_get_temp_dir().'/tria-test-'.bin2hex(random_bytes(8));mkdir($dir,0700);mkdir($dir.'/uploads',0700);
$config=['origin'=>'https://workflow.eksioglutria.com','setup_token_hash'=>Tria\digest(str_repeat('a',64)),'data_dir'=>$dir,'db'=>['driver'=>'sqlite','path'=>$dir.'/test.sqlite']];
$app=new App($config);$checks=0;
function expect(bool $ok,string $message):void{global $checks;if(!$ok)throw new RuntimeException($message);$checks++;}
function status(Response $r,int $s,string $m):array{expect($r->status===$s,$m.' got '.$r->status.' '.json_encode($r->data));return is_array($r->data)?$r->data:[];}
function login(string $email,string $pw='Test-password-123!'):array{
 global $app;$r=$app->handle('POST','/api/login',['email'=>$email,'password'=>$pw],['ip'=>'127.0.0.1']);$b=status($r,200,'login');preg_match('/^[^=]+=([^;]+)/',$r->headers['Set-Cookie'],$m);
 expect(str_contains($r->headers['Set-Cookie'],'Secure')&&str_contains($r->headers['Set-Cookie'],'HttpOnly')&&str_contains($r->headers['Set-Cookie'],'__Host-'),'cookie flags');
 return ['cookie'=>$m[1],'csrf'=>$b['csrf'],'origin'=>'https://workflow.eksioglutria.com','ip'=>'127.0.0.1'];
}
try{
 $setup=['setup_key'=>str_repeat('a',64),'name'=>'Yönetici','email'=>'admin@eksioglutria.com','password'=>'Test-password-123!'];$ctx=['origin'=>$config['origin']];
 status($app->handle('POST','/api/install',$setup,[]),403,'install origin');
 status($app->handle('POST','/api/install',array_merge($setup,['setup_key'=>'wrong']),$ctx),403,'install secret');
 status($app->handle('POST','/api/install',$setup,$ctx),201,'install');
 status($app->handle('POST','/api/install',$setup,$ctx),409,'installer replay');
 $admin=login('admin@eksioglutria.com');$adminId=$app->handle('GET','/api/me',[],$admin)->data['user']['id'];
 status($app->handle('GET','/api/state'),401,'anonymous');
 status($app->handle('POST','/api/projects',['name'=>'A','location'=>'B'],array_merge($admin,['csrf'=>'bad'])),403,'csrf');
 status($app->handle('POST','/api/projects',['name'=>'A','location'=>'B'],array_merge($admin,['origin'=>'https://evil.test'])),403,'origin');
 $staffId=Tria\id();$otherId=Tria\id();
 foreach([[$staffId,'staff@eksioglutria.com'],[$otherId,'other@eksioglutria.com']] as [$id,$email])$app->sql('INSERT INTO tria_users(id,name,email,password,role,active) VALUES(?,?,?,?,?,1)',[$id,'Çalışan',$email,Tria\hashPassword('Test-password-123!'),'employee']);
 $staff=login('staff@eksioglutria.com');$other=login('other@eksioglutria.com');
 status($app->handle('POST','/api/login',['email'=>'staff@eksioglutria.com','password'=>'Test-password-123!','admin'=>true]),403,'admin portal guard');
 status($app->handle('POST','/api/projects',['name'=>'P','location'=>'L'],$staff),403,'project admin only');
 $pid=status($app->handle('POST','/api/projects',['name'=>'Tria Kordonboyu','location'=>'Kartal'],$admin),201,'project create')['id'];
 status($app->handle('POST','/api/projects/'.$pid.'/members',['users'=>[$staffId]],$admin),200,'membership');
 $task=['title'=>'Malik görüşmesi','project_id'=>$pid,'assignee'=>$staffId,'due'=>'2026-11-15','priority'=>'Yüksek','category'=>'Kentsel Dönüşüm'];
 $tid=status($app->handle('POST','/api/tasks',$task,$admin),201,'task create')['id'];
 status($app->handle('POST','/api/tasks',array_merge($task,['due'=>'2026-02-30']),$admin),400,'invalid date');
 status($app->handle('POST','/api/tasks',$task,$other),403,'unauthorized project');
 status($app->handle('POST','/api/tasks',array_merge($task,['assignee'=>$otherId]),$admin),403,'assignee membership');
 $s=$app->handle('GET','/api/state',[],$staff)->data;expect(count($s['projects'])===1&&count($s['tasks'])===1,'staff state');
 $s=$app->handle('GET','/api/state',[],$other)->data;expect($s['tasks']===[]&&$s['projects']===[],'project isolation');
 status($app->handle('PATCH','/api/tasks/'.$tid,['status'=>'Tamamlandı'],$other),403,'unauthorized update');
 status($app->handle('PATCH','/api/tasks/'.$tid,['status'=>'Tamamlandı'],$staff),200,'own task update');
 status($app->handle('PATCH','/api/tasks/'.$tid,['status'=>'Invalid'],$admin),400,'status validation');
 status($app->handle('POST','/api/projects/'.$pid.'/members',['users'=>[]],$admin),400,'assigned member removal');
 $atid=status($app->handle('POST','/api/tasks',array_merge($task,['assignee'=>$adminId]),$admin),201,'admin task')['id'];
 status($app->handle('PATCH','/api/tasks/'.$atid,['status'=>'Tamamlandı'],$staff),403,'other assignee protection');
 $file=['project_id'=>$pid,'name'=>'ruhsat.txt','content'=>base64_encode('Test evrakı')];
 $did=status($app->handle('POST','/api/documents',$file,$staff),201,'upload')['id'];
 $r=$app->handle('GET','/api/documents/'.$did,[],$staff);status($r,200,'download');expect(file_get_contents($r->file)==='Test evrakı','exact download bytes');expect(str_contains($r->headers['Content-Disposition'],'attachment'),'download attachment');
 status($app->handle('GET','/api/documents/'.$did,[],$other),403,'download isolation');
 status($app->handle('POST','/api/documents',array_merge($file,['name'=>'shell.php']),$staff),400,'executable rejected');
 status($app->handle('POST','/api/documents',array_merge($file,['content'=>'???']),$staff),400,'bad base64');
 status($app->handle('POST','/api/invites',['email'=>'x@example.com'],$admin),400,'email domain');
 status($app->handle('POST','/api/invites',['email'=>'new@eksioglutria.com'],$staff),403,'invite admin only');
 $i=status($app->handle('POST','/api/invites',['email'=>'new@eksioglutria.com'],$admin),201,'invite');expect(str_starts_with($i['url'],$config['origin'].'/invite#'),'invite origin');$token=explode('#',$i['url'])[1];
 expect(!$app->one('SELECT token FROM tria_invites WHERE token=?',[$token]),'only token hash stored');
 $accept=['token'=>$token,'name'=>'Yeni Çalışan','password'=>'Test-password-123!'];
 status($app->handle('POST','/api/invite/accept',$accept),200,'accept invite');status($app->handle('POST','/api/invite/accept',$accept),400,'single use');
 $i=status($app->handle('POST','/api/invites',['email'=>'expired@eksioglutria.com'],$admin),201,'expiry invitation');$token=explode('#',$i['url'])[1];$app->sql('UPDATE tria_invites SET expires=0 WHERE token=?',[Tria\digest($token)]);
 status($app->handle('POST','/api/invite/accept',array_merge($accept,['token'=>$token])),400,'expired invitation');
 $second=login('staff@eksioglutria.com');
 status($app->handle('POST','/api/password',['current'=>'wrong','password'=>'Changed-password-123!'],$staff),400,'current password required');
 status($app->handle('POST','/api/password',['current'=>'Test-password-123!','password'=>'Changed-password-123!'],$staff),200,'password change');
 status($app->handle('GET','/api/me',[],$second),401,'other sessions revoked');status($app->handle('GET','/api/me',[],$staff),200,'current session retained');
 status($app->handle('POST','/api/logout',[],$staff),200,'logout');status($app->handle('GET','/api/me',[],$staff),401,'logout revocation');
 for($j=0;$j<8;$j++)status($app->handle('POST','/api/login',['email'=>'missing@eksioglutria.com','password'=>'bad']),401,'failed attempt');
 status($app->handle('POST','/api/login',['email'=>'missing@eksioglutria.com','password'=>'bad']),429,'rate limit');
 // ---- Görev düzenleme / silme (PUT, DELETE) ----
 $staff=login('staff@eksioglutria.com','Changed-password-123!');$other=login('other@eksioglutria.com');
 $edit=['title'=>'Malik görüşmesi (güncel)','project_id'=>$pid,'assignee'=>$staffId,'due'=>'2026-12-01','status'=>'Devam ediyor','priority'=>'Orta','category'=>'Finans & Muhasebe','description'=>'Not'];
 status($app->handle('PUT','/api/tasks/'.$tid,$edit,$admin),200,'admin task edit');
 $row=$app->one('SELECT * FROM tria_tasks WHERE id=?',[$tid]);expect($row['title']==='Malik görüşmesi (güncel)'&&$row['category']==='Finans & Muhasebe'&&$row['due']==='2026-12-01','task edit persisted');
 status($app->handle('PUT','/api/tasks/'.$tid,$edit,$other),403,'non-member cannot edit');
 status($app->handle('PUT','/api/tasks/'.$tid,array_merge($edit,['assignee'=>$otherId]),$admin),403,'new assignee must be member');
 status($app->handle('PUT','/api/tasks/'.$tid,array_merge($edit,['priority'=>'Acil']),$admin),400,'invalid task field');
 status($app->handle('PUT','/api/tasks/'.str_repeat('0',24),$edit,$admin),404,'edit missing task');
 status($app->handle('POST','/api/projects/'.$pid.'/members',['users'=>[$staffId,$otherId]],$admin),200,'add second member');
 status($app->handle('PUT','/api/tasks/'.$tid,array_merge($edit,['assignee'=>$otherId]),$staff),200,'member reassigns task');
 expect($app->one('SELECT assignee FROM tria_tasks WHERE id=?',[$tid])['assignee']===$otherId,'assignee changed');
 status($app->handle('PUT','/api/tasks/'.$tid,array_merge($edit,['assignee'=>$adminId]),$staff),200,'admin can be assignee');
 status($app->handle('DELETE','/api/tasks/'.$tid,[],$staff),403,'delete admin only');
 status($app->handle('DELETE','/api/tasks/'.$tid,[],$admin),200,'admin deletes task');
 status($app->handle('DELETE','/api/tasks/'.$tid,[],$admin),404,'deleted task gone');
 // ---- Dinamik roller ----
 $roles=status($app->handle('GET','/api/roles',[],$staff),200,'roles readable')['roles'];expect(array_column($roles,'key')===['admin','employee'],'builtin roles');
 status($app->handle('POST','/api/roles',['label'=>'Muhasebe'],$staff),403,'role create admin only');
 $rk=status($app->handle('POST','/api/roles',['label'=>'Muhasebe'],$admin),201,'role create')['key'];expect(strlen($rk)<=16,'role key fits column');
 status($app->handle('POST','/api/roles',['label'=>'muhasebe'],$admin),400,'duplicate role label');
 status($app->handle('POST','/api/roles',['label'=>'Yönetici'],$admin),400,'builtin label reserved');
 expect(in_array($rk,array_column($app->handle('GET','/api/state',[],$admin)->data['roles'],'key'),true),'roles in state');
 status($app->handle('POST','/api/invites',['email'=>'finans@eksioglutria.com','role'=>$rk],$admin),201,'invite with custom role');
 status($app->handle('POST','/api/invites',['email'=>'x2@eksioglutria.com','role'=>'superuser'],$admin),400,'invite unknown role');
 // ---- Kullanıcı güncelleme (PUT /api/users) ----
 status($app->handle('PUT','/api/users/'.$otherId,['role'=>$rk],$staff),403,'user edit admin only');
 status($app->handle('PUT','/api/users/'.$otherId,['role'=>'nope'],$admin),400,'unknown role rejected');
 status($app->handle('PUT','/api/users/'.$otherId,['role'=>$rk],$admin),200,'assign custom role');
 expect($app->one('SELECT role FROM tria_users WHERE id=?',[$otherId])['role']===$rk,'custom role persisted');
 status($app->handle('POST','/api/tasks',array_merge($task,['assignee'=>$otherId]),$admin),201,'custom role member assignable');
 status($app->handle('DELETE','/api/roles/'.$rk,[],$admin),400,'role in use');
 status($app->handle('DELETE','/api/roles/employee',[],$admin),400,'builtin role delete');
 status($app->handle('PUT','/api/users/'.$adminId,['role'=>'employee'],$admin),403,'self demotion blocked');
 status($app->handle('PUT','/api/users/'.$otherId,['active'=>'0'],$admin),400,'active must be boolean');
 status($app->handle('PUT','/api/users/'.$otherId,['active'=>false],$admin),200,'deactivate user');
 status($app->handle('GET','/api/me',[],$other),401,'deactivated session revoked');
 status($app->handle('POST','/api/login',['email'=>'other@eksioglutria.com','password'=>'Test-password-123!']),401,'deactivated login');
 status($app->handle('PUT','/api/users/'.$otherId,['active'=>true,'role'=>'employee'],$admin),200,'reactivate user');
 $app->sql('UPDATE tria_invites SET used=1 WHERE role=?',[$rk]);
 status($app->handle('DELETE','/api/roles/'.$rk,[],$admin),200,'delete unused role');
 $secondAdmin=Tria\id();$app->sql('INSERT INTO tria_users(id,name,email,password,role,active) VALUES(?,?,?,?,?,1)',[$secondAdmin,'İkinci','admin2@eksioglutria.com',Tria\hashPassword('Test-password-123!'),'admin']);
 $admin2=login('admin2@eksioglutria.com');
 status($app->handle('PUT','/api/users/'.$secondAdmin,['role'=>'employee'],$admin),200,'demote other admin');
 $app->sql("UPDATE tria_users SET role='admin' WHERE id=?",[$secondAdmin]);
 $app->sql('UPDATE tria_users SET active=0 WHERE id=?',[$adminId]);
 status($app->handle('PUT','/api/users/'.$secondAdmin,['role'=>'employee'],$admin2),403,'self demotion as last admin');
 $app->sql('UPDATE tria_users SET active=1 WHERE id=?',[$adminId]);
 $long=str_repeat('x',72).'one';$hash=Tria\hashPassword($long);expect(Tria\verifyPassword($long,$hash),'long password');expect(!Tria\verifyPassword(str_repeat('x',72).'two',$hash),'no bcrypt truncation');
 echo "OK: $checks checks passed\n";
}catch(Throwable $e){fwrite(STDERR,'FAIL: '.$e->getMessage()."\n");exit(1);}
finally{unset($app);foreach(glob($dir.'/uploads/*')?:[] as $f)unlink($f);rmdir($dir.'/uploads');foreach(glob($dir.'/*')?:[] as $f)unlink($f);rmdir($dir);}
