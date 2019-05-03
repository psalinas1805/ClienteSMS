import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

import { AndroidPermissions } from '@ionic-native/android-permissions';

import { BackgroundMode } from "@ionic-native/background-mode";
import { AppMinimize } from "@ionic-native/app-minimize/ngx";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public androidPermissions: AndroidPermissions,
    private backgroundMode: BackgroundMode,
    private appMinimize: AppMinimize) {


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is('cordova')) {
        statusBar.styleDefault();
        splashScreen.hide();
        this.permisoSms();
      }
     
    });
    
    platform.registerBackButtonAction(() => {
      navigator['app'].overrideBackButton();
    });

    this.backgroundMode.enable();

    platform.registerBackButtonAction(() => {
      this.appMinimize.minimize();
    });
  }

  permisoSms() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS)
      .then(success => console.log('Permiso concevido'),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
      );

    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.SEND_SMS]);
  }
}

