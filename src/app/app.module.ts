import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage'
import { HttpModule } from '@angular/http'

// Pages
import { MyApp } from './app.component';
import { RoutePage } from '../pages/route/route';

// Services
import { TransitService } from './../providers/transitservice'
import { RoutesService } from '../providers/routesservice';
import { Services } from '../providers/services';


@NgModule({
  declarations: [
    MyApp,
    RoutePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RoutePage
  ],
  providers: [
    Services,
    StatusBar,
    SplashScreen,
    TransitService,
    RoutesService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
