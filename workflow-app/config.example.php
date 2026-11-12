<?php
// Save as config.php in workflow-app, OUTSIDE public_html.
return [
 'origin'=>'https://workflow.eksioglutria.com',
 'require_https'=>true,
 'setup_token_hash'=>'', // SHA-256 of the random setup key. Empty disables installation.
 'data_dir'=>__DIR__.'/storage',
 'db'=>['driver'=>'mysql','host'=>'localhost','port'=>3306,'name'=>'DATABASE_NAME','user'=>'DATABASE_USER','password'=>''],
];
