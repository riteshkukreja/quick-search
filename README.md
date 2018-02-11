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
