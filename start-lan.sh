#!/usr/bin/env bash
# Ekşioğlu Tria — ofis ağı sunucusu (Linux/macOS). Terminal açık kaldıkça çalışır.
set -eu
cd -- "$(dirname -- "$0")"
if ! command -v php >/dev/null 2>&1; then
  echo 'PHP bulunamadı. Ubuntu: sudo apt install php-cli php-sqlite3 php-curl   macOS: brew install php'
  exit 1
fi
exec php start-lan.php "${1:-8080}" ${2:-}
