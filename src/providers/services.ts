import { Injectable } from '@angular/core'
import { ToastController } from 'ionic-angular';

@Injectable()
export class Services {

  toastr: any

  constructor(
    public toast: ToastController
  ) {

  }

  notify(text, status?) {
    let toastr = this.toast.create({
      message: text,
      cssClass: status,
      position: 'top',
      duration: 2000
    })
    toastr.present();
  }

}
