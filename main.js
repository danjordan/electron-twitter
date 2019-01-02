'use strict';

const path = require('path');
const { app, BrowserWindow, session, shell, Tray } = require('electron');

app.on('ready', () => {
  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  const browserWindow = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: false,
    frame: false,
    transparent: true,
    show: false
  });

  browserWindow.on('blur', event => {
    browserWindow.hide();
  });

  session.defaultSession.webRequest.onBeforeRequest(
    ['*twitter.com'],
    (details, callback) => {
      callback({ cancel: false });
    }
  );

  browserWindow.webContents.on('new-window', (event, url) => {
    shell.openExternal(url);
    event.preventDefault();
  });

  browserWindow.loadURL('https://twitter.com');

  const iconName = 'images/IconTemplate.png';
  const iconPath = path.join(__dirname, iconName);

  const tray = new Tray(iconPath);

  tray.setToolTip('Twitter');

  tray.on('click', () => {
    const trayPos = tray.getBounds();
    const windowPos = browserWindow.getBounds();

    const x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
    const y = Math.round(trayPos.y + trayPos.height);

    browserWindow.setPosition(x, y, false);
    browserWindow.isVisible() ? browserWindow.hide() : browserWindow.show();
    browserWindow.focus();
  });
});
