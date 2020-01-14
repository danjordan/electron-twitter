const path = require("path");
const { app, BrowserWindow, shell, Tray } = require("electron");

app.on("ready", () => {
  if (process.platform === "darwin") {
    app.dock.hide();
  }

  const browserWindow = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: false,
    frame: false,
    show: false
  });

  browserWindow.on("blur", () => browserWindow.hide());

  browserWindow.webContents.on("new-window", (event, url) => {
    shell.openExternal(url);
    event.preventDefault();
  });

  browserWindow.loadURL("https://twitter.com");

  const image = path.join(__dirname, "images/IconTemplate.png");

  const tray = new Tray(image);

  tray.setToolTip("Twitter");

  tray.on("click", () => {
    const trayBounds = tray.getBounds();
    const windowBounds = browserWindow.getBounds();

    const x = Math.round(
      trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
    );
    const y = Math.round(trayBounds.y + trayBounds.height);

    browserWindow.setPosition(x, y, false);
    browserWindow.isVisible() ? browserWindow.hide() : browserWindow.show();
    browserWindow.focus();
  });
});
