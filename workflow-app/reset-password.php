<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
require __DIR__.'/bootstrap.php';
try{
 $email=strtolower($argv[1]??'');if(!Tria\validEmail($email))throw new RuntimeException('Kurumsal e-posta gerekiyor.');
 $pw=rtrim(stream_get_contents(STDIN,1025),"\r\n");Tria\validPassword($pw);$app=new Tria\App(tria_config());
 $app->tx(function()use($app,$email,$pw){$u=$app->one('SELECT id FROM tria_users WHERE email=?',[$email]);if(!$u)throw new RuntimeException('Kullanıcı bulunamadı.');$app->sql('UPDATE tria_users SET password=? WHERE id=?',[Tria\hashPassword($pw),$u['id']]);$app->sql('DELETE FROM tria_sessions WHERE user_id=?',[$u['id']]);$app->sql('INSERT INTO tria_audit(user_id,action,created) VALUES(?,?,?)',[$u['id'],'BT tarafından şifre sıfırlandı',time()]);});
 echo "Şifre değişti; oturumlar kapatıldı.\n";
}catch(Throwable $e){fwrite(STDERR,"Şifre sıfırlanamadı. Kullanıcı, yapılandırma ve şifre uzunluğunu kontrol edin.\n");exit(1);}
