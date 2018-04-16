import { app, BrowserWindow, Menu, shell, ipcMain } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { composeLibs } from './libs';

const libs = composeLibs();

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

function createMainWindow() {
  const window = new BrowserWindow({ width: 500, height: 500 });

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {

  mainWindow = createMainWindow()
})

/*
  The following creates a listener to handle files dropped onto the window
  and files dropped onto app icon in dock or in Finder
*/
ipcMain.on('process-files', (event, files) => {
  event.preventDefault()
  console.log('process-files')

  libs.files.createJWpubFile(files)
})
console.log('starting...')
app.on('open-file', function (event, filePaths) {
  event.preventDefault()

  if (app.isReady()) {
    libs.files.process(filePaths)
  } else {
    app.once('ready', () => {
      libs.files.process(filePaths)
    })
  }

})
