import { BrowserWindow, ipcMain } from 'electron'

export function usePrintHandle() {
  // 获取系统打印机详情
  ipcMain.handle('getPrinters', async (event) => {
    return await event.sender.getPrintersAsync()
  })

  ipcMain.on('printContent', (_, { htmlText, deviceName }) => {
    // 创建一个新的隐藏窗口，用于打印
    const printWindow = new BrowserWindow({
      show: false,
      width: 300,
      height: 300,
      autoHideMenuBar: true,
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
        webSecurity: false,
        allowRunningInsecureContent: true
      }
    })

    printWindow.loadURL('data:text/html,' + encodeURIComponent(htmlText))

    printWindow.webContents.on('did-finish-load', () => {
      printWindow.webContents.print({ deviceName, silent: true })
    })
  })
}
