# Quick Search
Spotlight clone in Electron. It allows user to search Google, Bing, Quora and Desktop applications from the application.

## Commands
| Task | Command |
| --- | --- |
| See all apps | `apps:` |
| See history | `history:` |
| See configurations | `configs:` |
| Clear history | `history:clear` |
| Search for app | `apps:<query>` or `<query>` |
| Search on default search engine | `<query>` |
| Search on google | `google:<query>` |
| Search on bing | `bing:<query>` |
| Search on quora | `quora:<query>` |
| Execute terminal command | `<query>` press enter or `cmd:<query>` |

## Building from source
It uses `electron-packager` to build native application executable. To build executable, run
```s
npm run package
```

## Screenshots
### Terminal Command Execution
![Terminal Command](https://raw.githubusercontent.com/riteshkukreja/quick-search/master/screenshots/terminal.png)

### All apps
![Terminal Command](https://raw.githubusercontent.com/riteshkukreja/quick-search/master/screenshots/all_apps.png)

### Search app
![Terminal Command](https://raw.githubusercontent.com/riteshkukreja/quick-search/master/screenshots/search_app.png)

### Search Google
![Terminal Command](https://raw.githubusercontent.com/riteshkukreja/quick-search/master/screenshots/search_google.png)

### Search Bing
![Terminal Command](https://raw.githubusercontent.com/riteshkukreja/quick-search/master/screenshots/search_bing.png)

### Search Quora
![Terminal Command](https://raw.githubusercontent.com/riteshkukreja/quick-search/master/screenshots/search_quora.png)

### History
![Terminal Command](https://raw.githubusercontent.com/riteshkukreja/quick-search/master/screenshots/history.png)

### Configurations
![Terminal Command](https://raw.githubusercontent.com/riteshkukreja/quick-search/master/screenshots/config.png)

### Architecture of application
![Architecture](https://raw.githubusercontent.com/riteshkukreja/quick-search/dev/screenshots/architecture.png)

## TODOs
-   [x] Remove automatic execution of terminal command with `cmd:` flag.
-   [x] Remove execution of terminal commmand on enter-press.
-   [x] Add hook to handle input on key-press to perform some operations (app search or hints) without delay.
-   [ ] Make search flags more visible to user by showing the options in start screen.
-   [ ] Remove search back-end and move to apis for google, bing and quora.
-   [ ] Allow apis key insertion in configurations.
-   [ ] Allow editibility in configurations.
-   [x] Make app search faster.
-   [ ] Add funtionality for calculator, weather, wikipedia and google translate.
-   [ ] Move from app.cache file to db.
-   [ ] Add directory hierarchy to services.
-   [ ] Move to Typescript?
-   [x] Move from `history:clear` command to gui option to clear history.
-   [x] Add hook to do custom operations such as execute terminal commands, clear history
