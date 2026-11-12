# Doğrulama — PHP uyarlaması

Tarih: 12 Kasım 2026.

## Tamamlanan kontroller

- PHP 8.2.32: gerçek PDO SQLite veritabanı ve dosya sistemi üzerinde **64 servis kontrolü geçti**.
- PHP 8.4.27: aynı 64 servis kontrolü geçti.
- PHP 8.2.32 geliştirme sunucusu üzerinden gerçek HTTP istekleriyle **27 kontrol geçti**.
- PHP kaynaklarının sözdizimi kontrolü ve `app.js` / `setup.js` JavaScript sözdizimi kontrolü geçti.

Testlerde geçici kullanıcı, parola, proje, dosya ve veritabanı kullanıldı. Canlı hosting, gerçek kullanıcılar ve mevcut web sitesinde bu turda değişiklik yapılmadı. Test anahtarları, parolaları ve veritabanları pakete dahil edilmedi.

## Kontrol edilen davranışlar

Kurulum anahtarı ve istek kaynağı doğrulaması; ilk yönetici oluşturulduktan sonra tekrar kurulumun reddedilmesi; çalışanların yönetici işlemlerine erişememesi; proje üyelikleri; yetkisiz projenin görev ve evraklarının gizlenmesi; kendi görevinin durumunu güncelleme; başkasının görevini değiştirememe; tarih/durum doğrulaması; dosyanın birebir indirilebilmesi; tehlikeli dosya uzantıları ve bozuk base64 reddi; e-posta alan adı kısıtı; davetin tek kullanımı ve süre sonu; şifre değişikliğinin diğer oturumları kapatması; çıkış; giriş deneme sınırı; bcrypt uzun parola kesilmesinin önlenmesi.

HTTP kontrolü ayrıca giriş/kurulum sayfa yollarını, özel dosya yollarının reddini, bozuk JSON/content-type reddini, çerez niteliklerini, CSRF/Origin akışını, görev ve evrak uçlarını doğruladı. HTTP testinde ctype uzantısına bağımlılık tespit edildi ve standart düzenli ifade kontrolüyle kaldırıldı.

## Canlı kurulumda doğrulanacaklar

- Gerçek hosting üzerinde **MySQL/MariaDB bağlantısı ve şema kurulumu**: yerelde test veritabanı SQLite idi; MySQL şeması hazırlanmış olsa da canlı MySQL motorunda çalıştırılmadı.
- DirectAdmin PHP işleyicisi, `pdo_mysql`, `.htaccess` rewrite kuralları ve özel klasöre erişim (`open_basedir`).
- DNS ve geçerli HTTPS sertifikası; HTTPS'de Secure/__Host çerezinin tarayıcıda davranışı.
- Masaüstü ve mobil tarayıcı yerleşimi; uygulamanın tam kullanıcı akışı.

Yerel HTTP testi PHP geliştirme router'ını kullandı; Apache/LiteSpeed `.htaccess` yapılandırmasının canlı doğrulaması değildir. HTTPS çerez nitelikleri servis testlerinde doğrulandı; gerçek TLS sonlandırması test edilmedi.

## Testi tekrarlamak

`php workflow-app/tests/run.php` komutu PDO SQLite uzantısı gerektirir. Test kendi geçici veritabanını oluşturur ve siler; config.php'yi ve üretim verisini kullanmaz.

`tools/http_smoke.py` yalnızca `localhost` veya `127.0.0.1` adresini kabul eder. Yeni, boş ve geçici bir kurulumla çalıştırılmalıdır; ilk yöneticiyi ve test kayıtlarını oluşturur. Kullanım:

```bash
python3 tools/http_smoke.py http://127.0.0.1:8000 /ozel/test-kurulum-anahtari.txt
```

Bunu üretim üzerinde çalıştırmayın. Python yalnızca geliştiriciye yönelik bu ek test aracında kullanılır; PHP uygulamasının çalışma gereksinimi değildir.

## Yerel başlatıcı — 12 Kasım 2026

PHP 8.2.32 altında 64 servis testi ve 19 yerel HTTP kontrolü geçti. Yönetici/çalışan girişi, yetki sınırları, Origin kontrolü, görev oluşturma/güncelleme, belge yükleme/indirme, özel dosyaların erişime kapalı olması ve çıkış doğrulandı. Başlatıcı yeniden çalıştırıldığında görev değişikliği korundu; kullanıcı ve projeler çoğalmadı. Windows BAT dosyası bu Linux ortamında çalıştırılmadı. Kullanıcının bilgisayarında PHP/SQLite kurulumu henüz doğrulanmadı. Tarayıcıda görsel inceleme bu aşamada yapılmadı.
