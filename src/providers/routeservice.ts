import { Injectable } from '@angular/core'
import { Storage } from '@ionic/storage'
import { Http } from '@angular/http'
import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/map'

// Pages
import { Services } from './services';

@Injectable()
export class RouteService {
  routes;
  selBusIconUrl = 'http://nb.translink.ca/Images/highlightBus/'
  busIconUrl = 'http://nb.translink.ca/Images/bus/'
  routesURL = 'assets/data/translink/routes.json'

  constructor(
    private storage: Storage,
    private http: Http,
    private services: Services
  ) {
  }

  async all() {
    this.routes = await this.storage.get('routes')
    if (!this.routes) {
      this.routes = []
    }

    return this.routes
  }

  async save(routes) {
    await this.storage.set('routes', this.routes)
  }

  async addToFavorites(route) {
    let routes = await this.all()
    if (!this.contains(routes, 'id', route.id)) {
      routes.push(route);
      this.save(this.routes);
      this.services.notify(`Route ${route.RouteNo} added to favourites.`, 'success')
    } else {
      this.services.notify(`Route ${route.RouteNo} already in favourites.`, 'warning')
    }
  }

  contains(arr, key, val) {
    for (var ai, i = arr.length; i--;)
      if ((ai = arr[i]) && ai[key] == val)
        return true;
    return false;
  };

  remove(index) {
    this.routes.splice(index, 1);
  }

  getID() {
    var id = 0;

    if (this.routes.length > 1) {
      id = this.routes[this.routes.length - 1].id;
    }

    return id;
  }

  get(routeId) {
    this.all();
    for (var i = 0; i < this.routes.length; i++) {
      if (this.routes[i].id === parseInt(routeId)) {
        return this.routes[i];
      }
    }
    return null;
  }

  //Loops through all live bus data filtering out only buses in favorite list
  filterFavorites(allRoutesJson) {
    var favRoutes = this.all();
    var count = 0;
    var filteredList = [];
    //Loop bigger array first.
    for (var i in allRoutesJson) {
      count += 1;
      //Loop smaller array second.
      for (var j in favRoutes) {
        if (favRoutes[j].selected) {
          //Compare two json objects to see if they are they same.
          if (favRoutes[j].routeNoTrim === this.getSplitNo(allRoutesJson[i].RouteNo)) {
            filteredList.push(allRoutesJson[i]);
          }
        }
      }
    }
    console.log("count", count);
    return filteredList;
  }

  getSplitNo(routeNo) {
    routeNo = routeNo.replace(/^0+/, '');
    return routeNo;
  }

  getIconUrl(routeNo) {
    return this.busIconUrl + this.getSplitNo(routeNo) + ".png";
  }

  getSelIconUrl(routeNo) {
    return this.selBusIconUrl + this.getSplitNo(routeNo) + ".png";
  }

  departNow(time) {
    if (time < 2)
      return "NOW";
    return time;
  }

  async loadAllRoutes() {
    return await this.http.get(this.routesURL).map(res => res.json()).toPromise()
  }

}
