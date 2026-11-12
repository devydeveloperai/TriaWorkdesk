<?php
declare(strict_types=1);
require_once __DIR__.'/app.php';
function tria_config():array{
 if(PHP_VERSION_ID<80200)throw new RuntimeException('PHP 8.2 gerekiyor.');
 $local=PHP_SAPI==='cli-server'&&getenv('TRIA_LOCAL_MODE')==='1';
 $configFile=__DIR__.($local?'/config.local.php':'/config.php');
 if(!is_file($configFile))throw new RuntimeException('Yapılandırma eksik.');
 $c=require $configFile;
 if(!is_array($c)||!preg_match('~^https?://[a-zA-Z0-9.-]+(?::[0-9]+)?$~D',$c['origin']??''))throw new RuntimeException('Uygulama adresi geçersiz.');
 if(($c['require_https']??true)&&!str_starts_with($c['origin'],'https://'))throw new RuntimeException('HTTPS adresi gerekiyor.');
 $dir=realpath($c['data_dir']??'');$web=realpath($_SERVER['DOCUMENT_ROOT']??dirname(__DIR__).'/public_html');
 if(!$dir||!is_dir($dir)||!is_writable($dir))throw new RuntimeException('storage klasörü yazılabilir olmalı.');
 if($web&&($dir===$web||str_starts_with($dir,$web.DIRECTORY_SEPARATOR)))throw new RuntimeException('Veri klasörü web kökünün dışında olmalı.');
 if(!is_dir($dir.'/uploads')&&!mkdir($dir.'/uploads',0700))throw new RuntimeException('Evrak klasörü oluşturulamadı.');
 return $c;
}
