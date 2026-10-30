#!/usr/bin/env bash
set -e

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "=========================================================="
echo "  CHRONO-ZYMURGY OS: Pop!_OS Desktop Launcher Installer  "
echo "=========================================================="
echo "Target directory: $APP_DIR"

# 1. Build production assets if not built
if [ ! -d "$APP_DIR/dist" ]; then
  echo "[1/4] Building Vite production bundle..."
  cd "$APP_DIR" && npm run build
else
  echo "[1/4] Production bundle exists (run 'npm run build' to update)."
fi

# 2. Create launcher wrapper script
LAUNCHER_SCRIPT="$APP_DIR/launch-chrono-zymurgy.sh"
echo "[2/4] Generating native launcher script: $LAUNCHER_SCRIPT"
cat << 'EOF' > "$LAUNCHER_SCRIPT"
#!/usr/bin/env bash
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export ELECTRON_ENABLE_LOGGING=1
export OZONE_PLATFORM=auto

# Launch Electron with native Pop!_OS Wayland/X11 acceleration
exec npx electron "$APP_DIR" --enable-features=UseOzonePlatform --ozone-platform-hint=auto "$@"
EOF

chmod +x "$LAUNCHER_SCRIPT"

# 3. Install desktop icon
ICON_DIR="$HOME/.local/share/icons/hicolor/scalable/apps"
mkdir -p "$ICON_DIR"
cp "$APP_DIR/icon.svg" "$ICON_DIR/chrono-zymurgy-os.svg"
echo "[3/4] Installed scalable icon to $ICON_DIR/chrono-zymurgy-os.svg"

# 4. Create Desktop Entry in ~/.local/share/applications
DESKTOP_DIR="$HOME/.local/share/applications"
mkdir -p "$DESKTOP_DIR"
DESKTOP_FILE="$DESKTOP_DIR/chrono-zymurgy-os.desktop"

cat << EOF > "$DESKTOP_FILE"
[Desktop Entry]
Version=1.0
Type=Application
Name=CHRONO-ZYMURGY OS
GenericName=Pinter & Tau-Protocol Engine
Comment=The Open-Source Pinter & Tau-Protocol Brewing Engine (Soma-Kinetic & Living-Rhythm)
Exec="$LAUNCHER_SCRIPT" %U
Icon=$ICON_DIR/chrono-zymurgy-os.svg
Terminal=false
StartupWMClass=chrono-zymurgy-os
Categories=Science;Utility;Education;FoodDrink;AudioVideo;
Keywords=Pinter;Brewing;Beer;Yeast;Fermentation;Tau;Zymurgy;
StartupNotify=true
Actions=Tracker;Simulator;MasterCatalog;

[Desktop Action Tracker]
Name=Multi-Pinter Active Tracker
Exec="$LAUNCHER_SCRIPT" --view=tracker

[Desktop Action Simulator]
Name=Yeast Dynasty Simulator
Exec="$LAUNCHER_SCRIPT" --view=simulator

[Desktop Action MasterCatalog]
Name=23-Kit Master Catalog
Exec="$LAUNCHER_SCRIPT" --view=catalog
EOF

chmod +x "$DESKTOP_FILE"
echo "[4/4] Created desktop entry: $DESKTOP_FILE"

# Refresh desktop database if tool available
if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database "$DESKTOP_DIR" || true
fi

echo "=========================================================="
echo "  Installation Successful!                                "
echo "  You can now launch 'CHRONO-ZYMURGY OS' directly from   "
echo "  the Pop!_OS Super-Key / Application Launcher!           "
echo "=========================================================="
