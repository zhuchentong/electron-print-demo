import { BrowserWindow, dialog, ipcMain } from 'electron'

export function usePrintHandle() {
  // 获取系统打印机详情
  ipcMain.handle('getPrinters', async (event) => {
    return await event.sender.getPrintersAsync()
  })

  ipcMain.on('printContent', (_, { htmlText, deviceName, width, height, dpi }) => {
    // 创建一个新的隐藏窗口，用于打印
    const printWindow = new BrowserWindow({
      show: false,
      width: Math.floor((width * dpi) / 25.4),
      height: Math.floor(height * dpi) / 25.4,
      autoHideMenuBar: true,
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
        webSecurity: false,
        allowRunningInsecureContent: true
      }
    })

    const printSetting = {
      deviceName,
      silent: true,
      pageSize: {
        width: width * 100,
        height: height * 100
      },
      scaleFactor: 100,
      landscape: false,
      margins: {
        marginType: 'none'
      },
      dpi: {
        horizontal: dpi,
        vertical: dpi
      }
    } as const
    console.log(printSetting)

    printWindow.loadURL('data:text/html,' + encodeURIComponent(htmlText))
    printWindow.webContents.on('did-finish-load', () => {
      printWindow.webContents.print(printSetting, (success, reason) => {
        if (success) {
          dialog.showMessageBox({
            type: 'info',
            message: '打印成功'
          })
        } else {
          dialog.showErrorBox('打印失败', JSON.stringify(reason))
        }
      })
    })
  })
}
