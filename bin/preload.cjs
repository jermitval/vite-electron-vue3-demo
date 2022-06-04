const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("ipc", {
  send: (channel, arg) => {
    return ipcRenderer.send(channel.toString(), arg)
  },
  on: (channel, callback) => {
    return ipcRenderer.on(channel.toString(), callback)
  },
  axios: async option => {
    return await ipcRenderer.invoke("axios", option)
  }
})
