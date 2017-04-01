import { Component, NgZone } from '@angular/core';

import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import {Transfer} from 'ionic-native';

import { Device } from '@ionic-native/device';

import { PhotoViewer } from 'ionic-native';

import { ChooseWayPage } from './choose-way';
import { ViewPage } from '../view/view';

import { UploadService } from './upload-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ Device, Transfer, UploadService ]
})
export class HomePage {

  public images = [
  ];
  public serverHost = 'http://192.168.0.8:3000';
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public loadingCtrl: LoadingController, private ngZone: NgZone, public uploadService: UploadService) {
    this.loadImgs();
  }

  ionViewDidLoad() {

  }

  loadImgs() {
    this.uploadService.get(this.serverHost + '/phoneupload').subscribe(result => {
        console.log(result);
        if (result.files) {
          for (let i = 0; i < result.files.length; i++) {
            this.images.push({thumbnailUrl: result.files[i].thumbnailUrl, deleteUrl: result.files[i].deleteUrl, isuploaded: true});
          }
        }
      });
  }

  imageUpload(image) {
    let onProgress = (progressEvent: ProgressEvent) => {
      this.ngZone.run(() => {
            if (progressEvent.lengthComputable) {
                let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                console.log(progress);
                image.progress = progress      
            }
        });
    }

    this.uploadService.upload(image.imageUrl, this.serverHost + '/phoneupload', onProgress).then(result => {
      for (let i = 0; i < this.images.length; i++) {
        if (this.images[i] == image) {
          let data = JSON.parse(result);
          console.log(data);
          this.images.splice(i, 1, {thumbnailUrl: data.files[0].thumbnailUrl, deleteUrl: data.files[0].deleteUrl, isuploaded: true});              
        }
      }
    });
  }

  imageDelete(image) {
    this.uploadService.delete(image.deleteUrl).subscribe(result => {
        console.log(result);
        if (result.success) {
 //         this.images.remove(image);
          for (let i = 0; i < this.images.length; i++) {
            if (this.images[i] == image) {
              this.images.splice(i, 1);              
            }
          }
        }
      });
  }
  chooseWay() {
    let modal = this.modalCtrl.create(ChooseWayPage);
    modal.onDidDismiss(data => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          this.images.push({imageUrl: data[i], isuploaded: false, progress: 0});
        }
      }
    });
    modal.present();
  }

  photoView(url) {
//    alert(url);
//    PhotoViewer.show(url);
  }

  photoCombine() {
    let loading = this.loadingCtrl.create({
      content: 'Combining...'
    });
    loading.present();
    this.uploadService.get(this.serverHost + '/phonestitch').subscribe(result => {
        if (result.code == "no error" && result.stauts == "finish") {
          this.panoramaView(this.serverHost + result.view_path);
        }else{
          alert(result.code);
        }
        loading.dismiss();
      });
  }

  panoramaView(viewPath) {
    this.navCtrl.push(ViewPage, {
      path: viewPath,
    });
  }
}

