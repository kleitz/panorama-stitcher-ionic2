import { Component } from '@angular/core';

import { NavController, ViewController } from 'ionic-angular';
import { ImagePicker } from 'ionic-native';

@Component({
  template: `
    <ion-footer>
      <ion-list>
        <button ion-item >Camera</button>
        <button ion-item (click)="openAlbum()">Album</button>
      </ion-list>
        <button ion-item (click)="goBack()">Cancel</button>
    </ion-footer>
  `
})
export class ChooseWayPage {
  constructor(public navCtrl: NavController, public viewCtrl: ViewController) {

  }
  openAlbum() {
    var options = {
      maximumImagesCount: 15,
      quality: 50,
      width:100,
      height:100,
      outputType: 0
    }
    if (!ImagePicker.hasReadPermission()) {
        ImagePicker.requestReadPermission();
    }
    ImagePicker.getPictures(options).then((results) => {
      this.viewCtrl.dismiss(results);
    }, (err) => { });
  }
  goBack() {
    this.navCtrl.pop();
  }
}
