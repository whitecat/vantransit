import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, reorderArray } from 'ionic-angular';
import { StopService } from '../../providers/stopservice';
import { NewStopPage } from '../newstop/newstop';

@IonicPage()
@Component({
  selector: 'page-stops',
  templateUrl: 'stops.html',
})
export class StopsPage {
  allStops = []
  editing = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private stopservice: StopService
  ) { }

  offlineStops: any = []
  stops: any = []

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.populateStops()
  }

  async populateStops() {
    this.stops = await this.stopservice.all();
    this.allStops = await this.stopservice.loadAllStops();
  }

  remove(i) {
    this.stopservice.remove(i);
    this.stopservice.save(this.stops);
  }

  toggleEdit() {
    this.editing = !this.editing;
  }

  reorderData(indexes: any) {
    this.stops = reorderArray(this.stops, indexes);
    this.stopservice.save(this.stops);
  }

  saveStop() {
    this.stopservice.save(this.stops);
  }

  buttonClick() {
    if (this.editing) {
      this.editing = !this.editing;
    } else {
      this.addStop();
    }
  }

  removeZeros(routes) {
    return this.stopservice.removeZeros(routes)
  }

  addStop() {
    this.navCtrl.push(NewStopPage, { stops: this.allStops });
  }

  toggle() {
    this.stopservice.save(this.stops);
  }
}

