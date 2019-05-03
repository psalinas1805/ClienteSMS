import { Component, OnInit, ViewChild } from "@angular/core";
import { NavController, Content, PopoverController } from "ionic-angular";
import { FormGroup, FormControl } from "@angular/forms";

import { SmsProvider } from "../../providers/sms/sms";
import { Platform } from "ionic-angular";

import { PopoverComponent } from "../../components/popover/popover";

declare var SMS: any;

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  @ViewChild(Content) content: Content;

  elemento: HTMLElement;

  forma: FormGroup;
  //config: FormGroup;
  config = {"limit":"1", "sleep":"10000", "interval":"100"};
  messages: any = [];
  enviados: any = [];
  recibidos: any = [];
  maxArray = 30; // cantidad de registros maximos que mostrara en pantalla
  android = false;
  count =0;
 
  constructor(
    public navCtrl: NavController,
    public wsSMS: SmsProvider,
    platform: Platform,
    public popoverCtrl: PopoverController
  ) {
    if (platform.is("cordova")) {
      this.android = true;
      this.ReadListSMS();
      this.ExpectingSMS();
    }

    this.forma = new FormGroup({
      phone: new FormControl(""),
      message: new FormControl("")
    });
    
    this.getConfig();
    
    this.buscanMensajes();
    // this.ReadListSMS();
  }
  ngOnInit() {}

  presentPopover(myEvent) {
    let options = {
      enableBackdropDismiss: false
    };
    let popover = this.popoverCtrl.create(PopoverComponent, options);
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(msg => {
      console.log(msg);
      if (msg) {
        this.enviados.push(msg);
      }
    });
  }

  buscanMensajes() {
    setInterval(() => {
      console.log(`Buscando mensajes para enviar con limite ${this.config.limit}`);

      this.getMensajes(this.config.limit);

      this.content.scrollToBottom();
      //this.ReadListSMS();
    }, this.config.sleep);
  }

  ReadListSMS() {
    let filter = {
      box: "inbox", // 'inbox' (default), 'sent', 'draft'
      indexFrom: 0, // start from index 0
      maxCount: 20 // count of SMS to return each time
    };
    if (this.android) {
      SMS.listSMS(
        filter,
        ListSms => {
          this.messages = ListSms;
        },
        Error => {
          alert(JSON.stringify(Error));
        }
      );
    }
  }

  ExpectingSMS() {
    if (this.android) {
      if (SMS)
        SMS.startWatch(
          () => {
            console.log("Comenzo a escuchar");
          },
          Error => {
            alert(`Fallo el inicio de la espera ${Error}`);
          });

      document.addEventListener('onSMSArrive', (e: any) => {
        var sms = e.data;
        this.recibidos.push(sms);
        this.putMensajes(sms);
        
      });
    }
  }

  /*ExpectingSMS(){
  
  if (SMS) SMS.startWatch(function() {
    alert('smsreceive: watching started');
  }, function() {
    alert('smsreceive: failed to start watching');
  });


  document.addEventListener('onSMSArrive', (e:any) =>{
	console.log('onSMSArrive()');
	var IncomingSMS = e.data;
	alert('sms.address:' + IncomingSMS.address);
	alert('sms.body:' + IncomingSMS.body);
	
  alert(JSON.stringify(IncomingSMS));
  this.recibidos.push(IncomingSMS);
  this.putMensajes(IncomingSMS);
});
}
*/

  async getMensajes(limit) {
    this.wsSMS.getMessages("getMessages", limit).subscribe(data => {
      if (data.ok) {
        //alert(` Se encontraron mensajes para enviar `);
        console.log(data.method);

        this.sendSMS(data.messages);
      } else {
        console.log("Sin mensajes para enviar");
      }
    });
  }

  putMensajes(data) {
    this.wsSMS.putMessages("putMessages", data).subscribe(data => {
      if (data.ok) {
        //alert(` Se encontraron mensajes para enviar `);
        console.log(data.ok);
      } else {
        console.log("Sin mensajes para enviar");
      }
    });
  }

  updateMensajes(data) {
    this.wsSMS.updateMessages("updateMessages", data).subscribe(data => {
      if (data.ok) {
        console.log(data.ok);
      } else {
        console.log("Sin mensajes para enviar");
      }
    });
  }

  sendSMS(data) {
     let options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
        intent: "" // send SMS with the native android SMS messaging
        //intent: '' // send SMS without open any other app
        //intent: 'INTENT' // send SMS inside a default SMS app
      }
    }; 
    console.log(` Mensajes recibidos ${data} `);

    for (let sms of data) {
      console.log(` enviando ${sms} `);
      if (this.android) {
        SMS.sendSMS(
          sms.number,
          sms.text,
          options, 
          function() {
            console.log(`Enviando ${sms.timestamp} - ${sms.number} - ${sms.text}`);
            
            //alert("Mensaje enviado correctamente");
            //this.updateData(sms);
          },
          function(str) {
            //alert(str);
          }
        );
      }
      console.log(sms);
      this.updateMensajes(sms);
      if (this.enviados.length >= this.maxArray) {
        this.enviados.shift();
      }
      this.enviados.push(sms);
      this.count+= 1;
    }
  }

  sendSMSManual() {
    console.log(
      ` enviando manual ${this.forma.value.phone} ${this.forma.value.message} `
    );
    if (this.android) {
      SMS.sendSMS(this.forma.value.phone, this.forma.value.message);
    }
    let msg = {
      id: 0,
      number: this.forma.value.phone,
      text: this.forma.value.message,
      timestamp: Date.now()
    };
    console.log(msg);

    if (this.enviados.length >= this.maxArray) {
      this.enviados.shift();
    }
    this.enviados.push(msg);

    this.forma.value.phone = "";
    this.forma.value.message = "";
  }

  saveConfig(){
    console.log("Guardando configuraciones");
    localStorage.setItem("config", JSON.stringify(this.config));
    console.log(this.config.limit);
    console.log(this.config.sleep);
    console.log(this.config.interval);
    this.getConfig();
  }

  getConfig(){
    
    if (localStorage.getItem("config") === null ) { // 
      this.config.limit = "1";
      this.config.sleep = "10000";
      this.config.interval = "100";

      console.log("No existe localStorage Parametro por defecto");
      
    }else{
      const data = JSON.parse(localStorage.getItem("config"));
      this.config.limit = data.limit;
      this.config.sleep = data.sleep;
      this.config.interval = data.interval;
      console.log(`Obtiene de localStorage ${data.limit} ${data.sleep} ${data.interval}`);

    }


  }
}


