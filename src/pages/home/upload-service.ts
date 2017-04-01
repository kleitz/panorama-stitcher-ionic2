import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map'
import {Transfer} from 'ionic-native';
import {Component, Injectable} from '@angular/core';

import { Device } from '@ionic-native/device';

@Injectable()
export class UploadService {
    public serverHost = 'http://192.168.0.8:3000';

    constructor(private device: Device, private http: Http) {}

    success = (result: any) : void => { 
        console.log(result);
    }
            
    failed = (err: any) : void => {
        let code = err.code;
        alert("Failed to upload image. Code: " + code);
    }
    
    upload = (url: string, serverUrl: string, progress: any) => { 
        let ft = new Transfer();
        let options = {
            fileKey: 'file',
            fileName: url.substr(url.lastIndexOf('/')+1),
            mimeType: 'image/jpeg',
            chunkedMode: false,
            headers: {'deviceuuid': this.device.uuid},
        }; 
        ft.onProgress(progress);
        return ft.upload(url, encodeURI(serverUrl), options, false)
          .then((result: any) => result.response);
/*        .then((result: any) => {
            result.response;
        }).catch((error: any) => {
            this.failed(error);
        }); */
    }
    get = (url: string) => { 
      let headers = new Headers({ 'deviceuuid': this.device.uuid });
      let options = new RequestOptions({ headers: headers });
      return this.http.get(url, options)
        .map(res => res.json());
    }

    delete = (url: string) => { 
      let headers = new Headers({ 'deviceuuid': this.device.uuid });
      let options = new RequestOptions({ headers: headers });
      return this.http.delete(url, options)
        .map(res => res.json());
    }
}
