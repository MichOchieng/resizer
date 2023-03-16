const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'development';
const isMac = process.platform === 'darwin';

function createMainWindow() {
    const mainWindow  = new BrowserWindow({
        title: "Momo Resizer",
        width: isDev ? 1000: 500,
        height: 600
    });

    // Open devtools
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname,'./renderer/index.html'));
}

function createAboutWindow() {
    const aboutWindow  = new BrowserWindow({
        title: "About Momo Resizer",
        width: 300,
        height: 300
    });

    aboutWindow.loadFile(path.join(__dirname,'./renderer/about.html'));
}

// Ready app

app.whenReady().then(() => {
    createMainWindow()

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow()
      }
    })
  })

// Menu templates

const menu = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
            {
                label: 'About',
                click: createAboutWindow,
            }
        ]
    }] : []),
    {
        role: 'fileMenu',
    },
    ...(!isMac ? [{
        label: 'Help',
        submenu: [{
            label: 'About',
            click: createAboutWindow,
        }]
    }] : []),
]

app.on('window-all-closed', () => {
    if (!isMac) {
      app.quit()
    }
  });