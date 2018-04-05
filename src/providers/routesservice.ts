import { Injectable } from '@angular/core'
import { Storage } from '@ionic/storage'
import 'rxjs/add/operator/toPromise'

@Injectable()
export class RoutesService {
  loaded = false;
  routes;
  selBusIconUrl = 'http://nb.translink.ca/Images/highlightBus/'
  busIconUrl = 'http://nb.translink.ca/Images/bus/'

  constructor(
    private storage: Storage
  ) {
  }

  async all() {
    this.routes = await this.storage.get('routes')
    if (!this.routes) {
      this.routes = []
      this.loaded = true
    }
    
    return this.routes
  }

  async save(routes) {
    await this.storage.set('routes', this.routes)
  }


  contains(arr, key, val) { // Find array element which has a key value of val 
    for (var ai, i = arr.length; i--;)
      if ((ai = arr[i]) && ai[key] == val)
        return true;
    return false;
  };

  newRoute(routeNo, routeName) {
    // Add a new project

    var routeNoTrim = this.getSplitNo(routeNo);

    if (this.contains(this.routes, 'id', routeNo)) {
      return null;
    }

    return {
      id: routeNo,
      routeNoTrim: routeNoTrim,
      routeName: routeName,
      selected: true
    };
  }

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


}
