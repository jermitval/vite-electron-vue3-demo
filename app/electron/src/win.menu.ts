import { Menu } from "electron"
import { isMac } from "../config"

/**
 * 设置右键菜单
 * @param win 窗口实例
 */
export default function (win: Electron.BrowserWindow) {
  win.webContents.on("context-menu", (e, params) => {
    const c = params.editFlags
    const ed = params.isEditable
    const { x, y } = params
    const menu = Menu.buildFromTemplate([
      {
        label: "重新加载",
        accelerator: "CmdOrCtrl+R",
        role: "reload",
        registerAccelerator: true,
        visible: !ed
      },
      {
        label: "撤销",
        accelerator: "CmdOrCtrl+Z",
        role: "undo",
        enabled: c.canUndo,
        visible: ed
      },
      {
        label: "重做",
        accelerator: "CmdOrCtrl+Y",
        role: "redo",
        enabled: c.canRedo,
        visible: ed
      },
      {
        label: "剪切",
        accelerator: "CmdOrCtrl+X",
        role: "cut",
        enabled: c.canCut,
        visible: ed
      },
      {
        label: "复制",
        accelerator: "CmdOrCtrl+C",
        role: "copy",
        enabled: c.canCopy,
        visible: c.canCopy || ed
      },
      {
        label: "粘贴",
        accelerator: "CmdOrCtrl+V",
        role: "paste",
        enabled: c.canPaste,
        visible: ed
      }
    ])
    if (!isMac) Menu.setApplicationMenu(menu)
    menu.popup({ window: win, x, y })
  })
}
