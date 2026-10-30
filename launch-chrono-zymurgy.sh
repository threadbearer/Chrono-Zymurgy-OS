#!/usr/bin/env bash
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export ELECTRON_ENABLE_LOGGING=1
export OZONE_PLATFORM=auto

# Launch Electron with native Pop!_OS Wayland/X11 acceleration
exec npx electron "$APP_DIR" --enable-features=UseOzonePlatform --ozone-platform-hint=auto "$@"
