import { Component, OnInit,TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Commonservices} from '../app.commonservices' ;
import { HttpClient } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';
import { AccordionConfig } from 'ngx-bootstrap/accordion';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), { closeOthers: true });
}

@Component({
  selector: 'app-rep-traingcenter',
  templateUrl: './rep-traingcenter.component.html',
  styleUrls: ['./rep-traingcenter.component.css'],
  providers: [Commonservices , { provide: AccordionConfig, useFactory: getAccordionConfig }]
})
export class RepTraingcenterComponent implements OnInit {
  public datalist;
  public markasdonedatalist;
  public sorteddatalist=[];
  public traininglessonflag: boolean = false;

  constructor(public _commonservice:Commonservices,private router: Router,public _http:HttpClient,public modal:BsModalService,private cookeiservice: CookieService, public sanitizer: DomSanitizer)
  {
    this._commonservice=_commonservice;
    this.getmarkasdonelist();

    console.log(this.cookeiservice.get('userid'));
  }
  ngOnInit() {
  }
  getmarkasdonelist(){
    const link = this._commonservice.nodesslurl+'datalist?token='+this.cookeiservice.get('jwttoken');
    this._http.post(link,{source:'donetraininglesson',condition:{userid_object:this.cookeiservice.get('userid')}})
        .subscribe(res => {
          let result:any;
          result = res;
          if(result.status=='error'){
          }else{
            this.markasdonedatalist = [];
            this.markasdonedatalist = result.res;
            this.getdatalist();
          //  console.log(this.markasdonedatalist);
          }
        }, error => {
          console.log('Oooops!');
        });
  }

  getdatalist() {
    const link = this._commonservice.nodesslurl+'datalist?token='+this.cookeiservice.get('jwttoken');
    this._http.post(link,{source:'traininglesson'})
        .subscribe(res => {
          let result:any;
          result = res;
          if(result.status=='error'){
          }else{
            this.datalist = [];
            this.sorteddatalist = [];
            this.traininglessonflag=false;
            this.datalist = result.res;
            for(let i in this.datalist){
              //1st time
              if(this.datalist[i].prerequisite_lesson==null && this.traininglessonflag==false){
                this.sorteddatalist.push(this.datalist[i]);
                this.traininglessonflag=true;
              }
              //2nd time
              if(this.datalist[i].prerequisite_lesson!=null && this.traininglessonflag==true){
                for(let k in this.datalist){
                  if(this.sorteddatalist[this.sorteddatalist.length-1]._id==this.datalist[k].prerequisite_lesson){
                    this.sorteddatalist.push(this.datalist[k]);
                  }
                }
              }
            }
           // console.log('this.sorteddatalist');
           // console.log(this.sorteddatalist);
          }
        }, error => {
          console.log('Oooops!');
        });
  }
  markasdonetraninglesson(item,i){
    let link = this._commonservice.nodesslurl + 'addorupdatedata?token='+this.cookeiservice.get('jwttoken');
    let objarr=['trainingcategory','traininglesson','userid'];
    let data={
      userid: this.cookeiservice.get('userid'),
      traininglesson: item._id,
      trainingcategory: item.trainingcategory
    }
    this._http.post(link, {source:'donetraininglesson',data:data,sourceobj:objarr})
        .subscribe(res => {
          let result:any ={};
          result = res;
         // console.log('result....');
         // console.log(result);
          if(result.status=='error'){
          //  console.log(result.msg);
          }
          else {
            this.getmarkasdonelist();
            //this.getdatalist();
            // last lesson coompleted
            if(item._id == this.sorteddatalist[this.sorteddatalist.length-1]._id){
              let link = this._commonservices.nodesslurl + 'leadsignupquestionnaireupdate?token='+this.cookeiservice.get('jwttoken');
              let data = {
                id: this.cookeiservice.get('userid'),
                reptraininglessonstep: 1
              }
              this._http.post(link, {data:data})
                  .subscribe(res => {
                    let result: any = {};
                    result = res;
                  //  console.log('result....');
                   // console.log(result);
                    this.router.navigate(['/dashboard'])
                  });
            }
          }
        }, error => {
          console.log('Oooops!');
        });
  }

  getdoneclass(id){
    //return 'show';
    for(let i in this.markasdonedatalist){
      if(this.markasdonedatalist[i].traininglesson==id){
        console.log('??');
        return true;
      }
    }
    return false;
  }
  disableaccor(item,i1){
    console.log('this.sorteddatalist');
    console.log(this.sorteddatalist);

    if(i1==0) {
      this.sorteddatalist[i1+1].openaccordian=true;
      return false;
    }
    else{
      for(let i in this.markasdonedatalist){
        if(this.markasdonedatalist[i].traininglesson==item._id){
          console.log('--===--');
          this.sorteddatalist[i1+1].openaccordian=true;
          this.sorteddatalist[i1].markasdone=true;
          console.log('this.sorteddatalist');
          console.log(this.sorteddatalist);
          return false;
        }
        if(this.markasdonedatalist[i].traininglesson!=item._id && item.openaccordian!=null && item.openaccordian==true){
          //this.sorteddatalist[i+1].openaccordian=false;
          console.log('-----');
          return false;
        }
      }
    }
    return true;
  }
}
