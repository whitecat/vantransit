import { Injectable } from '@angular/core'
import { Storage } from '@ionic/storage'
import { Headers, Http } from '@angular/http'
import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/map'

@Injectable()
export class TransitService {

  stopsURL: any = "assets/data/translink/stops.json"


  defaultSettings = {
    autoRoutes: {
      value: 'Disabled',
      disabled: true
    },
    autoStops: {
      value: 'Disabled',
      disabled: true
    },
    loadScreen: {
      value: 'map'
    }
  }

  defaultMap = {
    zoom: 11,
    lat: 49.255422,
    lng: -123.150469
  }

  translinkKey = 'Y3pJJjLVyfPetMoowJP4'
  busUpdated: any
  routesJson: any
  d = new Date()

  constructor(
    private storage: Storage,
    private http: Http
  ) {
  }

  /**
   * Sends authentication credentials to auth-user.
   * Returns true or false if the login was successfull.
   * @param authCredentials the authentication credentials
   */
  async getSettings() {
    let settings = await this.storage.get('settings')
    if (!settings) {
      settings = this.defaultSettings
      this.setSettings(this.defaultSettings)
    }

    return settings
  }

  async setSettings(settings) {
    this.storage.set('settings', settings)
  }

  async loadMapZoom() {
    let defaultMap = await this.storage.get('zoom')
    if (defaultMap) {
      this.defaultMap = defaultMap
    } else {
      defaultMap = this.defaultMap
    }

    return defaultMap
  }

  saveMapZoom(zoom) {
    this.storage.set('zoom', zoom)
  }

  // Get estimates for a selected stop
  async loadStopEstimates(stopID): Promise<any> {
    const uriBuilder = `http://api.translink.ca/RTTIAPI/V1/stops/${stopID}/estimates?apikey=${this.translinkKey}`
    const headers = new Headers()
    headers.set('Accept', 'application/JSON')

    return await this.http.get(uriBuilder, { headers }).map(res => res.json()).toPromise()

  }

  // Get all live bus routes that are running
  async loadAllRoutes() {
    // const n = this.d.getTime()
    // const diff = n - this.busUpdated
    const uriBuilder = `http://api.translink.ca/rttiapi/v1/buses?apikey=${this.translinkKey}`

    const headers = new Headers()
    headers.set('Accept', 'application/JSON')

    this.routesJson = await this.http.get(uriBuilder, { headers }).map(res => res.json()).toPromise()
    this.busUpdated = this.d.getTime()

    return this.routesJson

  }

  async loadAllStops() {
    return await this.http.get(this.stopsURL).map(res => res.json()).toPromise()
  }
}
