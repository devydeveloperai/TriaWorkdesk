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

## Görev/ekip yönetimi ve dashboard — 12 Kasım 2026

PHP 8.3 altında servis testleri **109 kontrolle** geçti (64 mevcut + 45 yeni). Yeni kontroller: görev düzenleme yetkisi (yönetici, proje üyesi, üye olmayan), yeni sorumlunun proje üyeliği, görev silmenin yalnızca yöneticiye açık olması, "Finans & Muhasebe" kategorisi, özel rol oluşturma/çoğaltma reddi/silme kısıtları, davette özel rol, kullanıcı rol değiştirme, pasife almanın oturumu ve girişi kapatması, yöneticinin kendi rolünü değiştirememesi.

Yerel sunucuda Playwright/Chromium ile şunlar kontrol edildi: menüde Finans & Muhasebe'nin Kentsel Dönüşüm'ün altında olması, dashboard panelleri, görev düzenleme ve sorumlu değiştirme, yönetici silmesi, çalışanda Sil düğmesinin görünmemesi, rol oluşturma/atama, pasife alma ve yeniden etkinleştirme, 390 px genişlikte yatay taşma olmaması. Konsolda CSP hatası görülmedi (barlar satır içi stil yerine SVG nitelikleriyle çizilir). Canlı Apache/LiteSpeed sunucusunda PUT/DELETE yöntemlerine izin verildiği ayrıca doğrulanmalıdır.

## Rol yetkileri, Google Workspace ve Gemini — 12 Kasım 2026

Servis testleri **176 kontrolle** geçti (109 önceki + 67 yeni). Yeni kontroller:
- **Rol yetkileri:** tüm projeler, proje yönetimi, görev atama/silme, Gmail, Drive ve Gemini yetkilerinin sunucuda uygulanması; bilinmeyen yetki ve yerleşik rol düzenleme reddi.
- **Google bağlantısı:** PKCE ve `hd` parametreli bağlantı adresi; farklı e-postalı Google hesabının reddedilmesi; `state` tekrar kullanımının reddi; anahtarların veritabanında şifreli olması; anahtar yenileme; çözülemeyen anahtarda bağlantının kaldırılması; bağlantıyı kaldırırken iptal.
- **Gmail:** listeleme; HTML gövdenin script içermeyen düz metne çevrilmesi; ek adları; MIME/UTF-8 konu; yanıt dizisi; başlık enjeksiyonu reddi.
- **Drive ve Takvim:** listeleme ve arama sorgusu kaçışı; E-Tablonun xlsx olarak evraka aktarılması; desteklenmeyen türün ve yetkisiz projenin reddi; takvim etkinliği.
- **Gemini:** istek yalnızca kullanıcının görebildiği verileri içerir; görev taslağı doğru eşlenir ve kendiliğinden görev oluşturulmaz; geçmiş doğrulaması; yetki kontrolü.

Google ve Gemini yanıtları testlerde taklit edildi (`App::$transport`). Yerel sunucuda Playwright/Chromium ile sahte Google uç noktalarına karşı şu akışlar denendi:
- Google ile bağlanma ve geri dönüşte oturumun korunması (SameSite=Strict çerez); e-posta eşleşmeme uyarısı.
- Gmail listeleme, okuma, yanıtlama ve e-postadan görev oluşturma.
- Drive'dan evraka aktarma ve takvime ekleme.
- Gemini panelinde yanıt ve görev taslağını formdan onaylama.
- Rol oluşturma ve yetki seçimi; yetkiye göre menü/düğme görünürlüğü.
- 390 px mobil görünüm.

**Gerçek Google hesabı, Google Cloud OAuth istemcisi ve Gemini API anahtarıyla canlı doğrulama yapılmadı.** Bu bilgiler sağlandıktan sonra README'deki kurulum adımlarıyla denenmelidir.
