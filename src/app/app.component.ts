import { Component, ViewChild } from '@angular/core'
import { Nav, Platform } from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav

  rootPage: any = 'RoutesPage'

  pages: Array<{ title: string, component: any }>

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp()

    this.pages = [
      { title: 'Map', component: 'MapPage' },
      { title: 'Bus Routes', component: 'RoutesPage' },
      { title: 'Bus Stops', component: 'StopsPage' },
      { title: 'Settings', component: 'SettingsPage' },
      { title: 'About', component: 'AboutPage' }
    ]

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault()
      this.splashScreen.hide()
    })
  }

  openPage(page) {
    this.nav.setRoot(page.component)
  }
}
