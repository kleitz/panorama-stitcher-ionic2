import { Component } from '@angular/core';

import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { PhotoViewer } from 'ionic-native';

import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { HTTP } from '@ionic-native/http';
import { Device } from '@ionic-native/device';

import { ChooseWayPage } from './choose-way';
import { ViewPage } from '../view/view';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Transfer, File, HTTP, Device]
})
export class HomePage {

  public imgs = [
  ];
  public path;
  public serverHost = 'http://192.168.0.4:3000';
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public loadingCtrl: LoadingController, private transfer: Transfer, private file: File, private http: HTTP, private device: Device) {}

  chooseWay() {
    let modal = this.modalCtrl.create(ChooseWayPage);
    modal.onDidDismiss(data => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          this.imgs.push({uri: data[i]});
        }
      }
    });
    modal.present();
  }

  photoView(url) {
//    alert(url);
//    PhotoViewer.show(url);
  }

  photoUpload() {
    const fileTransfer: TransferObject = this.transfer.create();
    for (let i = 0; i < this.imgs.length; i++) {
      let url = this.imgs[i].uri;
      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: url.substr(url.lastIndexOf('/')+1),
        mimeType: 'image/jpeg',
        headers: {'deviceuuid': this.device.uuid}
      }
      fileTransfer.upload(url, encodeURI(this.serverHost + '/phoneupload'), options)
      .then((data) => {
         // success
      }, (err) => {
        // error
        alert("An error has occurred: Code = " + err.code);
      })
    }
  }
  photoCombine() {
    let loading = this.loadingCtrl.create({
//      spinner: 'hide',
      content: 'Combining...'
    });
    loading.present();
    this.http.setHeader('deviceuuid', this.device.uuid);
    console.log(this.serverHost + '/phonestitch');
    this.http.get(this.serverHost + '/phonestitch', {}, {})
      .then(data => {
        let result = JSON.parse(data.data);
        if (result.code == "no error" && result.stauts == "finish") {
//          this.path = this.serverHost + result.view_path;
          this.panoramaView(this.serverHost + result.view_path);
        }else{
          alert(result.code);
        }
          loading.dismiss();
//        console.log(data.status);
//        console.log(data.data); // data received by server
//        console.log(data.headers);

      })
      .catch(error => {
        loading.dismiss();
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
      });
  }
  panoramaView(viewPath) {
    this.navCtrl.push(ViewPage, {
      path: viewPath,
    });
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Please wait...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 5000);
  }
}

