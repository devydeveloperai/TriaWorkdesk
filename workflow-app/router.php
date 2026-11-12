<?php
// Local development: php -S 127.0.0.1:8000 -t public workflow-app/router.php
$path=parse_url($_SERVER['REQUEST_URI']??'/',PHP_URL_PATH);
if(in_array($path,['/app.js','/style.css','/fonts.css','/mark.svg','/building.svg','/setup.js'],true))return false;
$root=dirname(__DIR__);
require (is_dir($root.'/public_html')?$root.'/public_html':$root.'/public').'/index.php';
