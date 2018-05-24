import { Injectable } from '@angular/core'
import { Storage } from '@ionic/storage'
import { Http } from '@angular/http'
import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/map'

// Pages
import { Services } from './services';
import { RouteService } from './routeservice';

@Injectable()
export class StopService {
  stops;
  busIconUrl = 'http://nb.translink.ca/Images/bus/'
  stopsURL = 'assets/data/translink/stops.json'

  constructor(
    private storage: Storage,
    private http: Http,
    private services: Services,
    private routeservice: RouteService
  ) {
  }

  async all() {
    this.stops = await this.storage.get('stops')
    if (!this.stops) {
      this.stops = []
     }

    return this.stops
  }

  async save(stops) {
    await this.storage.set('stops', this.stops)
  }

  async addToFavorites(stop) {
    let stops = await this.all()
    if (!this.contains(stops, 'id', stop.id)) {
      stops.push(stop);
      this.save(this.stops);
      this.services.notify(`Stop ${stop.id} added to favourites.`, 'success')
    } else {
      this.services.notify(`Stop ${stop.id} already in favourites.`, 'warning')
    }
  }

  contains(arr, key, val) {
    for (var ai, i = arr.length; i--;)
      if ((ai = arr[i]) && ai[key] == val)
        return true;
    return false;
  };

  remove(index) {
    this.stops.splice(index, 1);
  }

  getID() {
    var id = 0;
    if (this.stops.length > 1) {
      id = this.stops[this.stops.length - 1].id;
    }
    return id;
  }

  get(stopId) {
    this.all();
    for (var i = 0; i < this.stops.length; i++) {
      if (this.stops[i].id === parseInt(stopId)) {
        return this.stops[i];
      }
    }
    return null;
  }

  removeZeros(routes) {
    if (!routes) {
      return 'None';
    }
    else {
      var splitRoutes = routes.split(',');
      for (var i=0; i<splitRoutes.length; i++) {
        splitRoutes[i] = this.routeservice.getSplitNo(splitRoutes[i]);
      }
      return splitRoutes.join(', ');
    }
  };

  async loadAllStops() {
    return await this.http.get(this.stopsURL).map(res => res.json()).toPromise()
  }
}
