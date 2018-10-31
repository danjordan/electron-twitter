'use strict';

const path = require('path')
const { app, BrowserWindow, shell, Tray } = require('electron');

app.on('ready', () => {
  
  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  var browserWindow = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: false,
    frame: false,
    transparent: true,
    show: false
  });

  browserWindow.on('blur', () => {
    browserWindow.hide();
  });

  browserWindow.webContents.on('did-get-redirect-request', (event, oldURL, newURL, isMainFrame) => {
    if (isMainFrame) {
      setTimeout(() => browserWindow.loadURL(newURL), 100);
      event.preventDefault();
    }
  });

  browserWindow.webContents.on('new-window', (event, url) => {
    shell.openExternal(url);
    event.preventDefault();
  });

  browserWindow.loadURL('https://twitter.com');

  const iconName = 'images/IconTemplate.png';
  const iconPath = path.join(__dirname, iconName);

  var tray = new Tray(iconPath);
  
  tray.setToolTip('Twitter');

  tray.on('click', () => {
    const trayPos = tray.getBounds();
    const windowPos = browserWindow.getBounds();
    let x, y = 0;

    if (process.platform == 'darwin') {
      x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2));
      y = Math.round(trayPos.y + trayPos.height);
    } else {
      x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2));
      y = Math.round(trayPos.y + trayPos.height * 10);
    }
  
    browserWindow.setPosition(x, y, false);
    browserWindow.isVisible() ? browserWindow.hide() : browserWindow.show();
    browserWindow.focus();
  });

});
