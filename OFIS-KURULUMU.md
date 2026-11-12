# Ekşioğlu Tria — ofis ağında çalıştırma

Uygulama ofisteki **bir bilgisayarda** (sunucu bilgisayar) çalışır. Aynı Wi-Fi/ağdaki herkes kendi bilgisayarından veya telefonundan tarayıcıyla bağlanır. İnternet alan adı, hosting veya SSL gerekmez.

## Sunucu bilgisayar (bir kez kurulur)

1. **PHP 8.2+** kurun.
   - **Windows:** [windows.php.net](https://windows.php.net/download/) adresinden "VS16 x64 Thread Safe" ZIP'ini `C:\php` klasörüne açıp `C:\php`'yi PATH'e ekleyin. `php.ini-production` dosyasını `php.ini` olarak kopyalayın. İçinde `extension=pdo_sqlite`, `extension=curl`, `extension=openssl`, `extension=sodium` ve `extension=mbstring` satırlarının başındaki `;` işaretini kaldırın. XAMPP kuruluysa `C:\xampp\php\php.exe` otomatik kullanılır.
   - **Ubuntu:** `sudo apt install php-cli php-sqlite3 php-curl php-mbstring`
   - **macOS:** `brew install php`
2. Paketi bilgisayarda kalıcı bir klasöre açın (ör. `C:\TriaWorkdesk`).
3. **Windows:** `start-lan.bat` dosyasına çift tıklayın. **Ubuntu/macOS:** `bash start-lan.sh`
4. Windows güvenlik duvarı sorarsa **Özel ağlar** için izin verin.
5. İlk açılışta ekranda `http://192.168.x.x:8080/setup` adresi ve bir **kurulum anahtarı** yazar. Bu adresi açıp anahtarı, yönetici adınızı, `@eksioglutria.com` e-postanızı ve en az 12 karakterlik parolanızı girin.
6. Yönetici olarak giriş yapın. Projeleri oluşturun ve **Ekip → Çalışan davet et** ile çalışanları davet edin. Davet bağlantısını çalışana iletin.

Pencere açık kaldığı sürece uygulama çalışır. Sunucu bilgisayar **uyku moduna geçmemeli**. Verilerin tamamı `workflow-app/lan-data` klasöründedir; bu klasörü düzenli olarak yedekleyin.

## Çalışanlara paylaşılacak dosya

Sunucu her açıldığında, uygulama klasöründeki **`Paylasilacak`** klasörüne güncel adresi içeren iki kısayol yazar:

- **`Tria Workdesk.html`** — her bilgisayarda ve telefonda çift tıklayınca tarayıcıda uygulamayı açar.
- **`Tria Workdesk.url`** — Windows masaüstü kısayolu.

Bu dosyaları WhatsApp, e-posta veya ortak klasör ile paylaşın. Dosyalarda şifre veya gizli bilgi yoktur, yalnızca sunucunun ağ adresi vardır. Çalışanlar uygulamayı yalnızca **ofis Wi-Fi'sine bağlıyken** açabilir.

**Adres değişmesin diye:** Modem/router arayüzünden sunucu bilgisayara **sabit IP (DHCP rezervasyonu)** verin. Aksi halde bilgisayar yeniden başladığında adres değişebilir; o zaman yeni kısayolları tekrar paylaşmanız gerekir. Adresi elle de verebilirsiniz: `php start-lan.php 8080 192.168.1.50`

## Bu kurulumda olanlar ve olmayanlar

- **Çalışır:** görevler, projeler, ekip ve rol yetkileri, evrak, takvim, raporlar, dashboard, **Gemini asistanı**. Gemini için sunucu bilgisayarın internete erişmesi gerekir.
- **Çalışmaz:** **Gmail, Google Drive ve Google Takvim.** Google, yerel ağ adreslerine giriş yönlendirmesine izin vermez. Bu menüler bu kurulumda gizlenir. Uygulama ileride HTTPS'li bir alan adına taşındığında açılır.
- **Güvenlik:** Bağlantı ofis ağı içinde şifresiz HTTP'dir. Ofis Wi-Fi'sinin parolalı (WPA2/WPA3) olması ve misafirlerin ayrı bir misafir ağı kullanması gerekir.
- **Kapasite:** Linux/macOS'ta sunucu aynı anda 4 isteğe yanıt verir. Windows'ta istekler sırayla işlenir; küçük bir ekip için yeterlidir.
