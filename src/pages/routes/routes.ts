import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, reorderArray } from 'ionic-angular';
import { RouteService } from '../../providers/routeservice';
import { NewRoutePage } from '../newroute/newroute';

@IonicPage()
@Component({
  selector: 'page-routes',
  templateUrl: 'routes.html',
})
export class RoutesPage {
  allRoutes = []
  editing = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private routeservice: RouteService
  ) { }

  offlineRoutes: any = []
  routes: any = []

  ionViewDidEnter() {
    this.populateRoutes()
  }

  async populateRoutes() {
    this.routes = await this.routeservice.all();
    this.allRoutes = await this.routeservice.loadAllRoutes();
  }

  remove(i) {
    this.routeservice.remove(i);
    this.routeservice.save(this.routes);
  }

  toggleEdit() {
    this.editing = !this.editing;
  }

  reorderData(indexes: any) {
    this.routes = reorderArray(this.routes, indexes);
    this.routeservice.save(this.routes);
  }

  saveRoutes() {
    this.routeservice.save(this.routes);
  }

  buttonClick() {
    if (this.editing) {
      this.editing = !this.editing;
    } else {
      this.addRoute();
    }
  }

  addRoute() {
    this.navCtrl.push(NewRoutePage, { routes: this.allRoutes });
  }

  toggle() {
    this.routeservice.save(this.routes);
  }
}

