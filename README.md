# `Monthly Bill Planner`

<a href="https://codebeat.co/projects/github-com-antonjacobsson-monthly-bill-planner-master"><img alt="codebeat badge" src="https://codebeat.co/badges/69fd2f5c-7b87-4f20-b1e6-7601754d7011" /></a>

This project is bootstrapped by [aurelia-cli](https://github.com/aurelia/cli).

For more information, go to https://aurelia.io/docs/cli/webpack

## Run dev app

Run `npm start`, then open `http://localhost:8080`

You can change the standard webpack configurations from CLI easily with something like this: `npm start -- --open --port 8888`. However, it is better to change the respective npm scripts or `webpack.config.js` with these options, as per your need.

## Build for production

Run `npm run build:cordova`,
Or
Run `npm run build:pwa`,

## Cordova (make sure to build before this step)

```shell
cordova platform add android
cordova platform add browser
```

To run the app 
```shell
cordova run android
cordova run browser
```

Build the app (android) 
```shell
cordova build android
cordova build android -release
```
