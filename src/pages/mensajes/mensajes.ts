import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';


import { SmsProvider } from '../../providers/sms/sms';

/**
 * Generated class for the MensajesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mensajes',
  templateUrl: 'mensajes.html',
})
export class MensajesPage {

  @ViewChild(Content) content: Content;
  messages: any = [];
  enviados: any = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public wsSMS: SmsProvider) {

    this.buscanMensajes();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MensajesPage');
  }


  buscanMensajes() {
    setInterval(() => {
      console.log("Buscando mensajes para enviar");

      this.getMensajes();
      this.content.scrollToBottom();

    }, 5000)
  }

  getMensajes() {
    this.wsSMS.getMessages('getMessages').subscribe(data => {
      if (data.ok) {
        console.log(` Se encontraron mensajes para enviar `);

        this.sendSMS(data.messages)
      }
      else {
        console.log("Sin mensajes para enviar");

      }
    });
  }

  sendSMS(data) {

    //console.log(` Mensajes recibidos ${data} `);

    for (let sms of data) {
      console.log(` enviando ${sms.number} ${sms.text} `);
      //SMS.sendSMS(sms.number, sms.text);
      console.log(sms);
      this.enviados.push(sms);
    }
  }

}
