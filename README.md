# Ekşioğlu Tria Workflow — PHP sürümü

Hedef adres: **https://workflow.eksioglutria.com**

Sunucu tarafı Python'dan PHP 8.2+ ve PDO/MySQL'e taşındı. Çalışan/yönetici girişi, tek kullanımlık davetler, proje erişimleri, görevler, dosyalar, takvim ve raporlar aynı arayüzü kullanır. Composer, Node.js, Python servisi, VPS veya systemd gerekmez.

Önce yerel deneme yapılacaktır. `LOCAL-README.md` ile başlayın; `start-local.bat` (Windows) veya `bash start-local.sh` (Ubuntu) yerel SQLite denemesini açar. Hosting kurulumu tamamlanmış değildir; yayınlama sonraki ayrı aşamadır.

## Paket yerleşimi

ZIP'i önce kendi bilgisayarınızda açın. İki ayrı klasörü doğru yere yükleyin:

| Paket içeriği | DirectAdmin hedefi |
|---|---|
| `public_html/` içeriği | `/domains/workflow.eksioglutria.com/public_html/` |
| `workflow-app/` klasörü | `/domains/workflow.eksioglutria.com/workflow-app/` |
| `tools/setup-key.html` | Yalnızca yerel bilgisayarda açılır; sunucuya yüklenmez. |
| `README.md`, `VALIDATION.md` | Kurulum ve test notları; web köküne yüklenmez. |

`workflow-app`, `public_html` ile aynı seviyede olmalıdır; **içine yerleştirmeyin**. Veritabanı parolası, kurulum ayarları ve yüklenen belgeler özel klasörde kalır. Ana `eksioglutria.com` sitesinin dosyalarını değiştirmeyin. Paketin tamamını `public_html` içine açmayın.

## DirectAdmin kurulumu

1. `workflow.eksioglutria.com` için geçerli SSL sertifikası kurun. Tarayıcı sertifika uyarısı vermeden HTTPS açılmalıdır.
2. Bu alt alan adında **PHP 8.2 veya üzeri** ve **PDO + pdo_mysql** etkin olmalı. Panel incelemesinde PHP 8.2 ve PDO görünüyordu, `pdo_mysql` seçili değildi. Alt alan adı/alan adı kapsamındaki ayarı kullanın. Panel yalnızca hesap geneli ayara izin veriyorsa diğer siteleri etkilemeden hosting desteğiyle etkinleştirin.
3. DirectAdmin → **Veri tabanları** üzerinden uygulamaya özel bir MySQL/MariaDB veritabanı ve ona erişebilen kullanıcı oluşturun. Ana sitenin veritabanını kullanmayın. Panelin verdiği tam adları, kullanıcı önekleri dahil, not alın. Parolayı sohbet mesajına göndermeyin.
4. Yukarıdaki iki klasörü hedeflerine yükleyin. Gizli `.htaccess` ve `.user.ini` dosyaları da aktarılmalı. `workflow-app/storage` PHP kullanıcısı tarafından yazılabilir olmalı; dosya/klasör sahipliği hostinge uygun ayarlanmalı. Herkese yazma izni (`777`) vermeyin. `open_basedir`, bu alt alan adının `workflow-app` klasörüne PHP erişimine izin vermeli.
5. `workflow-app/config.example.php` dosyasını **aynı özel klasörde** `config.php` adıyla kopyalayın. `db.name`, `db.user`, `db.password` değerlerini doldurun. `origin` tam olarak `https://workflow.eksioglutria.com` kalmalı. `require_https` üretimde `true` kalmalı.
6. Bilgisayarınızda `tools/setup-key.html` dosyasını güncel tarayıcıyla açın ve **Güvenli anahtar üret** seçeneğine basın. Ağ isteği yapılmaz. İkinci kutudaki SHA-256 özetini `config.php` içindeki `setup_token_hash` değerine yazın. İlk kutudaki gizli anahtarı kurulum için saklayın.
7. **https://workflow.eksioglutria.com/setup** adresini açın. Gizli kurulum anahtarını, yönetici adını, gerçek `@eksioglutria.com` e-postasını ve en az 12 karakterlik parolayı girin. Yönetici şifresini hesap sahibi belirlemelidir. Şema ve ilk yönetici oluşturulur; kurulum tekrar yönetici oluşturmayı reddeder.
8. Başarılı kurulumdan sonra `config.php` içindeki `setup_token_hash` değerini yeniden boş string (`''`) yapın. Kurulum zaten veritabanında kilitlenir; bu ek adım anahtarı tamamen devre dışı bırakır.
9. `/admin` adresinden giriş yapın. Proje oluşturun, **Ekip → Çalışan davet et** ile bir test çalışanı davet edin; **Projeler → Ekip ve erişim yönetimi** ile proje erişimini atayın. Görev oluşturma, durum güncelleme, evrak yükleme/indirme ve çıkışı kontrol edin.

Sunucuda Apache 2.4 veya uyumlu LiteSpeed rewrite desteği ve `.htaccess` izni gerekir. Nginx-only kurulumlarda aynı yönlendirmeler sunucu yapılandırmasına eklenmelidir. Standart DirectAdmin PHP hosting hedeflenmiştir. ZIP'teki `public_html/index.php` giriş noktasıdır; `index.html` arayüz şablonudur ve PHP üzerinden sunulur.

## İşlevler ve yetkiler

- Yöneticiler tüm projelere erişir; proje oluşturur, ekip erişimi ve davetleri yönetir, proje üyelerine görev atar.
- Çalışanlar yalnızca erişim verilen projeleri, görevleri ve belgeleri görür. Kendilerine görev oluşturur ve kendi görevlerinin durumunu günceller.
- Davetler yalnızca `@eksioglutria.com` adresleri için, tek kullanımlık ve 48 saat geçerlidir. Bağlantı kopyalanıp elle paylaşılır; otomatik e-posta gönderimi yoktur.
- Proje bazlı filtreler, görev arama, aylık takvim, durum dağılımı, CSV raporu kullanılabilir.
- Kentsel Dönüşüm, Belediye & Ruhsat, Şantiye ve Satış & CRM bölümleri kategori bazlı görev listeleridir; ayrı malik/satış veritabanı modülleri değildir.
- Belgeler en fazla 10 MB; PDF, PNG, JPG, DOCX, XLSX, TXT, CSV kabul edilir. İndirme her istekte proje yetkisi kontrolünden geçer.
- Şifre değişikliği diğer oturumları, çıkış mevcut oturumu iptal eder.

Gmail OAuth, otomatik e-posta, MFA, kullanıcı devre dışı bırakma/rol değiştirme arayüzü, görev sorumlusu değiştirme ve silme bu sürüme dahil değildir. Üzerinde görev bulunan bir çalışanın proje erişimi kaldırılamaz. Eski Python veritabanı otomatik taşınmaz; bu paket yeni kurulum içindir. Eski sürümde gerçek veri varsa ayrı bir veri ve parola geçişi hazırlanmalıdır. Bu projede üretim verisi oluşturulduğuna dair kanıt yoktur.

Girişteki mimari çizim ve yeniden oluşturulan logo korunmuştur. Özgün fotoğraf ve resmi vektör logo henüz uygulanmadı. Bu PHP dönüşümü görsel tasarımı değiştirmez.

## Güvenlik

Parolalar SHA-256 ön özet + bcrypt ile saklanır; bcrypt'in 72 bayt sınırı parola kesilmesine neden olmaz. Oturum ve davet anahtarları kriptografik rastgele üretilir; veritabanında yalnızca SHA-256 özetleri bulunur. HTTPS oturum çerezi `__Host-`, `HttpOnly`, `Secure`, `SameSite=Strict` kullanır; başka alt alan adlarıyla paylaşılmaz. CSRF ve Origin kontrolü yazma işlemlerini korur. Giriş denemeleri IP+hesap başına 15 dakikada 8 denemeyle sınırlıdır. SQL işlemleri PDO prepared statements kullanır. Kurulum boş bir anahtar özetiyle varsayılan olarak kapalıdır; kurulum anahtarı URL'ye yazılmaz.

Dosyalar rastgele adlarla özel klasöre kaydedilir; çalıştırılmaz ve attachment olarak indirilir. Virüs taraması dahil değildir. Hata yanıtları bağlantı parolası veya SQL ayrıntıları göstermez. Kullanıcı e-postaları yalnızca yetkili ekip görünümünde sunulur.

## Yedekleme ve güncelleme

MySQL veritabanının tamamını ve `workflow-app/storage/` klasörünü birlikte yedekleyin. Tutarlı yedek için bakım aralığında yazmaları durdurun; DirectAdmin/phpMyAdmin dışa aktarımını kullanın. `config.php` dosyasını erişimi kısıtlı biçimde ayrıca saklayın. Yedekleri `public_html` içine koymayın. Düzenli geri yükleme testi yapın.

Kod güncellenirken mevcut `config.php`, veritabanı ve `storage` üzerine yazmayın. Bu pakette gerçek parola, kurulum anahtarı veya canlı veri yoktur.

## Şifre kurtarma

E-posta ile otomatik kurtarma yoktur. SSH/terminal erişimi olan BT sorumlusu, özel klasörde `reset-password.php` aracını kullanabilir:

```bash
php reset-password.php ad.soyad@eksioglutria.com < /ozel/yeni-sifre.txt
```

Parola komut satırı argümanına veya kabuk geçmişine girmez. Geçici parola dosyasına yalnızca BT hesabı erişebilmeli ve işlemden sonra kaldırılmalıdır. Bu araç yeni kullanıcı açmaz; mevcut kullanıcının parolasını değiştirip tüm oturumlarını kapatır. SSH yoksa BT/hosting desteği gerekir.

## Test ve yerel geliştirme

Sunucu servisi testleri gerçek PHP ve geçici PDO SQLite veritabanıyla çalışır:

```bash
php -d extension=pdo_sqlite workflow-app/tests/run.php
```

Eklenti zaten etkinse yalnızca `php workflow-app/tests/run.php` yeterlidir. Üretim veritabanına dokunmaz. MySQL/MariaDB sunucu bağlantısı ayrıca canlı kurulumda doğrulanmalıdır.

Geliştirme için `config.php` içinde `origin=http://127.0.0.1:8000`, `require_https=false`, `db=['driver'=>'sqlite','path'=>__DIR__.'/storage/local.sqlite']` kullanılabilir. İndirilen paketteki `public_html` klasörünü yerelde `public` olarak adlandırdıktan sonra proje kökünde:

```bash
php -S 127.0.0.1:8000 -t public workflow-app/router.php
```

Bu HTTP ayarlarını üretime taşımayın. Ayrıntılı doğrulama durumu `VALIDATION.md` dosyasındadır.
