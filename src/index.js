import isRenderer from "is-electron-renderer"
import { ipcRenderer, ipcMain, BrowserWindow, remote } from "electron"

export default function electronShare(store){
  const channel = "@electron-redux-actions"
  const currWindow = isRenderer ? remote.getCurrentWindow().id : null

  const handler = (event, action) => store.dispatch(action)

  if(isRenderer){
    ipcRenderer.on(channel, handler)
  }else{
    ipcMain.on(channel, handler)
  }

  return next => action => {
    let newAction = action
    let windows = (isRenderer ? remote.BrowserWindow : BrowserWindow).getAllWindows()
    if(!action.fromWindow && !action.fromMain && !action.private){
      if(isRenderer){
        newAction = {
          ...action,
          fromMain: false,
          fromWindow: currWindow
        }
        ipcRenderer.send(channel, newAction)
        windows = windows.filter(win => win.id != currWindow)
      }else{
        newAction = {
          ...action,
          fromMain: true,
          fromWindow: 0
        }
      }
      windows.forEach(win => {
        win.webContents.send(channel, newAction)
      })
    }

    next(action)
  }
}
