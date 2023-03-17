const resizeImg = require("resize-img");

const { app, BrowserWindow, Menu, ipcRenderer, ipcMain, shell } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

let mainWindow;

function createMainWindow() {
    mainWindow  = new BrowserWindow({
        title: "Momo Resizer",
        width: isDev ? 1000: 500,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname,'preload.js')
        }
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

    mainWindow.on('closed', () => (mainWindow = null))
  
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

// IPC Response

ipcMain.on('image:resize',(e,options) => {
    options.dest = path.join(os.homedir(), 'momoresizer');
    resizeImage(options);
})

async function resizeImage({ imgPath, width, height, dest }) {
    try {
        const newPath =  await resizeImg(fs.readFileSync(imgPath), {
            width: +width,
            height: +height,
        });

        const filename = path.basename(imgPath);

        // Create dest if not exist
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }

        // Write file to dest
        fs.writeFileSync(path.join(dest,filename), newPath);

        mainWindow.webContents.send('image:done');

        // Open dest folder
        shell.openPath(dest);

    } catch (error) {
        console.log(error);
    }
}

app.on('window-all-closed', () => {
    if (!isMac) {
      app.quit()
    }
  });