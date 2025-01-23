# ChromeReadinglist2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.0.

Chrome Manifest Version 3 API: https://developer.chrome.com/docs/extensions/reference/

## Deploy

run
```
yarn build
```
make sure you've bumped the version in `package.json` and `manifest.json`

then zip the contents of the `chrome-readinglist2` directory
```
cd dist/chrome-readinglist2
rm *.zip
zip -r -X chrome-readinglist2.zip ./chrome-readinglist2/
cd ../..
ls -lhk dist/*.zip
``` 

goto Chrome extensions dashboard: https://chrome.google.com/webstore/devconsole

Upload the zip as a new package
