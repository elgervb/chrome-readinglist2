# ChromeReadinglist2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.0.

## Deploy

run
```
yarn build --prod
```
make sure you've bumped the version in package.json and manifest.json

then zip the contents of the `dist` directory
```
zip -r -j -X dist/chrome-readinglist2.zip ./dist/chrome-readinglist2/
``` 

goto Chrome extensions dashboard: https://chrome.google.com/webstore/devconsole

Upload the zip as a new package
