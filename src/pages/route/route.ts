import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RoutesService } from '../../providers/routesservice';
import { Services } from '../../providers/services';

@Component({
  selector: 'page-route',
  templateUrl: 'route.html',
})
export class RoutePage {
  routes = []
  routeFilter = []

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private routeservice: RoutesService,
    private services: Services
  ) {
    this.routes = navParams.data.routes
    this.routeFilter = this.routes
  }

  add(route: any) {
    route.id = route.RouteNo
    route.selected = true
    route.routeName = route.Destination
    route.routeNoTrim = this.routeservice.getSplitNo(route.RouteNo)

    this.routeservice.addToFavorites(route)
    this.navCtrl.pop()
  }

  filterItems(ev: any) {
    this.routeFilter = this.routes
    let val = ev.target.value

    if (val && val.trim() !== '') {
      this.routeFilter = this.routes.filter(function (route) {
        return (route.Destination + route.RouteNo).toLowerCase().includes(val.toLowerCase())
      });
    }
  }
}
