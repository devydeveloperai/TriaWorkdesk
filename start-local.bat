@echo off
cd /d "%~dp0"
where php >nul 2>nul
if not errorlevel 1 goto run
if exist "C:\xampp\php\php.exe" (
  "C:\xampp\php\php.exe" start-local.php %*
  goto done
)
echo PHP bulunamadi. PHP 8.2+ kurulu olmali ve pdo_sqlite etkin olmali.
echo XAMPP varsa C:\xampp\php\php.exe otomatik kullanilir.
goto done
:run
php start-local.php %*
:done
pause
