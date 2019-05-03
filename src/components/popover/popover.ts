import { Component ,ViewChild, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Platform, ViewController } from 'ionic-angular';


declare var SMS: any;

/**
 * Generated class for the PopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent implements OnInit{
  @ViewChild('input') myInput ;
  forma: FormGroup;
  text: string;
  android = false;
  valid = false;
  msg = { id: 0, number: 0, text: "", timestamp : Date.now()};
  constructor(platform: Platform, public viewCtrl: ViewController) {
    if (platform.is('cordova')) {
      this.android = true;

    }
    this.forma = new FormGroup({
      phone: new FormControl("", [Validators.required,Validators.minLength(9),Validators.maxLength(13)]),
      message: new FormControl("", [Validators.required,Validators.maxLength(160)])
    });
    console.log('Hello PopoverComponent Component');
    this.text = 'Hello World';
  }


  ngOnInit() {

    setTimeout(() => {
      this.myInput.setFocus();
    },400);

 }

  sendSMSManual() {

    console.log(` enviando manual ${this.forma.value.phone} ${this.forma.value.message} `);
    if (this.android) {
      SMS.sendSMS(this.forma.value.phone, this.forma.value.message);
    }
    this.msg = { id: 0, number: this.forma.value.phone, text: this.forma.value.message, timestamp: Date.now() };
    console.log(this.msg);

    this.forma.value.phone = "";
    this.forma.value.message = "";

    this.viewCtrl.dismiss(this.msg);
  }

}
