import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

let apiUrl = "http://smsbot.maps.mobid.cl/AuthServices/api/index2.php/"
//let apiUrl = "http://172.20.10.3:3000/"
//let apiUrl = "http://localhost:3000/"
let headers = new Headers({ 'Content-Type': 'application/json' });
//let headers = new Headers();
/*
  Generated class for the SmsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SmsProvider {

  constructor(public http: Http) {
    console.log('Hello SmsProvider Provider');
  }

  getMessages(method,limit) {
    let methodLimit = method + "?limit=" + limit
    console.log(apiUrl + methodLimit);
    console.log("");
    let headers = new Headers();
    return this.http.get(apiUrl + methodLimit, { headers })
      .map(res => {     
        return res.json();

      });
  }
  putMessages(method, data) {
    return this.http.post(apiUrl + method, JSON.stringify(data), { headers })
      .map(res => {   
        console.log("respuesta", res.json());
          
        return res.json();
      

      });
  }

  updateMessages(method, data) {
    //console.log(`Enviara ${data} a ${apiUrl}${method}` );
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(apiUrl + method, JSON.stringify(data), { headers })
      .map(res => {   
        console.log("respuesta", res.json());          
        return res.json();    

      });
  }

}
  

