import {Component, OnInit, Input, TemplateRef} from '@angular/core';
import {Commonservices} from "../app.commonservices";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
declare var moment;
declare var $:any;
@Component({
  selector: 'app-slots',
  templateUrl: './slots.component.html',
  styleUrls: ['./slots.component.css']
})
export class SlotsComponent implements OnInit {

  public slotdata:any;
  modalRef: BsModalRef;
  public dataForm: FormGroup;
  public kp;
  public start_time;
  public end_time;
  public mydetails;
  public slotvalue:any='';
  public timezoneshow:any='';
  public itemidval:any;
  public mymodal:any;
  public message:any;
  public timezoneval:any='';
  bsDatepicker = {
    format: 'DD/MM/YYYY',
    minDate: moment().format("DD/MM/YYYY"),
    noDefaultRangeSelected : true
  }


  @Input()
  set itemid(item: any) {
    this.itemidval = (item) || 0;
  //  console.log('this.itemidval');
  //  console.log(this.itemidval);
    //this.slotdata.slots=((item.endtime-item.starttime)/(60*30));


  }
  @Input()
  set itemdata(item: any) {
    this.slotdata = (item) || '<no name set>';
  //  console.log('slot data ...');
  //  console.log(this.slotdata);
  //  console.log('this.itemidval in itemdata');
   // console.log(this.itemidval);
    //console.log(this.slotdata);
   // console.log(this.slotdata.slotdata);



  }


  constructor(public _commonservices:Commonservices,public modal:BsModalService,kp: FormBuilder, private cookeiservice: CookieService,public _http:HttpClient) {
    this.kp = kp;

    this.timezoneval=this.cookeiservice.get('timezone');
    this.dataForm = this.kp.group({
      /*  description: ['',Validators.required],*/
      meeting_with: [''],
      participant: [this.cookeiservice.get('useremail')],
    /*  startdate: ['',Validators.required],
      starttime: ['',Validators.required],
      enddate: ['',Validators.required],
      endtime: ['',Validators.required],
      timezone: ['',Validators.required],*/
      repsmsg: [''],
    });
  }

  getslot(){

    if(this.timezoneval!='' && this.timezoneval.length>2 && this.slotdata.timezone!=this.timezoneval){
      let now = moment();
      let tz=this.slotdata.timezone.split('|');
      tz=tz[1];
      //var localOffset = now.utcOffset();
      now.tz(tz); // your time zone, not necessarily the server's
      let centralOffset = now.utcOffset();
      let tz1=this.timezoneval.split('|');
      tz1=tz1[1];
      now.tz(tz1);
      let centralOffset1 = now.utcOffset();
      let diffInMinutes = centralOffset1 - centralOffset;
     // console.log('offset'+this.timezoneval+this.slotdata.timezone);
    //  console.log(diffInMinutes);
     // console.log(tz);
    //  console.log(tz1);
      let a=moment(this.slotdata.startdate+'T'+this.slotdata.slots[this.itemidval].trim()+':00');
      let starttime= moment(a).add(diffInMinutes, 'minutes').format('hh:mm A');
      let endtime = moment(a).add(diffInMinutes, 'minutes').add(this.slotdata.timespan, 'minutes').format('hh:mm A');
      this.slotvalue= starttime +' - '+endtime;
      this.timezoneshow=this.timezoneval;

    }else {
     // console.log('no offset'+this.timezoneval+this.slotdata.timezone);

      let a = moment(this.slotdata.startdate + 'T' + this.slotdata.slots[this.itemidval].trim() + ':00');
      let starttime = a.format('hh:mm A');
      let endtime = moment(a).add(this.slotdata.timespan, 'minutes').format('hh:mm A');
      this.slotvalue = starttime + ' - ' + endtime;
      this.timezoneshow=this.slotdata.timezone;
    }
    //return this.slotvalue;
  }

  ngOnInit() {
    setTimeout(() => {
      this.getslot();
    },0);
   // console.log('refreshtoken');
   // console.log(this.cookeiservice.get('refreshtoken').length);
   // console.log(this.cookeiservice.get('refreshtoken'));
   // console.log(typeof (this.cookeiservice.get('refreshtoken')));
  /*  if(this.cookeiservice.get('refreshtoken')==null ||  this.cookeiservice.get('refreshtoken').length<12 ){
      this.getrepdetails();
    }*/
  }
/*  getrepdetails(){
    const link = this._commonservices.nodesslurl+'datalist?token='+this.cookeiservice.get('jwttoken');
    this._http.post(link,{source:'users',condition:{_id_object:this.cookeiservice.get('userid')}})
        .subscribe(res => {
          let result:any;
          result = res;
          if(result.status=='error'){
          }else{
            this.mydetails = result.res;
            console.log('this.mydetails');
            console.log(this.mydetails);
            //this.cookeiservice.set('refreshtoken', this.mydetails[0].regionalrecruiter_id);


            const link = this._commonservices.nodesslurl+'datalist?token='+this.cookeiservice.get('jwttoken');
            this._http.post(link,{source:'users',condition:{_id_object:this.mydetails[0].regionalrecruiter_id}})
                .subscribe(res => {
                  let result:any;
                  result = res;
                  if(result.status=='error'){
                  }else{
                    //this.mydetails = result.res;
                    console.log('this.regional details');
                    console.log(result.res);
                    console.log(result.res[0]);
                    console.log(result.res[0].refreshtoken);
                    this.cookeiservice.set('refreshtoken', result.res[0].refreshtoken);






                  }
                }, error => {
                  console.log('Oooops!');
                });



          }
        }, error => {
          console.log('Oooops!');
        });
  }*/
  booknowmodal(template:TemplateRef<any>,slotdata,template1:TemplateRef<any>) {
    //  this.modalRef=this.modal.show(template);
    this.mymodal = template1;
    this.modalRef = this.modal.show(template, {class: 'booknowmodal'});
  //  console.log('slotdata');
   //  console.log(slotdata);


     this.dataForm = this.kp.group({
     /*  description: [slotdata.description,Validators.required],*/
     meeting_with: [slotdata.meetingwith],
     participant: [ this.cookeiservice.get('useremail')],
    /* startdate: [slotdata.startdate,Validators.required],
     starttime: ['',Validators.required],
     enddate: [slotdata.startdate,Validators.required],
     endtime: ['',Validators.required],
     timezone: [slotdata.timezone,Validators.required],*/
     repsmsg: [''],
     });
    /* this.dataForm.controls['starttime'].patchValue(this.start_time);
     this.dataForm.controls['endtime'].patchValue(this.end_time);*/
  }
showformat(stdt){
    return moment(stdt).format('dddd MMMM DD, YYYY');
}
  dosubmit(){
    let x: any;
    for (x in this.dataForm.controls) {
      this.dataForm.controls[x].markAsTouched();
    }
    /*if (this.dataForm.valid) {*/
   // console.log('valid');
    let link = this._commonservices.nodesslurl+'addtocalendar';


    /*   {"refresh_token": "1/fkzUmqGX5zQ7Z_fn-EXa-ZM7u-DWTeiXhPJ7UiNQ3m8","start_time":"2019-05-08T10:00:00" ,"end_time":"2019-05-08T12:00:00","timezone":"America/Los_Angeles","summery":"Debasis test event !!","attendees":["debasis218@gmail.com","abc@yopmail.com"]}
     */
   // let attendeesarr=[this.cookeiservice.get('useremail')];
    let attendeesarr=[this.dataForm.controls['participant'].value];
  //  console.log('start---');
    //  console.log(slotdata.startdate);
   /* console.log($('.startdt').val());
    console.log($('.enddt').val());
    console.log($('.tm1').val());
    console.log($('.tm2').val());
    console.log('this.start_time');
    console.log(this.start_time);
    console.log(moment(this.start_time).format('HH:mm'));
    console.log(moment(this.end_time).format('HH:mm'));
    console.log(this.end_time);*/
    let tz=this.slotdata.timezone.split('|');
 /*   console.log(this.slotdata.starttime);
    console.log(this.slotdata.endtime);*/
    let ival=this.itemidval;
    let data = {
      refresh_token:this.cookeiservice.get('refreshtoken'),
     /* start_time:moment($('.startdt').val()).format('YYYY-MM-DD')+'T'+moment(this.start_time).format('HH:mm:ss'),
      end_time:moment($('.enddt').val()).format('YYYY-MM-DD')+'T'+moment(this.end_time).format('HH:mm:ss'),*/
      startdate:this.slotdata.startdate,
      start_time:moment(this.slotdata.startdate+'T'+this.slotdata.slots[this.itemidval].trim()+':00').format('YYYY-MM-DDTHH:mm:ss'),
      end_time:moment(this.slotdata.startdate+'T'+this.slotdata.slots[this.itemidval].trim()+':00').add(this.slotdata.timespan, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
      timezone:tz[1],
      summery:this.dataForm.controls['meeting_with'].value,
      attendees:attendeesarr,
      repsmsg:this.dataForm.controls['repsmsg'].value,
      id:this.slotdata.eventid,
      eid:this.slotdata._id,
      slots:this.slotdata.slots,
      //nslots:this.slotdata.slots.splice(ival,1),
      slot:this.slotdata.slots[this.itemidval],
      ival:this.itemidval,
      timespan:this.slotdata.timespan
    }
    console.log('data--------');
    console.log(data);
    this._http.post(link, data)
        .subscribe(res => {
          let result: any = {};
          result = res;
          console.log('result.... for google calendar');
          console.log(result);
          console.log(result);
          this.modalRef.hide();
          this.message="Your Booking done successfully !!";
          this.modalRef=this.modal.show(this.mymodal, {class: 'successmodal'});
          setTimeout(() => {
            window.location.reload();
          },5000);
          //this.router.navigate(['/reptrainingcenter'])
        });
  }
  // }
  showtime(item,eachslots){
    var a=moment(item.startdate+'T'+eachslots.trim()+':00');
    var starttime= a.format('hh.mm A');
    var endtime = moment(a).add(30, 'minutes').format('hh.mm A');
    return starttime +' - '+endtime;
  }
  modaloff(){
    this.modalRef.hide();
  }
}