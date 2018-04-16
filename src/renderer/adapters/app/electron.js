import { remote, ipcRenderer } from 'electron'
const settings = remote.require('electron-settings');

export class AppAdapter {
  constructor() {

  }
  filesDropped(acceptedFiles) {
    const acceptedFilePaths = acceptedFiles.map(f => f.path)
    ipcRenderer.send('process-files', acceptedFilePaths)
  }


}