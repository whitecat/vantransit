import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-route',
  templateUrl: 'route.html',
})
export class RoutesPage {

  map: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  ionViewDidLoad() {

  }

}
