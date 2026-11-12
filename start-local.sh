#!/usr/bin/env bash
set -eu
cd -- "$(dirname -- "$0")"
if ! command -v php >/dev/null 2>&1; then
  echo 'PHP bulunamadı. Ubuntu terminalinde: sudo apt install php-cli php-sqlite3'
  exit 1
fi
exec php start-local.php "${1:-8000}"
