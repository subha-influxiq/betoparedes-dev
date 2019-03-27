import { Component, OnInit } from '@angular/core';
import {Commonservices} from "../app.commonservices";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
declare var moment: any;
@Component({
  selector: 'app-appointmentlist',
  templateUrl: './appointmentlist.component.html',
  styleUrls: ['./appointmentlist.component.css'],
  providers: [Commonservices]
})
export class AppointmentlistComponent implements OnInit {
  public googleevents:any;
  public last: string;
  public filterval;
  public filterval1;
  public filterval2;

  constructor(public _commonservice:Commonservices,public _http:HttpClient,public cookeiservice:CookieService)
  {

  }
  ngOnInit() {
    this.getgoogleevents();
  }
  getgoogleevents(){
    const link = this._commonservice.nodesslurl+'datalist?token='+this.cookeiservice.get('jwttoken');
    this._http.post(link,{source:'googleevents_view',condition:{
      startdate:{$gt: moment().subtract(1, 'days').format('YYYY-MM-DD')},
      eventuser_object:this.cookeiservice.get('userid')
    }
    })
        .subscribe(res => {
          let result:any;
          result = res;
          if(result.status=='error'){
          }else{
            this.googleevents = result.res;
            console.log(this.googleevents);
          }
        }, error => {
          console.log('Oooops!');
        });
  }
  searchbyval() {
    this.filterval = '';
    if (this.filterval1 != '' && this.filterval1 != null) {
      this.filterval = this.filterval1 + '|';
    }
    if (this.filterval2 != '' && this.filterval2 != null) {
      this.filterval = this.filterval2 + '|';
    }
    console.log(this.filterval);
  }
}