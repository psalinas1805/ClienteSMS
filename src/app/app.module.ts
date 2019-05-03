import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { FormsModule } from "@angular/forms";

import { HttpModule} from '@angular/http';

import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SmsProvider } from '../providers/sms/sms';

import { BackgroundMode } from "@ionic-native/background-mode";
import { AppMinimize } from "@ionic-native/app-minimize/ngx";

import { PopoverComponent } from "../components/popover/popover";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PopoverComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PopoverComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AndroidPermissions,
    SmsProvider,
    BackgroundMode,
    AppMinimize
  ]
})
export class AppModule {}
