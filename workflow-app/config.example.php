<?php
// Save as config.php in workflow-app, OUTSIDE public_html.
return [
 'origin'=>'https://workflow.eksioglutria.com',
 'require_https'=>true,
 'setup_token_hash'=>'', // SHA-256 of the random setup key. Empty disables installation.
 'data_dir'=>__DIR__.'/storage',
 'db'=>['driver'=>'mysql','host'=>'localhost','port'=>3306,'name'=>'DATABASE_NAME','user'=>'DATABASE_USER','password'=>''],
 // Google anahtarlarını veritabanında şifrelemek için 64 karakterlik hex anahtar.
 // Üretmek için: php -r "echo bin2hex(random_bytes(32)),PHP_EOL;"  — değiştirilirse kullanıcılar Google'ı yeniden bağlar.
 'secret_key'=>'',
 // Google Workspace (Gmail, Drive, Takvim). Boş bırakılırsa ilgili ekranlar "yapılandırılmadı" uyarısı gösterir.
 // Yönlendirme adresi (Google Cloud → OAuth istemcisi): https://workflow.eksioglutria.com/google/callback
 'google'=>['client_id'=>'','client_secret'=>'','hosted_domain'=>'eksioglutria.com'],
 // Gemini asistanı: Google AI Studio veya Vertex/Cloud projesinden alınan API anahtarı.
 'gemini'=>['api_key'=>'','model'=>'gemini-2.5-flash'],
];
