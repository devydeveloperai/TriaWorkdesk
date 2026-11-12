<?php
declare(strict_types=1);
ini_set('display_errors','0');umask(0077);
header('Cache-Control: no-store');header('X-Content-Type-Options: nosniff');header('X-Frame-Options: DENY');header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
// Özel uygulama klasörü web kökünün dışında aranır:
//  - Ayrı alan adı:  /domains/workdesk.../public_html  →  /domains/workdesk.../workflow-app
//  - Alt alan adı:   /domains/eksioglutria.com/public_html/workdesk  →  /domains/eksioglutria.com/workflow-app
$bootstrap='';
foreach([dirname(__DIR__),dirname(__DIR__,2)] as $base)if(is_file($base.'/workflow-app/bootstrap.php')){$bootstrap=$base.'/workflow-app/bootstrap.php';break;}
if($bootstrap===''){http_response_code(503);header('Content-Type: text/plain; charset=utf-8');echo 'Uygulama dosyaları henüz kurulmadı.';exit;}
require $bootstrap;
$method=$_SERVER['REQUEST_METHOD']??'GET';$path=parse_url($_SERVER['REQUEST_URI']??'/',PHP_URL_PATH)?:'/';
$https=(!empty($_SERVER['HTTPS'])&&strtolower((string)$_SERVER['HTTPS'])!=='off')||(int)($_SERVER['SERVER_PORT']??0)===443;
if($https)header('Strict-Transport-Security: max-age=31536000');
try{
 $c=tria_config();
 if(($c['require_https']??true)&&!$https){
  if($method==='GET'&&!str_starts_with($path,'/api/')){header('Location: '.$c['origin'].(in_array($path,['/','/admin','/login','/invite','/setup'],true)?$path:'/'),true,302);exit;}
  throw new Tria\Problem('HTTPS bağlantısı gerekiyor.');
 }
 // Google OAuth geri dönüşü: oturum çerezi (SameSite=Strict) gelmez; kullanıcı 'state' ile doğrulanır.
 if($path==='/google/callback'&&$method==='GET'){(new Tria\App($c))->googleCallback($_GET)->emit();exit;}
 if(str_starts_with($path,'/api/')){
  if(!in_array($method,['GET','POST','PATCH','PUT','DELETE'],true))throw new Tria\Problem('Desteklenmeyen yöntem.',405);
  $body=[];
  if($method!=='GET'){
   if(!preg_match('/^[0-9]+$/D',(string)($_SERVER['CONTENT_LENGTH']??'0'))||(int)($_SERVER['CONTENT_LENGTH']??0)>15000000)throw new Tria\Problem('İstek boyutu sınırı aşıldı.',413);
   if(strtolower(trim(explode(';',$_SERVER['CONTENT_TYPE']??'')[0]))!=='application/json')throw new Tria\Problem('JSON bekleniyor.',415);
   $stream=fopen('php://input','rb');$raw=stream_get_contents($stream,15000001);fclose($stream);
   if($raw===false||strlen($raw)>15000000)throw new Tria\Problem('İstek boyutu sınırı aşıldı.',413);
   // DELETE isteklerinde gövde gönderilmeyebilir; boş gövde boş nesne sayılır.
   if($method==='DELETE'&&trim($raw)==='')$raw='{}';
   try{$obj=json_decode($raw,false,32,JSON_THROW_ON_ERROR);}catch(JsonException){throw new Tria\Problem('İstek okunamadı.');}
   if(!$obj instanceof stdClass)throw new Tria\Problem('JSON nesnesi bekleniyor.');$body=(array)$obj;
  }
  $a=new Tria\App($c);$a->handle($method,$path,$body,['origin'=>$_SERVER['HTTP_ORIGIN']??'','csrf'=>$_SERVER['HTTP_X_CSRF_TOKEN']??'','cookie'=>$_COOKIE[$a->cookieName()]??'','ip'=>$_SERVER['REMOTE_ADDR']??'','query'=>$_GET])->emit();exit;
 }
 if($method==='GET'&&in_array($path,['/','/admin','/login','/invite','/setup'],true)){header('Content-Type: text/html; charset=utf-8');readfile(__DIR__.($path==='/setup'?'/setup.html':'/index.html'));exit;}
 throw new Tria\Problem('Sayfa bulunamadı.',404);
}catch(Tria\Problem $e){(new Tria\Response(['error'=>$e->getMessage()],$e->status))->emit();}
catch(Throwable $e){error_log('Tria bootstrap: '.get_class($e));(new Tria\Response(['error'=>'Kurulum yapılandırması tamamlanmadı. PHP sürücüsü, veritabanı ve özel klasör izinlerini kontrol edin.'],503))->emit();}
