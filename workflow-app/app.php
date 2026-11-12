<?php
declare(strict_types=1);
namespace Tria;
final class Problem extends \RuntimeException {
 public function __construct(string $message,public readonly int $status=400){parent::__construct($message);}
}
final class Response {
 public function __construct(public mixed $data,public int $status=200,public array $headers=[],public ?string $file=null){}
 public function emit():void {
  http_response_code($this->status);
  foreach($this->headers as $k=>$v)header($k.': '.$v);
  if($this->file!==null){header('Content-Length: '.filesize($this->file));readfile($this->file);}
  else {header('Content-Type: application/json; charset=utf-8');echo json_encode($this->data,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);}
 }
}
function id():string{return bin2hex(random_bytes(12));}
function token():string{return bin2hex(random_bytes(32));}
function digest(string $s):string{return hash('sha256',$s);}
function hashPassword(string $s):string{return 'sha256:'.password_hash(digest($s),PASSWORD_BCRYPT,['cost'=>12]);}
function verifyPassword(string $s,string $hash):bool{return str_starts_with($hash,'sha256:')&&password_verify(digest($s),substr($hash,7));}
function field(array $body,string $key,int $max=200,bool $optional=false):string{
 $s=$body[$key]??'';
 if(!is_string($s)||strlen($s)>$max||str_contains($s,"\0")||(!$optional&&trim($s)===''))throw new Problem($key.': Geçerli bir değer girin.');
 return in_array($key,['password','current'],true)?$s:trim($s);
}
function validEmail(string $s):bool{return strlen($s)<=200&&filter_var($s,FILTER_VALIDATE_EMAIL)!==false&&substr(strrchr($s,'@')?:'',1)==='eksioglutria.com';}
function validPassword(string $s):void{if(strlen($s)<12||strlen($s)>1024)throw new Problem('Şifre en az 12 karakter olmalı.');}
function publicUser(array $u):array{return array_intersect_key($u,array_flip(['id','name','email','role']));}
final class App {
 public const STATUSES=['Planlandı','Devam ediyor','Beklemede','Tamamlandı'];
 public const CATEGORIES=['Genel','Kentsel Dönüşüm','Belediye & Ruhsat','Şantiye','Satış & CRM'];
 public readonly \PDO $db;
 public readonly string $driver;
 public function __construct(public readonly array $config){
  $d=$config['db'];$this->driver=$d['driver'];
  if(!in_array($this->driver,['mysql','sqlite'],true))throw new \RuntimeException('Database driver');
  if($this->driver==='sqlite'){$this->db=new \PDO('sqlite:'.$d['path']);$this->db->exec('PRAGMA foreign_keys=ON');$this->db->exec('PRAGMA busy_timeout=10000');}
  else{
   foreach(['host','name'] as $key)if(!preg_match('/^[a-zA-Z0-9_.-]+$/D',$d[$key]))throw new \RuntimeException('Database configuration');
   $this->db=new \PDO('mysql:host='.$d['host'].';port='.(int)($d['port']??3306).';dbname='.$d['name'].';charset=utf8mb4',$d['user'],$d['password'],[\PDO::ATTR_EMULATE_PREPARES=>false]);
  }
  $this->db->setAttribute(\PDO::ATTR_ERRMODE,\PDO::ERRMODE_EXCEPTION);
  $this->db->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE,\PDO::FETCH_ASSOC);
  $this->db->setAttribute(\PDO::ATTR_STRINGIFY_FETCHES,false);
 }
 public function sql(string $sql,array $params=[]):\PDOStatement{$s=$this->db->prepare($sql);$s->execute($params);return $s;}
 public function one(string $sql,array $params=[]):?array{$r=$this->sql($sql,$params)->fetch();return $r===false?null:$r;}
 public function all(string $sql,array $params=[]):array{return $this->sql($sql,$params)->fetchAll();}
 public function tx(callable $fn):mixed{
  $this->db->beginTransaction();try{$r=$fn();$this->db->commit();return $r;}catch(\Throwable $e){if($this->db->inTransaction())$this->db->rollBack();throw $e;}
 }
 public function migrate():void{foreach(explode(';',file_get_contents(__DIR__.'/schema-'.$this->driver.'.sql')) as $s)if(trim($s)!=='')$this->db->exec($s);}
 private function lock():string{return $this->driver==='mysql'?' FOR UPDATE':'';}
 private function audit(string $uid,string $action):void{$this->sql('INSERT INTO tria_audit(user_id,action,created) VALUES(?,?,?)',[$uid,$action,time()]);}
 public function cookieName():string{return str_starts_with($this->config['origin'],'https://')?'__Host-tria_session':'tria_session';}
 private function cookie(string $token,bool $remember=false,bool $clear=false):string{
  return $this->cookieName().'='.$token.'; Path=/; HttpOnly; SameSite=Strict'.(str_starts_with($this->config['origin'],'https://')?'; Secure':'').($clear?'; Max-Age=0':($remember?'; Max-Age=2592000':''));
 }
 private function session(array $ctx):array{
  $t=$ctx['cookie']??'';if(!is_string($t))throw new Problem('Lütfen giriş yapın.',401);
  $u=$this->one('SELECT u.*,s.csrf,s.token AS session_token FROM tria_sessions s JOIN tria_users u ON u.id=s.user_id WHERE s.token=? AND s.expires>? AND u.active=1',[digest($t),time()]);
  if(!$u)throw new Problem('Lütfen giriş yapın.',401);return $u;
 }
 private function admin(array $u):void{if($u['role']!=='admin')throw new Problem('Yönetici yetkisi gerekiyor.',403);}
 private function project(array $u,string $id):array{
  $p=$this->one('SELECT * FROM tria_projects WHERE id=?',[$id]);if(!$p)throw new Problem('Proje bulunamadı.',404);
  if($u['role']!=='admin'&&!$this->one('SELECT 1 FROM tria_members WHERE project_id=? AND user_id=?',[$id,$u['id']]))throw new Problem('Bu projeye erişim yetkiniz yok.',403);return $p;
 }
 public function handle(string $method,string $path,array $body=[],array $ctx=[]):Response{
  try{
   if($method!=='GET'&&($ctx['origin']??'')!==''&&$ctx['origin']!==$this->config['origin'])throw new Problem('İstek kaynağı doğrulanamadı.',403);
   if($path==='/api/install'&&$method==='POST')return $this->install($body,$ctx);
   if($path==='/api/login'&&$method==='POST')return $this->login($body,$ctx);
   if($path==='/api/invite/accept'&&$method==='POST')return $this->tx(fn()=>$this->accept($body));
   $u=$this->session($ctx);
   if($method!=='GET'&&(!is_string($ctx['csrf']??null)||!hash_equals($u['csrf'],$ctx['csrf'])))throw new Problem('Güvenlik doğrulaması başarısız. Sayfayı yenileyin.',403);
   if($method==='GET')return $this->read($path,$u);
   return $this->tx(fn()=>$this->write($method,$path,$body,$u));
  }catch(Problem $e){return new Response(['error'=>$e->getMessage()],$e->status);}
  catch(\Throwable $e){error_log('Tria error: '.get_class($e));return new Response(['error'=>'İşlem tamamlanamadı. BT sorumlusuna başvurun.'],500);}
 }
 private function install(array $b,array $ctx):Response{
  $hash=$this->config['setup_token_hash']??'';$key=$b['setup_key']??'';
  if(($ctx['origin']??'')!==$this->config['origin']||!is_string($hash)||!preg_match('/^[a-f0-9]{64}$/D',$hash)||!is_string($key)||strlen($key)<48||strlen($key)>128||!hash_equals($hash,digest($key)))throw new Problem('Kurulum anahtarı geçersiz veya web kurulumu kapalı.',403);
  $email=strtolower(field($b,'email'));$name=field($b,'name',100);$pw=field($b,'password',1024);validPassword($pw);
  if(!validEmail($email))throw new Problem('Kurumsal e-posta adresi gerekiyor.');
  $lock=fopen($this->config['data_dir'].'/install.lock','c');if(!$lock||!flock($lock,LOCK_EX))throw new Problem('Kurulum kilidi alınamadı.',503);
  try{
   $this->migrate();return $this->tx(function()use($email,$name,$pw){
    if($this->one('SELECT value FROM tria_meta WHERE name=?',['installed'])||$this->one('SELECT id FROM tria_users LIMIT 1'))throw new Problem('Kurulum daha önce tamamlanmış.',409);
    $this->sql('INSERT INTO tria_meta(name,value) VALUES(?,?)',['installed',(string)time()]);$id=id();
    $this->sql('INSERT INTO tria_users(id,name,email,password,role,active) VALUES(?,?,?,?,?,1)',[$id,$name,$email,hashPassword($pw),'admin']);
    $this->audit($id,'İlk yönetici oluşturuldu');return new Response(['ok'=>true],201);
   });
  }finally{flock($lock,LOCK_UN);fclose($lock);}
 }
 private function login(array $b,array $ctx):Response{
  $email=strtolower(field($b,'email'));$pw=field($b,'password',1024);$bucket=digest(($ctx['ip']??'').'|'.$email);
  $this->tx(function()use($bucket){
   $q=$this->driver==='mysql'?'INSERT INTO tria_attempts(bucket,count,started) VALUES(?,0,?) ON DUPLICATE KEY UPDATE bucket=bucket':'INSERT INTO tria_attempts(bucket,count,started) VALUES(?,0,?) ON CONFLICT(bucket) DO NOTHING';
   $this->sql($q,[$bucket,time()]);$a=$this->one('SELECT * FROM tria_attempts WHERE bucket=?'.$this->lock(),[$bucket]);$fresh=(int)$a['started']>time()-900;
   if($fresh&&(int)$a['count']>=8)throw new Problem('Çok fazla deneme. 15 dakika sonra tekrar deneyin.',429);
   $this->sql('UPDATE tria_attempts SET count=?,started=? WHERE bucket=?',[$fresh?(int)$a['count']+1:1,$fresh?(int)$a['started']:time(),$bucket]);
  });
  $u=$this->one('SELECT * FROM tria_users WHERE email=? AND active=1',[$email]);
  $ok=verifyPassword($pw,$u['password']??'sha256:$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.');
  if(!$u||!$ok)throw new Problem('E-posta veya şifre hatalı.',401);
  if(($b['admin']??false)&&$u['role']!=='admin')throw new Problem('Yönetici erişiminiz bulunmuyor.',403);
  return $this->tx(function()use($u,$b,$bucket){
   $this->sql('DELETE FROM tria_attempts WHERE bucket=? OR started<?',[$bucket,time()-86400]);$this->sql('DELETE FROM tria_sessions WHERE expires<?',[time()]);
   $token=token();$csrf=token();$remember=($b['remember']??false)===true;
   $this->sql('INSERT INTO tria_sessions(token,user_id,expires,csrf) VALUES(?,?,?,?)',[digest($token),$u['id'],time()+($remember?2592000:43200),$csrf]);$this->audit($u['id'],'Giriş yaptı');
   return new Response(['user'=>publicUser($u),'csrf'=>$csrf],200,['Set-Cookie'=>$this->cookie($token,$remember)]);
  });
 }
 private function accept(array $b):Response{
  $token=field($b,'token',100);$name=field($b,'name',100);$pw=field($b,'password',1024);validPassword($pw);
  $i=$this->one('SELECT * FROM tria_invites WHERE token=? AND used=0 AND expires>?'.$this->lock(),[digest($token),time()]);
  if(!$i)throw new Problem('Davet geçersiz veya süresi dolmuş.');if($this->one('SELECT 1 FROM tria_users WHERE email=?',[$i['email']]))throw new Problem('Bu e-posta zaten kayıtlı.');
  $id=id();$this->sql('INSERT INTO tria_users(id,name,email,password,role,active) VALUES(?,?,?,?,?,1)',[$id,$name,$i['email'],hashPassword($pw),$i['role']]);$this->sql('UPDATE tria_invites SET used=1 WHERE token=?',[digest($token)]);$this->audit($id,'Davet ile katıldı');return new Response(['ok'=>true]);
 }
 private function read(string $path,array $u):Response{
  if($path==='/api/me')return new Response(['user'=>publicUser($u),'csrf'=>$u['csrf']]);
  if($path==='/api/state'){
   $admin=$u['role']==='admin';$projects=$admin?$this->all('SELECT * FROM tria_projects ORDER BY created,id'):$this->all('SELECT p.* FROM tria_projects p JOIN tria_members m ON m.project_id=p.id WHERE m.user_id=? ORDER BY p.created,p.id',[$u['id']]);
   $ids=array_column($projects,'id');$marks=$ids?implode(',',array_fill(0,count($ids),'?')):'NULL';
   $tasks=$this->all("SELECT * FROM tria_tasks WHERE project_id IN ($marks) ORDER BY due,created,id",$ids);
   $docs=$this->all("SELECT id,name,project_id,owner,size,created FROM tria_documents WHERE project_id IN ($marks) ORDER BY created DESC",$ids);
   $users=$admin?$this->all('SELECT id,name,email,role,active FROM tria_users ORDER BY name'):$this->all("SELECT DISTINCT u.id,u.name,u.email,u.role,u.active FROM tria_users u LEFT JOIN tria_members m ON u.id=m.user_id WHERE u.id=? OR m.project_id IN ($marks) OR u.id IN (SELECT assignee FROM tria_tasks WHERE project_id IN ($marks)) OR u.id IN (SELECT owner FROM tria_documents WHERE project_id IN ($marks)) ORDER BY u.name",array_merge([$u['id']],$ids,$ids,$ids));
   foreach($users as &$person)$person['active']=(int)$person['active'];unset($person);
   foreach($docs as &$doc){$doc['size']=(int)$doc['size'];$doc['created']=(int)$doc['created'];}unset($doc);
   return new Response(['projects'=>$projects,'tasks'=>$tasks,'documents'=>$docs,'users'=>$users,'members'=>$this->all("SELECT * FROM tria_members WHERE project_id IN ($marks)",$ids)]);
  }
  if(preg_match('~^/api/documents/([a-f0-9]{24})$~D',$path,$m)){
   $doc=$this->one('SELECT * FROM tria_documents WHERE id=?',[$m[1]]);if(!$doc)throw new Problem('Evrak bulunamadı.',404);$this->project($u,$doc['project_id']);$file=$this->config['data_dir'].'/uploads/'.$doc['stored'];
   if(!is_file($file)||!is_readable($file))throw new Problem('Evrak dosyası bulunamadı.',404);
   return new Response(null,200,['Content-Type'=>'application/octet-stream','Content-Disposition'=>"attachment; filename*=UTF-8''".rawurlencode($doc['name'])],$file);
  }
  throw new Problem('İşlem bulunamadı.',404);
 }
 private function write(string $method,string $path,array $b,array $u):Response{
  if($path==='/api/logout'&&$method==='POST'){$this->sql('DELETE FROM tria_sessions WHERE token=?',[$u['session_token']]);return new Response(['ok'=>true],200,['Set-Cookie'=>$this->cookie('',false,true)]);}
  if($path==='/api/projects'&&$method==='POST'){
   $this->admin($u);$id=id();$this->sql('INSERT INTO tria_projects(id,name,location,description,created) VALUES(?,?,?,?,?)',[$id,field($b,'name'),field($b,'location'),field($b,'description',2000,true),time()]);$this->audit($u['id'],'Proje oluşturdu');return new Response(['id'=>$id],201);
  }
  if(preg_match('~^/api/projects/([a-f0-9]{24})/members$~D',$path,$m)&&$method==='POST'){
   $this->admin($u);$pid=$m[1];$this->project($u,$pid);$ids=$b['users']??null;
   if(!is_array($ids)||!array_is_list($ids)||count($ids)>1000)throw new Problem('Kullanıcı listesi geçersiz.');
   foreach($ids as $id)if(!is_string($id)||!$this->one('SELECT 1 FROM tria_users WHERE id=? AND active=1',[$id]))throw new Problem('Kullanıcı bulunamadı.');
   foreach($this->all('SELECT DISTINCT u.id,u.role FROM tria_tasks t JOIN tria_users u ON u.id=t.assignee WHERE t.project_id=?',[$pid]) as $a)if($a['role']!=='admin'&&!in_array($a['id'],$ids,true))throw new Problem('Üyeyi çıkarmadan önce görevlerini başka bir sorumluya aktarın.');
   $this->sql('DELETE FROM tria_members WHERE project_id=?',[$pid]);foreach(array_unique($ids) as $id)$this->sql('INSERT INTO tria_members(project_id,user_id) VALUES(?,?)',[$pid,$id]);$this->audit($u['id'],'Proje erişimlerini güncelledi');return new Response(['ok'=>true]);
  }
  if($path==='/api/tasks'&&$method==='POST'){
   $pid=field($b,'project_id',24);$this->project($u,$pid);$assigned=$u['role']==='admin'?field($b,'assignee',24):$u['id'];$person=$this->one('SELECT * FROM tria_users WHERE id=? AND active=1',[$assigned]);if(!$person)throw new Problem('Sorumlu bulunamadı.');$this->project($person,$pid);
   $title=field($b,'title');$due=field($b,'due',10);$date=\DateTimeImmutable::createFromFormat('!Y-m-d',$due);if(!$date||$date->format('Y-m-d')!==$due)throw new Problem('Geçerli bir tarih seçin.');
   $status=$b['status']??'Planlandı';$priority=$b['priority']??'Orta';$category=$b['category']??'Genel';
   if(!in_array($status,self::STATUSES,true)||!in_array($priority,['Düşük','Orta','Yüksek'],true)||!in_array($category,self::CATEGORIES,true))throw new Problem('Görev alanları geçersiz.');
   $id=id();$this->sql('INSERT INTO tria_tasks(id,title,project_id,assignee,due,status,priority,category,description,created) VALUES(?,?,?,?,?,?,?,?,?,?)',[$id,$title,$pid,$assigned,$due,$status,$priority,$category,field($b,'description',5000,true),time()]);$this->audit($u['id'],'Görev oluşturdu');return new Response(['id'=>$id],201);
  }
  if(preg_match('~^/api/tasks/([a-f0-9]{24})$~D',$path,$m)&&$method==='PATCH'){
   $t=$this->one('SELECT * FROM tria_tasks WHERE id=?',[$m[1]]);if(!$t)throw new Problem('Görev bulunamadı.',404);$this->project($u,$t['project_id']);if($u['role']!=='admin'&&$t['assignee']!==$u['id'])throw new Problem('Yalnızca kendi görevinizi güncelleyebilirsiniz.',403);
   $s=field($b,'status',40);if(!in_array($s,self::STATUSES,true))throw new Problem('Durum geçersiz.');$this->sql('UPDATE tria_tasks SET status=? WHERE id=?',[$s,$t['id']]);$this->audit($u['id'],'Görev durumunu güncelledi');return new Response(['ok'=>true]);
  }
  if($path==='/api/invites'&&$method==='POST'){
   $this->admin($u);$email=strtolower(field($b,'email'));$role=$b['role']??'employee';if(!validEmail($email))throw new Problem('Yalnızca @eksioglutria.com adresleri davet edilebilir.');if(!in_array($role,['admin','employee'],true))throw new Problem('Rol geçersiz.');if($this->one('SELECT 1 FROM tria_users WHERE email=?',[$email]))throw new Problem('Bu kullanıcı zaten kayıtlı.');
   $token=token();$this->sql('UPDATE tria_invites SET used=1 WHERE email=?',[$email]);$this->sql('INSERT INTO tria_invites(token,email,role,expires,used) VALUES(?,?,?,?,0)',[digest($token),$email,$role,time()+172800]);$this->audit($u['id'],'Davet oluşturdu');return new Response(['url'=>$this->config['origin'].'/invite#'.$token,'expires'=>'48 saat'],201);
  }
  if($path==='/api/password'&&$method==='POST'){
   $current=field($b,'current',1024);$pw=field($b,'password',1024);if(!verifyPassword($current,$u['password']))throw new Problem('Mevcut şifreniz hatalı.');validPassword($pw);$this->sql('UPDATE tria_users SET password=? WHERE id=?',[hashPassword($pw),$u['id']]);$this->sql('DELETE FROM tria_sessions WHERE user_id=? AND token<>?',[$u['id'],$u['session_token']]);$this->audit($u['id'],'Şifresini değiştirdi');return new Response(['ok'=>true]);
  }
  if($path==='/api/documents'&&$method==='POST'){
   $pid=field($b,'project_id',24);$this->project($u,$pid);$name=basename(str_replace('\\','/',field($b,'name')));
   if(preg_match('/[\x00-\x1f\x7f]/',$name)||!in_array(strtolower(pathinfo($name,PATHINFO_EXTENSION)),['pdf','png','jpg','jpeg','docx','xlsx','txt','csv'],true))throw new Problem('Desteklenmeyen dosya türü veya adı.');
   if(!is_string($b['content']??null))throw new Problem('Dosya okunamadı.');$bytes=base64_decode($b['content'],true);if($bytes===false||strlen($bytes)===0||strlen($bytes)>10485760)throw new Problem('Boş dosya yüklenemez. Sınır 10 MB.');
   $id=id();$file=$this->config['data_dir'].'/uploads/'.$id;if(file_put_contents($file,$bytes,LOCK_EX)!==strlen($bytes)){@unlink($file);throw new Problem('Dosya kaydedilemedi.',500);}chmod($file,0600);
   try{$this->sql('INSERT INTO tria_documents(id,name,project_id,owner,stored,size,created) VALUES(?,?,?,?,?,?,?)',[$id,$name,$pid,$u['id'],$id,strlen($bytes),time()]);$this->audit($u['id'],'Evrak yükledi');}catch(\Throwable $e){@unlink($file);throw $e;}
   return new Response(['id'=>$id],201);
  }
  throw new Problem('İşlem bulunamadı.',404);
 }
}
