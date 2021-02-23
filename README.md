# `Monthly Bill Planner`

[![codebeat badge](https://codebeat.co/badges/69fd2f5c-7b87-4f20-b1e6-7601754d7011)](https://codebeat.co/projects/github-com-antonjacobsson-monthly-bill-planner-master)

## Organize bills and plan your future expenses

### Monthly Bill Planner is an app that will let you organize your bills and calculate your monthly expenses.

#### Disclaimer:
The App does not access your bank account. You need to enter bills manually. Data is stored locally on your device

#### Features:
- Store your Bills (which are stored locally)
- Bills can be paid weekly, bi-weekly, monthly, bi-monthly, quarterly, semi-annually, annually. You can also set up your own custom pay period.
- Mark bills as paid
- Multiple bill planning tabs are available
- Calculates your bills by even out the cost per month
- Display bill data in charts to show cost in percentage
- Customization, you can change color of each bill to fit your needs
- 3 available languages (English, Swedish and Turkish)
- 10+ currencies
- Offline first, you can use the app while offline

We would appritiate feedback. Hope you like it!

#### Contributors: 
Yigit Sereflioglu (yseref@tuta.io) - Turkish translation

<img src="https://github.com/AntonJacobsson/monthly-bill-planner/blob/master/resources/image1.jpeg" width="19%" >  <img src="https://github.com/AntonJacobsson/monthly-bill-planner/blob/master/resources/image2.jpeg" width="19%" >  <img src="https://github.com/AntonJacobsson/monthly-bill-planner/blob/master/resources/image3.jpeg" width="19%" >  <img src="https://github.com/AntonJacobsson/monthly-bill-planner/blob/master/resources/image5.jpeg" width="19%" >  <img src="https://github.com/AntonJacobsson/monthly-bill-planner/blob/master/resources/image4.jpeg" width="19%" >


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
