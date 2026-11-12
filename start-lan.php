<?php
/**
 * EKŞİOĞLU TRIA — OFİS AĞI (LAN) SUNUCUSU
 *
 * Bu bilgisayarda uygulamayı başlatır; aynı Wi-Fi/ağdaki herkes tarayıcıdan bağlanır.
 * Her açılışta "Paylasilacak" klasörüne güncel adresi içeren kısayollar yazılır:
 *   - "Tria Workdesk.html" : her bilgisayarda/telefonda çift tıklayınca açılır
 *   - "Tria Workdesk.url"  : Windows internet kısayolu
 * Bu dosyaları çalışanlarla paylaşın.
 *
 * Kullanım:  php start-lan.php [port] [ip]
 *   port varsayılan 8080; ip verilmezse bu bilgisayarın ağ adresi otomatik bulunur.
 *
 * Veriler workflow-app/lan-data altında (SQLite) tutulur; demo verisi YÜKLENMEZ.
 * İlk açılışta yöneticiyi oluşturmak için kurulum anahtarı ekrana yazılır.
 */
declare(strict_types=1);
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
umask(0077);

// 1) Gereksinimler
if(PHP_VERSION_ID<80200)exit("PHP 8.2 veya üzeri gerekiyor.\n");
if(!extension_loaded('pdo_sqlite'))exit("PDO SQLite eksik. Ubuntu: sudo apt install php-cli php-sqlite3\nWindows: php.ini içinde extension=pdo_sqlite etkin olmalı.\n");

// 2) Port ve ağ adresi
$port=$argv[1]??'8080';
if(!preg_match('/^[0-9]{4,5}$/D',$port)||(int)$port<1024||(int)$port>65535)exit("Port 1024-65535 arasında olmalı.\n");

/** Bu bilgisayarın yerel ağ (LAN) IPv4 adresi. UDP "bağlantısı" paket göndermez; yalnızca hangi ağ kartının kullanılacağını öğrenir. */
function lanIp():string{
 foreach(['8.8.8.8:53','1.1.1.1:53','192.168.1.1:53'] as $target){
  $s=@stream_socket_client('udp://'.$target,$e,$es,1);
  if(!$s)continue;
  $ip=explode(':',(string)stream_socket_get_name($s,false))[0];fclose($s);
  if(filter_var($ip,FILTER_VALIDATE_IP,FILTER_FLAG_IPV4)&&!str_starts_with($ip,'127.')&&$ip!=='0.0.0.0')return $ip;
 }
 $ip=gethostbyname(gethostname());
 return filter_var($ip,FILTER_VALIDATE_IP,FILTER_FLAG_IPV4)&&!str_starts_with($ip,'127.')?$ip:'';
}
$ip=$argv[2]??(getenv('TRIA_LAN_IP')?:lanIp());
if(!filter_var($ip,FILTER_VALIDATE_IP,FILTER_FLAG_IPV4))exit("Bu bilgisayarın ağ adresi bulunamadı. Wi-Fi'ye bağlı olduğunuzdan emin olun ya da adresi elle verin:\n  php start-lan.php $port 192.168.1.50\n");
$probe=@stream_socket_server('tcp://0.0.0.0:'.$port,$errno,$error);
if(!$probe)exit("$port portu kullanımda. Başka bir port deneyin: php start-lan.php 8081\n");
fclose($probe);

// 3) Veri klasörü ve tek kopya kilidi
$private=__DIR__.'/workflow-app';$dir=$private.'/lan-data';
if(!is_dir($dir)&&!mkdir($dir,0700,true))exit("Veri klasörü oluşturulamadı: $dir\n");
if(!is_dir($dir.'/uploads'))mkdir($dir.'/uploads',0700);
$lock=fopen($dir.'/launcher.lock','c');
if(!$lock||!flock($lock,LOCK_EX|LOCK_NB))exit("Ofis sunucusu bu klasörde zaten çalışıyor.\n");

// 4) Yapılandırma: önceki dosyadaki gizli anahtarlar (secret_key, gemini, google) korunur.
$configFile=$private.'/config.lan.php';
$prev=is_file($configFile)?(include $configFile):[];if(!is_array($prev))$prev=[];
$origin='http://'.$ip.':'.$port;
$c=['origin'=>$origin,'require_https'=>false,'setup_token_hash'=>'','data_dir'=>$dir,'db'=>['driver'=>'sqlite','path'=>$dir.'/workflow.sqlite']];
$c['secret_key']=is_string($prev['secret_key']??null)&&preg_match('/^[a-f0-9]{64}$/D',$prev['secret_key'])?$prev['secret_key']:bin2hex(random_bytes(32));
foreach(['gemini','google'] as $k)if(is_array($prev[$k]??null))$c[$k]=$prev[$k];

require $private.'/app.php';
$app=new Tria\App($c);$app->migrate();

// 5) İlk kurulum: yönetici henüz yoksa kurulum anahtarı üretilir (aynı anahtar sonraki açılışlarda da gösterilir).
$keyFile=$dir.'/kurulum-anahtari.txt';$installed=(bool)$app->one('SELECT value FROM tria_meta WHERE name=?',['installed']);
if(!$installed){
 $setupKey=is_file($keyFile)?trim((string)file_get_contents($keyFile)):'';
 if(!preg_match('/^[a-f0-9]{64}$/D',$setupKey)){$setupKey=bin2hex(random_bytes(32));file_put_contents($keyFile,$setupKey."\n");}
 $c['setup_token_hash']=hash('sha256',$setupKey);
}elseif(is_file($keyFile))unlink($keyFile); // Kurulum bitti: anahtar artık gerekmez.
file_put_contents($configFile,"<?php\n// Ofis ağı ayarları — start-lan.php her açılışta yeniden yazar. GİZLİDİR, paylaşmayın.\nreturn ".var_export($c,true).";\n");
chmod($configFile,0600);

// 6) Paylaşılacak kısayollar (güncel adresle)
$share=__DIR__.'/Paylasilacak';if(!is_dir($share))mkdir($share);chmod($share,0755); // umask 0077 olduğu için izin ayrıca verilir.
$safe=htmlspecialchars($origin,ENT_QUOTES);
file_put_contents($share.'/Tria Workdesk.html',"<!doctype html>\n<html lang=\"tr\"><head><meta charset=\"utf-8\"><title>Tria Workdesk</title><meta http-equiv=\"refresh\" content=\"0;url=$safe/\"></head>\n<body style=\"font-family:Arial,sans-serif;padding:40px\"><p>Tria Workdesk açılıyor… Açılmazsa: <a href=\"$safe/\">$safe</a></p>\n<p style=\"color:#777\">Ofis Wi-Fi ağına bağlı olmanız ve sunucu bilgisayarın açık olması gerekir.</p></body></html>\n");
file_put_contents($share.'/Tria Workdesk.url',"[InternetShortcut]\r\nURL=$origin/\r\n");
foreach(glob($share.'/*')?:[] as $f)chmod($f,0644);

// 7) Bilgilendirme
$line=str_repeat('=',64);
echo "\n$line\n EKŞİOĞLU TRIA — OFİS AĞI SUNUCUSU\n$line\n";
echo " Adres (herkes için):  $origin\n";
echo " Paylaşılacak dosyalar: ".$share."\n   → \"Tria Workdesk.html\" (her cihazda çalışır) ve \"Tria Workdesk.url\" (Windows)\n";
if(!$installed){
 echo "\n İLK KURULUM: $origin/setup adresini açın.\n Kurulum anahtarı: $setupKey\n Yönetici adınızı, @eksioglutria.com e-postanızı ve en az 12 karakterlik bir parola girin.\n Çalışanları sonra Ekip → Çalışan davet et ile ekleyin.\n";
}
echo "\n Bu pencere açık kaldığı sürece uygulama çalışır. Durdurmak: Ctrl+C\n";
echo " Bu bilgisayar uyku moduna geçmemeli. Adres değişirse kısayolları yeniden paylaşın\n (kalıcı adres için modemde bu bilgisayara sabit IP / DHCP rezervasyonu verin).\n";
echo " Windows güvenlik duvarı sorarsa \"Özel ağlar\" için izin verin.\n";
if(!isset($c['gemini']))echo " Not: Gemini anahtarı tanımlı değil; config.lan.php içine eklenebilir.\n";
echo "$line\n\n";

// 8) Sunucu: tüm ağ arayüzlerinde dinler (0.0.0.0). Windows dışında aynı anda birden çok isteğe yanıt için 4 işçi.
putenv('TRIA_LOCAL_MODE=lan');
if(PHP_OS_FAMILY!=='Windows')putenv('PHP_CLI_SERVER_WORKERS=4');
$web=is_dir(__DIR__.'/public_html')?__DIR__.'/public_html':__DIR__.'/public';
$args=[PHP_BINARY];$ini=php_ini_loaded_file();if($ini){$args[]='-c';$args[]=$ini;}
$extensionDir=ini_get('extension_dir');$args[]='-d';$args[]='extension_dir='.$extensionDir;
foreach(['pdo','pdo_sqlite','openssl','curl','sodium'] as $ext){
 $file=$extensionDir.DIRECTORY_SEPARATOR.(PHP_OS_FAMILY==='Windows'?'php_'.$ext.'.dll':$ext.'.so');
 if(!$ini&&!extension_loaded($ext)&&is_file($file)){$args[]='-d';$args[]='extension='.$file;}
}
$args=array_merge($args,['-S','0.0.0.0:'.$port,'-t',$web,$private.'/router.php']);
$process=proc_open($args,[0=>STDIN,1=>STDOUT,2=>STDERR],$pipes,__DIR__);
if(!is_resource($process))exit("PHP sunucusu başlatılamadı.\n");
exit(proc_close($process));
