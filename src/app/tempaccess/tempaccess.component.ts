import { Component, OnInit } from '@angular/core';
import { Commonservices } from "../app.commonservices";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-tempaccess',
  templateUrl: './tempaccess.component.html',
  styleUrls: ['./tempaccess.component.css'],
  providers: [Commonservices]
})
export class TempaccessComponent implements OnInit {
  public eventlist: any;
  public dateallarr: any=[];
  public slotarr: any=[];
  public startarr: any=[];
  public flag: any=30;
  public dayarr: any=[];
  public dayarrtemp: any=[];
  public timearr: any=[];
  public timezone: any=[];
  public recid: any;
  //public flag: any=60;
  public mydetails;
  public rec;
  public recemail;
  public msgBlock: any;

  constructor(public _commonservices:Commonservices,public  _http:HttpClient,public cookeiservice:CookieService,public  route: ActivatedRoute) {
    this.getrepdetails();
    console.log(this.route.snapshot.url[0].path);
    console.log(this.route.snapshot.url[1].path);
  }

  ngOnInit() {
    switch(this.route.snapshot.url[0].path) {
      case 'on-boarding-call-booked':
        this.msgBlock = 'onBoardingCall';
        break;
      case 'is_discovery':
        this.msgBlock = 'isDiscovery';
        break;
      default:
        break;
    }
  }

  getrepdetails() {
    const link = this._commonservices.nodesslurl+'datalist?token='+this.cookeiservice.get('jwttoken');
    this._http.post(link,{source:'users',condition:{_id_object:this.cookeiservice.get('userid')}})
        .subscribe(res => {
          let result:any = res;
          if(result.status == 'error') {
          } else {
            this.mydetails = result.res;
            console.log('====== this.mydetails =========');
            console.log(this.mydetails);
            //this.cookeiservice.set('refreshtoken', this.mydetails[0].regionalrecruiter_id);


            const link = this._commonservices.nodesslurl+'datalist?token='+this.cookeiservice.get('jwttoken');
            let data: any = { source: 'users', condition: { _id_object: this.mydetails[0].regionalrecruiter_id } };
            this._http.post(link, data).subscribe(res => {
                  let result:any;
                  result = res;
                  if(result.status=='error'){
                  }else{
                    //this.mydetails = result.res;
                    console.log('this.regional details');
                //    console.log(result.res);
                    console.log(result.res[0]);
                    console.log(result.res[0].firstname);
                    this.rec=result.res[0].firstname+" "+result.res[0].lastname;
                    console.log(this.rec);
                    this.recemail=result.res[0].email;
                    //this.cookeiservice.set('refreshtoken', result.res[0].refreshtoken);
                  }
                }, error => {
                  console.log('Oooops!');
                });
          }
        }, error => {
          console.log('Oooops!');
        });
  }
}
