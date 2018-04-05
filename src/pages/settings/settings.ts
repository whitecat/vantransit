import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import { Storage } from '@ionic/storage'
import { TransitService } from '../../providers/transitservice'

// Pages

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  settings: any
  range = {
    autoRoutes: 15,
    autoStops: 15
  }
  relationship = 'friends'

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private transService: TransitService
  ) {
  }

  ionViewDidLoad() {
    this.settings = this.transService.defaultSettings
    // this.getSettings()
    this.loadSettings()
  }

  async loadSettings() {
    this.settings = await this.transService.getSettings()
    console.log(this.settings)
  }

  async changeAuto(type) {
    this.settings[type].disabled = this.settings[type].disabled ? false : true
    this.updateRangeTest(type)
    this.transService.setSettings(this.settings)
  }

  changeLoadScreen(toggle) {
    this.transService.setSettings(this.settings)
  }

  updateRangeTest(type) {
    if (this.settings[type].disabled) {
      this.settings[type].value = -1
    } else {
      this.settings[type].value = this.range[type]
    }
    this.transService.setSettings(this.settings)
  }

  getSettings() {
    console.log(this.settings)
    this.storage.get('settings').then(settings => {
      if (!settings) {
        settings = this.transService.defaultSettings
        this.transService.setSettings(this.transService.defaultSettings)
      }
      this.settings = settings

      console.log(this.settings)
    })
  }
}
