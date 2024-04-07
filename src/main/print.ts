import { BrowserWindow, ipcMain } from 'electron'

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

    printWindow.loadURL('data:text/html,' + encodeURIComponent(htmlText))
    printWindow.webContents.on('did-finish-load', () => {
      console.log(printSetting)
      printWindow.webContents.print(printSetting)
    })
  })
}
