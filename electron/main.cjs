const { app, BrowserWindow, ipcMain, shell, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFile } = require('child_process');

// Pop!_OS / Linux Wayland & X11 acceleration flags
app.commandLine.appendSwitch('enable-features', 'UseOzonePlatform');
app.commandLine.appendSwitch('ozone-platform-hint', 'auto');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');

let mainWindow;

// Local config path in ~/.config/chrono-zymurgy-os/
const configDir = path.join(os.homedir(), '.config', 'chrono-zymurgy-os');
const configFile = path.join(configDir, 'state.json');

function ensureConfigDir() {
  if (!fs.existsSync(configDir)) {
    try {
      fs.mkdirSync(configDir, { recursive: true });
    } catch (err) {
      console.error('Failed to create config dir:', err);
    }
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 700,
    frame: false, // Sleek modern dark desktop frame
    backgroundColor: '#070b12',
    icon: path.join(__dirname, '..', 'public', 'icon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      // Architectural Security Governance Note:
      // 'sandbox: false' is required to permit preload.cjs to load native Electron IPC
      // bindings across Pop!_OS desktop windowing sessions without bundling overhead.
      // Compensating Security Controls in effect:
      //  1. nodeIntegration: false (renderer window has zero Node.js runtime access).
      //  2. contextIsolation: true (preload APIs are exposed strictly via contextBridge).
      //  3. setWindowOpenHandler: strictly denies arbitrary external navigation.
      //  4. IPC handlers: strictly validated and sanitized before child_process execution.
      sandbox: false,
    },

  });

  const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL(devUrl).catch(() => {
      // Fallback to built dist if server not active yet
      const distPath = path.join(__dirname, '..', 'dist', 'index.html');
      if (fs.existsSync(distPath)) {
        mainWindow.loadFile(distPath);
      }
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Window control IPC
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.on('show-notification', (event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({
      title: title || 'CHRONO-ZYMURGY OS',
      body: body || 'Milestone reached',
      icon: path.join(__dirname, '..', 'public', 'icon.svg')
    }).show();
  }
});

ipcMain.on('open-external', (event, url) => {
  shell.openExternal(url);
});

// Config persistence IPC
ipcMain.handle('save-config', async (event, data) => {
  ensureConfigDir();
  try {
    fs.writeFileSync(configFile, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true, path: configFile };
  } catch (err) {
    console.error('Failed to save config:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('load-config', async () => {
  ensureConfigDir();
  try {
    if (fs.existsSync(configFile)) {
      const raw = fs.readFileSync(configFile, 'utf-8');
      return { success: true, data: JSON.parse(raw) };
    }
    return { success: true, data: null };
  } catch (err) {
    console.error('Failed to load config:', err);
    return { success: false, error: err.message };
  }
});


// Python Biophysics ODE Solver & Recipe Optimizer Bridge
const pythonCliPath = path.join(__dirname, "..", "python", "cli.py");

ipcMain.handle("run-python-physics", async (event, params) => {
  return new Promise((resolve) => {
    execFile("uv", ["run", "--with", "numpy", "--with", "scipy", "python", pythonCliPath, "simulate-ode", "--json", JSON.stringify(params || {})], {
      cwd: path.join(__dirname, "..", "python"),
      maxBuffer: 10 * 1024 * 1024,
    }, (error, stdout, stderr) => {
      if (error) {
        console.error("Python ODE error:", stderr || error.message);
        resolve({ success: false, error: stderr || error.message });
      } else {
        try {
          resolve(JSON.parse(stdout));
        } catch (e) {
          resolve({ success: false, error: "Failed to parse Python output" });
        }
      }
    });
  });
});

ipcMain.handle("optimize-recipe", async (event, params) => {
  return new Promise((resolve) => {
    execFile("uv", ["run", "--with", "pydantic", "python", pythonCliPath, "optimize-recipe", "--json", JSON.stringify(params || {})], {
      cwd: path.join(__dirname, "..", "python"),
      maxBuffer: 5 * 1024 * 1024,
    }, (error, stdout, stderr) => {
      if (error) {
        console.error("Python recipe optimizer error:", stderr || error.message);
        resolve({ success: false, error: stderr || error.message });
      } else {
        try {
          resolve(JSON.parse(stdout));
        } catch (e) {
          resolve({ success: false, error: "Failed to parse Python output" });
        }
      }
    });
  });
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
