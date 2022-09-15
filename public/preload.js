const { contextBridge, ipcRenderer } = require("electron");

const API = {
	getMac: () => ipcRenderer.invoke("mac"),
};

contextBridge.exposeInMainWorld("api", API);
