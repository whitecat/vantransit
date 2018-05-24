import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage'
import { HttpModule } from '@angular/http'

// Pages
import { MyApp } from './app.component';
import { NewRoutePage } from '../pages/newroute/newroute';
import { NewStopPage } from '../pages/newstop/newstop';

// Services
import { TransitService } from './../providers/transitservice'
import { RouteService } from '../providers/routeservice';
import { Services } from '../providers/services';
import { StopService } from '../providers/stopservice';


@NgModule({
  declarations: [
    MyApp,
    NewRoutePage,
    NewStopPage
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
    NewRoutePage,
    NewStopPage
  ],
  providers: [
    Services,
    StatusBar,
    SplashScreen,
    TransitService,
    RouteService,
    StopService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
