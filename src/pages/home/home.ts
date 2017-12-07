import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { Api } from '../../providers/api/api';

interface Ad {
  title: string;
  contents: string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  pageTitle: string = 'ubiAd';

  adInfo: Ad = {
    title: '',
    contents: ''
  };

  constructor(private alertCtrl: AlertController, public api: Api) {}

  doSubmit() {
    this._confirm();
  }

  submit(adInfo) {
    console.log('submit');
    console.log('adInfo:', adInfo);
    this.api.post('ads', adInfo).toPromise()
      .then(resp => {
        console.log(resp);
        if (resp['success']) {
          this._alert('投稿完了', null, '正常に投稿されました！');
        } else {
          this._alert('エラー', '投稿に失敗しました');
        }
      })
      .catch(err => {
        console.error('ERROR', err);
        const errorMsg = err.error.Error;
        this._alert('エラー', '投稿に失敗しました', errorMsg);
      });
  }

  _confirm() {
    const amount = this.adInfo.contents.length / 100
    const alert = this.alertCtrl.create({
      title: '確認',
      message: `<p>掲載料は <b>${amount} UTC</b> です。</p><p>本当に投稿しますか？</p>`,
      buttons: [
        {
          text: 'キャンセル',
          role: 'cancel',
          handler: () => console.log('Canceled')
        },
        {
          text: '投稿する',
          handler: () => this.submit(this.adInfo)
        }
      ]
    });
    alert.present();
  }

  _alert(title: string, subTitle: string = '', message: string = '') {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      message: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
