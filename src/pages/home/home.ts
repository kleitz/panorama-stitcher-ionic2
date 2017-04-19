import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { Transfer } from 'ionic-native';

import { Device } from '@ionic-native/device';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { ChooseWayPage } from './choose-way';
import { ViewPage } from '../view/view';

import { UploadService } from './upload-service';

import { SERVER_URL } from './config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ Device, Transfer, PhotoViewer, UploadService ]
})
export class HomePage {

  public images = [
  ];

  constructor(platform: Platform, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public loadingCtrl: LoadingController, private ngZone: NgZone, private photoViewer: PhotoViewer, public uploadService: UploadService) {
    platform.ready().then(() => {
      this.loadImgs();
    });
  }

  ionViewDidLoad() {

  }

  loadImgs() {
    this.uploadService.get(SERVER_URL + '/phoneupload').subscribe(result => {
        console.log(result);
        if (result.files) {
          for (let i = 0; i < result.files.length; i++) {
            this.images.push({thumbnailUrl: result.files[i].thumbnailUrl, deleteUrl: result.files[i].deleteUrl, url:result.files[i].url, isuploaded: true});
          }
        }
      }, err => {
        console.log(err);
        alert(err);
      });
  }

  imageUpload(image) {
    let onProgress = (progressEvent: ProgressEvent) => {
      this.ngZone.run(() => {
            if (progressEvent.lengthComputable) {
                let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                image.progress = progress      
            }
        });
    }

    this.uploadService.upload(image.imageUrl, SERVER_URL + '/phoneupload', onProgress).then(result => {
      for (let i = 0; i < this.images.length; i++) {
        if (this.images[i] == image) {
          let data = JSON.parse(result);
          console.log(data);
          this.images.splice(i, 1, {thumbnailUrl: data.files[0].thumbnailUrl, deleteUrl: data.files[0].deleteUrl, url: data.files[0].url, isuploaded: true});              
        }
      }
    });
  }

  imageDelete(image) {
    this.uploadService.delete(image.deleteUrl).subscribe(result => {
        if (result.success) {
 //         this.images.remove(image);
          for (let i = 0; i < this.images.length; i++) {
            if (this.images[i] == image) {
              this.images.splice(i, 1);              
            }
          }
        }
      }, err => {
        console.log(err);
        alert(err);
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

  imageView(url) {
    this.photoViewer.show(url);
  }

  imageCombine() {
    let loading = this.loadingCtrl.create({
      content: 'Combining...'
    });
    loading.present();
    this.uploadService.get(SERVER_URL + '/phonestitch').subscribe(result => {
        console.log(result);
        if (result.code == "no error" && result.stauts == "finish") {
          this.panoramaView(SERVER_URL + result.view_path);
        }else{
          alert(result.code);
        }
        loading.dismiss();
      }, err => {
        loading.dismiss();
        console.log(err);
        alert(err);
      });
  }

  panoramaView(viewPath) {
    this.navCtrl.push(ViewPage, {
      path: viewPath,
    });
  }

  imagesUpload() {
    for (let i = 0; i < this.images.length; i++) {
      if (!this.images[i].isuploaded) {
        this.imageUpload(this.images[i]);
      }
    }
  }

  imagesDelete() {
    for (let i = 0; i < this.images.length; i++) {
      if (this.images[i].isuploaded) {
        this.imageDelete(this.images[i]);
      }
      else {
        this.images.splice(i, 1);
      }
    }
  }
}

