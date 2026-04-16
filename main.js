const { app, BrowserWindow, nativeImage, Menu } = require("electron");
const fs = require("fs");
const path = require("path");

if (!app.isPackaged) {
  app.commandLine.appendSwitch("disable-http-cache");
}

function resolveIconPath() {
  const assetsIco = path.join(__dirname, "assets", "app.ico");
  const assetsPng = path.join(__dirname, "assets", "logo.png");
  if (process.platform === "win32" && fs.existsSync(assetsIco)) return assetsIco;
  if (fs.existsSync(assetsPng)) return assetsPng;
  const ico = path.join(__dirname, "build", "icon.ico");
  const png = path.join(__dirname, "build", "icon.png");
  if (process.platform === "win32" && fs.existsSync(ico)) return ico;
  if (fs.existsSync(png)) return png;
  if (fs.existsSync(ico)) return ico;
  const devParent = path.join(__dirname, "..", "NAS logo.png");
  if (fs.existsSync(devParent)) return devParent;
  return null;
}

/** Custom menu without Ctrl/Cmd+N so "Add bill" works in the app (default menu binds New Window). */
function installAppMenu() {
  const isMac = process.platform === "darwin";
  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    {
      label: "File",
      submenu: isMac ? [{ role: "close" }] : [{ role: "quit" }],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac ? [{ role: "pasteAndMatchStyle" }, { role: "delete" }] : [{ role: "delete" }]),
        { type: "separator" },
        { role: "selectAll" },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow() {
  const iconPath = resolveIconPath();
  const icon = iconPath ? nativeImage.createFromPath(iconPath) : null;

  const win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1120,
    minHeight: 720,
    title: "NAS Budget",
    backgroundColor: "#e8f4e6",
    autoHideMenuBar: true,
    icon: icon && !icon.isEmpty() ? icon : undefined,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.webContents.on("did-finish-load", () => {
    const logoPath = path.join(__dirname, "assets", "logo.png");
    let mtime = Date.now();
    try {
      mtime = fs.statSync(logoPath).mtimeMs;
    } catch (_) {
      /* assets may be missing until first build:icons */
    }
    const bust = String(mtime) + "-" + String(Date.now());
    const js =
      "(function(){var v=" +
      JSON.stringify(bust) +
      ';var f=document.getElementById("favicon");if(f)f.setAttribute("href","assets/logo.png?v="+encodeURIComponent(v));var l=document.querySelector(".logo-img");if(l)l.setAttribute("src","assets/logo.png?v="+encodeURIComponent(v));})();';
    win.webContents.executeJavaScript(js, true).catch(() => {});
  });

  win.webContents.session
    .clearCache()
    .catch(() => {})
    .finally(() => {
      win.loadFile(path.join(__dirname, "index.html"));
    });
}

app.whenReady().then(() => {
  app.setName("NAS Budget");
  if (process.platform === "win32") {
    app.setAppUserModelId("com.nas.budget");
  }
  installAppMenu();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
