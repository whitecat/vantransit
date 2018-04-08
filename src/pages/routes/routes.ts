import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, reorderArray } from 'ionic-angular';
import { RoutesService } from '../../providers/routesservice';
import { RoutePage } from '../route/route';
import { Services } from '../../providers/services';

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
    private routesservice: RoutesService
  ) { }

  route: any = {
    selectedRoute: {}
  }
  offlineRoutes: any = []
  routes: any = []

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.populateRoutes()
  }

  async populateRoutes() {
    this.routes = await this.routesservice.all();
    console.log(this.routes);
    this.allRoutes = await this.routesservice.loadAllRoutes();
  }

  remove(i) {
    this.routesservice.remove(i);
    this.routesservice.save(this.routes);
  }

  toggleEdit() {
    this.editing = !this.editing;
  }

  reorderData(indexes: any) {
    this.routes = reorderArray(this.routes, indexes);
    this.routesservice.save(this.routes);
  }

  saveRoutes() {
    this.routesservice.save(this.routes);
  }

  buttonClick() {
    if (this.editing) {
      this.editing = !this.editing;
    } else {
      this.addRoute();
    }
  }

  addRoute() {
    this.navCtrl.push(RoutePage, { routes: this.allRoutes });
  }

  toggle() {
    this.routesservice.save(this.routes);
  }
}

