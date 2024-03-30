<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Versions from './components/Versions.vue'

const printDevices = ref<string[]>([])

async function getPrintList() {
  const prints = await window.electron.ipcRenderer.invoke('getPrinters')
  printDevices.value = prints.map((x) => x.name)
}

function getPrintContent() {
  return `
  <!doctype html>
  <html lang='en'>
    <head>
      <meta charset='utf-8'>
      <title>打印</title>
      <style>
        html,body,#app{
          width: 100%;
          height: 100%;
          margin:0;
          padding:0;
          box-sizing: border-box;
        }

        div {
          font-size: 2rem;
        }
      </style>
    </head>
    <body>
      <div id="app" style='padding:0 20px;display: flex;flex-direction:column;align-items: flex-start;justify-content: center;'>
        <div>
          测试打印1: TEST
        </div>
        <div>
          测试打印2: ${new Date().toLocaleString()}
        </div>
      </div>
    </body>
  </html>
  `
}

async function onPrint(deviceName: string) {
  const printData = {
    htmlText: getPrintContent(),
    deviceName
  }

  window.electron.ipcRenderer.send('printContent', printData)
}

onMounted(() => {
  getPrintList()
})
</script>

<template>
  <div>
    <div>设备数量: {{ printDevices.length }}</div>
    <div v-for="item in printDevices" :key="item" class="print-item">
      <div>{{ item }}</div>
      <div style="padding-left: 50px">
        <button @click="() => onPrint(item)">打印</button>
      </div>
    </div>
  </div>
  <Versions />
</template>

<style scoped>
.print-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}
</style>
