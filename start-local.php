<?php
/** Local-only launcher. Does not use or modify production config.php. */
declare(strict_types=1);
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
umask(0077);
if(PHP_VERSION_ID<80200)exit("PHP 8.2 veya üzeri gerekiyor.\n");
if(!extension_loaded('pdo_sqlite'))exit("PDO SQLite eksik. Ubuntu: sudo apt install php-cli php-sqlite3\nWindows: php.ini içinde extension=pdo_sqlite etkin olmalı.\n");
$port=$argv[1]??'8000';
if(!preg_match('/^[0-9]{4,5}$/D',$port)||(int)$port<1024||(int)$port>65535)exit("Port 1024-65535 arasında olmalı.\n");
$probe=@stream_socket_server('tcp://127.0.0.1:'.$port,$errno,$error);
if(!$probe)exit("$port portu kullanımda. Örnek: php start-local.php 8001\n");
fclose($probe);
$private=__DIR__.'/workflow-app';$dir=$private.'/local-data';
if(!is_dir($dir)&&!mkdir($dir,0700,true))exit("Yerel veri klasörü oluşturulamadı.\n");
if(!is_dir($dir.'/uploads'))mkdir($dir.'/uploads',0700);
$lock=fopen($dir.'/launcher.lock','c');
if(!$lock||!flock($lock,LOCK_EX|LOCK_NB))exit("Bu klasörde uygulama zaten çalışıyor.\n");
$c=['origin'=>'http://127.0.0.1:'.$port,'require_https'=>false,'setup_token_hash'=>'','data_dir'=>$dir,'db'=>['driver'=>'sqlite','path'=>$dir.'/workflow.sqlite']];
require $private.'/app.php';
$app=new Tria\App($c);$app->migrate();
if(!$app->one('SELECT value FROM tria_meta WHERE name=?',['installed'])){
 $pw=bin2hex(random_bytes(10));
 $app->tx(function()use($app,$pw){
  $admin=Tria\id();$employee=Tria\id();
  foreach([[$admin,'Demo Yönetici','yonetici@eksioglutria.com','admin'],[$employee,'Demo Çalışan','calisan@eksioglutria.com','employee']] as [$id,$name,$email,$role])
   $app->sql('INSERT INTO tria_users(id,name,email,password,role,active) VALUES(?,?,?,?,?,1)',[$id,$name,$email,Tria\hashPassword($pw),$role]);
  $projects=[];
  foreach([['Tria Kordonboyu','Kordonboyu / Kartal'],['Tria Green Life','Atalar / Kartal'],['Tria Acıbadem','İkbaliye / Kadıköy']] as [$name,$location]){
   $id=Tria\id();$projects[]=$id;
   $app->sql('INSERT INTO tria_projects(id,name,location,description,created) VALUES(?,?,?,?,?)',[$id,$name,$location,'Yerel inceleme için örnek proje.',time()]);
   $app->sql('INSERT INTO tria_members(project_id,user_id) VALUES(?,?)',[$id,$employee]);
  }
  foreach([['Malik görüşmesi',0,1,'Devam ediyor','Yüksek','Kentsel Dönüşüm'],['Ruhsat başvurusu',1,3,'Beklemede','Orta','Belediye & Ruhsat'],['Tapu devir takibi',2,5,'Planlandı','Düşük','Satış & CRM'],['A-F blok saha kontrolü',0,2,'Devam ediyor','Yüksek','Şantiye']] as [$title,$project,$days,$status,$priority,$category])
   $app->sql('INSERT INTO tria_tasks(id,title,project_id,assignee,due,status,priority,category,description,created) VALUES(?,?,?,?,?,?,?,?,?,?)',[Tria\id(),$title,$projects[$project],$employee,date('Y-m-d',strtotime('+'.$days.' days')),$status,$priority,$category,'Örnek görev — yerel test verisidir.',time()]);
  $app->sql('INSERT INTO tria_meta(name,value) VALUES(?,?)',['installed',(string)time()]);
 });
 file_put_contents($dir.'/demo-access.txt',"Yalnızca yerel deneme hesapları\nYönetici: yonetici@eksioglutria.com\nÇalışan: calisan@eksioglutria.com\nİki hesabın başlangıç şifresi: $pw\nŞifreyi uygulamada değiştirirsen bu kayıt güncellenmez.\n");
}
file_put_contents($private.'/config.local.php',"<?php\nreturn ".var_export($c,true).";\n");
putenv('TRIA_LOCAL_MODE=1');
$web=is_dir(__DIR__.'/public_html')?__DIR__.'/public_html':__DIR__.'/public';
echo "\nEKŞİOĞLU TRIA — YEREL DENEME\n";
echo "Yönetici: ".$c['origin']."/admin\nÇalışan: ".$c['origin']."/login\n";
echo "Bu pencere açık kalmalı. Durdurmak için Ctrl+C.\nVeriler workflow-app/local-data içinde saklanır.\n\n";
if(is_file($dir.'/demo-access.txt'))echo file_get_contents($dir.'/demo-access.txt');
// Reuse loaded configuration, including custom PHP extension settings, in child server.
$args=[PHP_BINARY];$ini=php_ini_loaded_file();if($ini){$args[]='-c';$args[]=$ini;}
$extensionDir=ini_get('extension_dir');
$args[]='-d';$args[]='extension_dir='.$extensionDir;
foreach(['pdo','pdo_sqlite'] as $ext){
 $file=$extensionDir.DIRECTORY_SEPARATOR.(PHP_OS_FAMILY==='Windows'?'php_'.$ext.'.dll':$ext.'.so');
 if(!$ini&&is_file($file)){$args[]='-d';$args[]='extension='.$file;}
}
$args=array_merge($args,['-S','127.0.0.1:'.$port,'-t',$web,$private.'/router.php']);
$process=proc_open($args,[0=>STDIN,1=>STDOUT,2=>STDERR],$pipes,__DIR__);
if(!is_resource($process))exit("PHP sunucusu başlatılamadı.\n");
exit(proc_close($process));
