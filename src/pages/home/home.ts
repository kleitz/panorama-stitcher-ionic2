import { Component } from '@angular/core';

import { NavController, NavParams, ModalController } from 'ionic-angular';
import { PhotoViewer } from 'ionic-native';

import { ChooseWayPage } from './choose-way';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

public path;
  public imgs = [
  {uri: "assets/images/1.jpg"},
  {uri: "assets/images/2.jpg"}
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {}

  chooseWay() {
    let modal = this.modalCtrl.create(ChooseWayPage);
    modal.onDidDismiss(data => {
      if (data) {
        for (var i = 0; i < data.length; i++) {
          this.imgs.push({uri: data[i]});
        }
      }
    });
    modal.present();
  }

  photoView(url) {
    console.log(url);
    PhotoViewer.show(url);
  }

}

