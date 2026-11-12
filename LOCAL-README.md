# Ekşioğlu Tria — yerel deneme

Bu sürüm yalnızca bilgisayarınızda `http://127.0.0.1:8000` üzerinde çalışır. Hosting, DNS, SSL ve MySQL ayarı gerekmez. PHP 8.2+ ve PDO SQLite gerekir. Kurumsal e-posta hizmetine bağlanmaz; e-posta biçimindeki demo kullanıcı adları yalnızca bu uygulamaya giriş içindir.

## Başlatma

ZIP'i yeni bir klasöre çıkartın. Mevcut hosting dosyalarınıza yüklemeyin.

**Windows:** `start-local.bat` dosyasına çift tıklayın. PATH'teki PHP'yi veya varsa `C:\xampp\php\php.exe` dosyasını kullanır. PHP yoksa önce PHP 8.2+ kurulmalıdır. PHP yapılandırmasında `extension=pdo_sqlite` açık olmalıdır. Apache ve MySQL'i başlatmak gerekmez.

**Ubuntu:** PHP yoksa terminalde `sudo apt install php-cli php-sqlite3` çalıştırın. Ardından çıkarttığınız klasörde `bash start-local.sh` çalıştırın.

**Her sistemde alternatif:** proje klasöründe `php start-local.php`.

Terminalde gösterilen yönetici adresini tarayıcıya yapıştırın: `http://127.0.0.1:8000/admin`.

- Yönetici: `yonetici@eksioglutria.com`
- Çalışan: `calisan@eksioglutria.com`
- İlk açılışta rastgele bir demo şifresi üretilir. Şifre terminalde ve `workflow-app/local-data/demo-access.txt` dosyasında gösterilir. Gerçek kurumsal şifrenizi kullanmayın.

Pencere açık kalmalıdır. Durdurmak için Ctrl+C kullanın. Yeniden başlatmak verileri silmez, örnekleri çoğaltmaz. Port doluysa `php start-local.php 8001` kullanın ve ekrandaki yeni adresi açın. `localhost` yerine ekranda yazan `127.0.0.1` adresini kullanın.

## Deneme akışı

1. Yönetici olarak giriş yapın; üç örnek proje ve dört örnek görevi inceleyin.
2. Yeni görev oluşturun, durumunu değiştirin, bir projeye örnek dosya yükleyip indirin.
3. Takvim, raporlar ve ekip erişimlerini deneyin.
4. Çıkış yapıp çalışan hesabıyla girin; çalışana atanmış görevleri kontrol edin.
5. Sunucuyu durdurup tekrar başlatın; değişiklikler korunur.

Gmail bağlantısı ve otomatik e-posta bu sürümde yoktur. Yerel davet bağlantıları aynı bilgisayarda denenir. Sunucu yerel ağ veya internete açılmaz.

## Dosyalar ve ileride yayınlama

Yerel veriler ve yüklenen belgeler `workflow-app/local-data/` altında tutulur. Yerel ayarlar `workflow-app/config.local.php` dosyasında oluşur. Bu iki konum ve üretimdeki `config.php` `.gitignore` ile git dışında tutulur; Google client secret, Gemini API anahtarı ve `secret_key` gibi bilgileri yalnızca bu dosyalara yazın, sohbet veya commit ile paylaşmayın. `workflow-app/config.php` üretim ayarlarına dokunulmaz. Yerel çalışma yalnızca komut satırıyla başlatılan PHP geliştirme sunucusunda etkinleşir.

Yerel denemeyi sıfırlamak isterseniz sunucuyu durdurup `local-data` klasörünü yedekleyerek başka bir yere taşıyın; sonraki açılış yeni örnek veritabanı oluşturur. Bu işlem eski deneme verilerini yeni oturuma taşımaz.

Yayınlama ayrı bir sonraki aşamadır: `config.local.php`, `local-data`, başlatma dosyaları ve demo hesaplarını hostinge taşımayın. Beğenilen kod değişiklikleri PHP/MySQL üretim paketine aktarılır; SQLite deneme verisi otomatik MySQL'e taşınmaz. Üretim DNS/HTTPS ve MySQL doğrulaması hâlâ gereklidir.
