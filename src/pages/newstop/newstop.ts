import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StopService } from '../../providers/stopservice';

@Component({
  selector: 'page-newstop',
  templateUrl: 'newstop.html',
})
export class NewStopPage {
  stops = []
  filteredStops = []
  stopsShowing = []
  loadMore: boolean = false;
  stopPage = 10;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private stopservice: StopService
  ) {
    this.stops = navParams.data.stops
    this.filteredStops = this.stops
    this.stopsShowing = this.filteredStops.slice(0,10)
  }

  add(stop: any) {
    stop.id = stop.StopNo
    stop.selected = true
    stop.stopName = stop.Name

    this.stopservice.addToFavorites(stop)
    this.navCtrl.pop()
  }

  removeZeros(routes) {
    return this.stopservice.removeZeros(routes)
  }

  filterItems(ev: any) {
    let val = ev.target.value
    if (val && val.trim() !== '') {
      this.filteredStops = this.stops.filter((stop) =>{
        return (stop.Name + stop.StopNo).toLowerCase().includes(val.toLowerCase())
      });
    } else {
      this.filteredStops = this.stops
    }
    this.stopsShowing = this.filteredStops.slice(0,10)
    this.stopPage=10;

  }
  doInfinite(ev: any){
    if(this.stopPage > this.filteredStops.length){
      ev.complete();
      return;
    }
    this.stopPage+=10;
    Array.prototype.push.apply(this.stopsShowing, this.filteredStops.slice(this.stopPage-10,this.stopPage));
    ev.complete();
  }
}
