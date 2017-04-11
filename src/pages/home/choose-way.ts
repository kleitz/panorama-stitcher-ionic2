import { Component } from '@angular/core';

import { NavController, ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from 'ionic-native';

@Component({
  template: `
    <ion-footer>
      <ion-list>
        <button ion-item (click)="openCamera()">Camera</button>
        <button ion-item (click)="openAlbum()">Album</button>
      </ion-list>
        <button ion-item (click)="goBack()">Cancel</button>
    </ion-footer>
  `,
  providers: [ Camera ]
})
export class ChooseWayPage {
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private camera: Camera) {

  }

  openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.NATIVE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((result) => {
      let data = [result];
      this.viewCtrl.dismiss(data);
    }, (err) => {
    // Handle error
    });
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
    }, (err) => {
    // Handle error
    });
  }

  goBack() {
    this.navCtrl.pop();
  }
}
