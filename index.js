const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
const url = require("url");
var log = require('electron-log');


let win = null;

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  // Someone tried to run a second instance, we should focus our window.
        log.info("Checking for running version of app: Global Shortcut Status: " + globalShortcut.isRegistered('CommandOrControl+L'));
  if (win) {
    win.show();
  }
});

if (shouldQuit) {
    log.info("Quiting second instance: Global Shortcut Status: " + globalShortcut.isRegistered('CommandOrControl+L'));
  app.quit();
  return;
}

app.on("ready", () => {

    win = new BrowserWindow({
        width: 1000,
        height: 600,
        transparent: true,
        frame: false
    });

    win.on("close", () => {
        log.info("Closing window: Global Shortcut Status: " + globalShortcut.isRegistered('CommandOrControl+L'));
        win = null;
    });

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, "app", "index.html"),
            protocol: "file",
            slashes: true
        })
    );

    win.on('ready-to-show', () => {
        log.info("ready-to-show: Global Shortcut Status: " + globalShortcut.isRegistered('CommandOrControl+L'));
        win.show()
    });

    win.on("blur", () => {
        log.info("blur: Global Shortcut Status: " + globalShortcut.isRegistered('CommandOrControl+L'));
        win.hide();
    });

    app.on('window-all-closed', () => {
        log.info("window-all-closed: Global Shortcut Status: " + globalShortcut.isRegistered('CommandOrControl+L'));
        globalShortcut.unregisterAll();
        if (process.platform !== 'darwin') {
            log.info("window-all-closed, quiting app: Global Shortcut Status: " + globalShortcut.isRegistered('CommandOrControl+L'));
            app.quit()
        }
    });

    const ret = globalShortcut.register('CommandOrControl+L', () => {
        log.info("registering shortcut: " + globalShortcut.isRegistered('CommandOrControl+L'));
        win.show();
    });

    if (!ret) {
        log.error("registration failed");
    }

    app.on('will-quit', () => {
        // Unregister all shortcuts.
        globalShortcut.unregisterAll();
        
        log.info("will-quit: Global Shortcut Status: " + globalShortcut.isRegistered('CommandOrControl+L'));
    });

    app.on('before-quit', () => {
        if(win) {
            win.removeAllListeners('close');
            win.close();  
        }
        log.info("before-quit: Global Shortcut Status: " + globalShortcut.isRegistered('CommandOrControl+L'));
        
    });

    
});

