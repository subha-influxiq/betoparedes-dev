import { Component, OnInit,TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Commonservices} from '../app.commonservices' ;
import { HttpClient } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-rep-dashboard',
  templateUrl: './rep-dashboard.component.html',
  styleUrls: ['./rep-dashboard.component.css'],
  providers: [Commonservices]
})
export class RepDashboardComponent implements OnInit {
  public repdetails;
  public reptraininglessondetails;

  constructor(public _commonservice:Commonservices,private router: Router,public _http:HttpClient,public modal:BsModalService,private cookeiservice: CookieService)
  {
    this._commonservice=_commonservice;
    // console.log(this.cookeiservice.get('userid'));
    if(this.cookeiservice.get('userid')!=null){
    this.getrepdetails();
    }
  }

  ngOnInit() {
  }

  getrepdetails(){
    const link = this._commonservice.nodesslurl+'getrecvalues?token='+this.cookeiservice.get('jwttoken');
   // this._http.post(link,{source:'rep_recruiter_view',condition:{_id_object:this.cookeiservice.get('userid')}})
      var data={_id:this.cookeiservice.get('userid')}
    this._http.post(link,data)
        .subscribe(res => {
          let result:any;
          result = res;
          if(result.status=='error'){
          }else{
            this.repdetails = result.res;
            this.reptraininglessondetails = result.res2;
            console.log(this.repdetails);
            console.log(this.reptraininglessondetails);
            }
        }, error => {
          console.log('Oooops!');
        });
  }
    gototrainingsectionwithcat(){
      var link = 'reptrainingcenter/'+this.reptraininglessondetails.trainingcategory;
      this.router.navigate([link]);
    }
}
