// @ts-check

const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  const newTab = new BrowserWindow({
    width: 500,
    height: 200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  newTab.on('close', (e) => {
    e.preventDefault();
    newTab.hide();
  });

  newTab.hide();
  ipcMain.handle('visit', async (event, url) => {
    await mainWindow.loadURL(url);
    newTab.hide();
  });

  newTab.loadFile(path.join(__dirname, 'openURL.html'));

  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: 'New Tab (kind of)',
        click: () => {
          newTab.show();
        },
      },
      {
        label: 'Dev Tools',
        click: () => mainWindow.webContents.openDevTools(),
      },
    ])
  );

  // and load the index.html of the app.
  mainWindow.loadURL('https://google.com', {
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
