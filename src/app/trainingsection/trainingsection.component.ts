import { Component, OnInit,ViewChild,EventEmitter,ElementRef } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl,FormControl} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Commonservices} from '../app.commonservices' ;
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';

@Component({
  selector: 'app-trainingsection',
  templateUrl: './trainingsection.component.html',
  styleUrls: ['./trainingsection.component.css'],
  providers: [Commonservices]
})
export class TrainingsectionComponent implements OnInit {
  public dataForm: FormGroup;
  public es;
  public serverurl;
  public sliderresult;
  public editid;
  public last;
  public percentageis;
  public nameis;
  public servernameis=null;
  public lengthis=0;
  public divforhtml=false;
  public divforfile=false;
  public divforaudio=false;
  public divforvideo=false;
  public divforimage=false;
  public sourceconditionval:any;
  public datalist;
  public datalist1;
  public htmleditorvalue;
  public id;
  public errormg='';
  public sourceval='tranningcategory';
  public editorconfig:any={};
  files:UploadFile[];
  uploadInput:EventEmitter<UploadInput>;
  humanizeBytes:Function;
  dragOver:boolean;
  options: UploaderOptions;
  @ViewChild('fileInput1') uploaderInput: ElementRef;
  public issubmit=0;

  constructor(es: FormBuilder,public _commonservices: Commonservices,public _cookieservice:CookieService,public _http:HttpClient,public router:Router,public _router:ActivatedRoute)
  {
    this.es=es;
    this.serverurl= _commonservices.nodesslurl;
    this.dataForm=this.es.group({
      //  id:[''],
      title:['',Validators.required],
      description:['',Validators.required],
      filetype:['',Validators.required],
      // location:['',Validators.required],
      yesorno:['',Validators.required],
      status:[''],
      trainingcategory:['',Validators.required],
      htmleditorvalue:[''],
      fileservername:[''],
      filelocalname:[''],
      audioservername:[''],
      audiolocalname:[''],
      videoservername:[''],
      videolocalname:[''],
      imageservername:[''],
      imagelocalname:[''],
      prerequisite_lesson:[''],
    });
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
    this.editorconfig.extraAllowedContent = '*[class](*),span;ul;li;table;td;style;*[id];*(*);*{*}';
  }

  ngOnInit()
  {
    this.sourceconditionval ={};
    this._router.params.subscribe(params=>{
      this.id=params['id'];
      console.log(this.id);
    });
    if(this.id!=null)
    {
     this.getedittrainingsection();
    }
    this.gettrainingcategory();
  }
  typefile(){
    this.divforhtml=false;
    this.divforfile=false;
    this.divforaudio=false;
    this.divforvideo=false;
    this.divforimage=false;

    if(this.dataForm.value['filetype']=='html'){
      this.divforhtml=true;
    }

    if(this.dataForm.value['filetype']=='file'){
      this.divforfile=true;
    }
    if(this.dataForm.value['filetype']=='audio'){
      this.divforaudio=true;
    }
    if(this.dataForm.value['filetype']=='video'){
      this.divforvideo=true;
    }
    if(this.dataForm.value['filetype']=='image'){
      this.divforimage=true;
    }


    this.servernameis = null;
    this.files = [];
    this.lengthis=null;
    this.percentageis=null;



  }
  gettrainingcategory()
  {
    const link = this._commonservices.nodesslurl+'datalist?token='+this._cookieservice.get('jwttoken');
    this.sourceconditionval={status:true};
    this._http.post(link,{source:this.sourceval,condition:this.sourceconditionval})
        .subscribe(res=>{
          let result;
          result=res;
          this.datalist=[];
          this.datalist=result.res;
          console.log('datalist');
          console.log(this.datalist);
        })
  }
  getedittrainingsection()
  {

    console.log('called check');
    const link = this._commonservices.nodesslurl+'datalist?token='+this._cookieservice.get('jwttoken');
    this._http.post(link,{source:'traininglesson',condition:{'_id_object':this.id}})
        .subscribe(res=>{
          let result:any={};
          result=res;
          let datalist2=[];
          datalist2=result.res;
          // this.dataForm.controls['id'].patchValue(datalist2[0]._id);
          this.dataForm.controls['title'].patchValue(datalist2[0].title);
          this.dataForm.controls['description'].patchValue(datalist2[0].description);
          this.dataForm.controls['filetype'].patchValue(datalist2[0].filetype);
          this.dataForm.controls['yesorno'].patchValue(datalist2[0].yesorno);
          this.dataForm.controls['status'].patchValue(datalist2[0].status);
          this.dataForm.controls['trainingcategory'].patchValue(datalist2[0].trainingcategory);
          this.dataForm.controls['prerequisite_lesson'].patchValue(datalist2[0].prerequisite_lesson);
          this.dataForm.controls['htmleditorvalue'].patchValue(datalist2[0].htmleditorvalue);
          this.dataForm.controls['fileservername'].patchValue(datalist2[0].fileservername);
          this.dataForm.controls['audioservername'].patchValue(datalist2[0].audioservername);
          this.dataForm.controls['videoservername'].patchValue(datalist2[0].videoservername);
          this.dataForm.controls['imageservername'].patchValue(datalist2[0].imageservername);
          // if(this.dataForm.controls['trainingcategory'].value!='')
          // {
            this.getdata();
          // }
          this.editid = datalist2[0]._id;
          this.typefile();
          if(datalist2[0].filetype=='audio'){
            this.nameis = datalist2[0].audiolocalname;
            this.servernameis = datalist2[0].audioservername;
          }
          if(datalist2[0].filetype=='video'){
            this.nameis = datalist2[0].videolocalname;
            this.servernameis = datalist2[0].videoservername;
          }
          if(datalist2[0].filetype=='image'){
            this.nameis = datalist2[0].imagelocalname;
            this.servernameis = datalist2[0].imageservername;
          }
          if(datalist2[0].filetype=='file'){
            this.nameis = datalist2[0].filelocalname;
            this.servernameis = datalist2[0].fileservername;
          }
          this.percentageis = 100;
          this.lengthis=datalist2.length;
        })

  }

  onUploadOutput(output:UploadOutput):void {
    this.servernameis = null;
    this.errormg='';
   /* this.files = [];
    this.lengthis=null;
    this.percentageis=null;*/
    this.uploaderInput.nativeElement.value = '';
    if (output.type === 'allAddedToQueue') {
      const event:UploadInput = {
        type: 'uploadAll',
        url: this._commonservices.nodesslurl + 'uploads',
        method: 'POST',
      };
      this.uploadInput.emit(event);
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      if (output.file.response != "") {
        this.files = [];
        this.files.push(output.file);
        console.log('this.files*********');
        console.log(this.files);
        this.lengthis = this.files.length;
        this.percentageis = this.files[0].progress.data.percentage;
      }
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
      this.lengthis = this.files.length;
      this.percentageis = this.files[0].progress.data.percentage;
      console.log('this.files==================');
      console.log(this.files);
    } else if (output.type === 'removed') {
      this.files = this.files.filter((file:UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
    console.log('files-');
    console.log(this.files);
    if(this.files.length>0 && this.files[0].name!=null && this.files[0].response != null){
      this.lengthis = this.files.length;
      this.percentageis = this.files[0].progress.data.percentage;
      this.nameis = this.files[0].name;
      this.servernameis = this.files[0].response;
      if(this.dataForm.value['filetype']=='file'){
        this.last = this.files[0].name.substring(this.files[0].name.lastIndexOf(".") + 1, this.files[0].name.length);
        if(this.last!='doc' && this.last!='docx'  && this.last!='pdf' && this.last!='ppt' && this.last!='pptx' && this.last!='txt' && this.last!='xls' ){
          console.log('No');
          this.errormg='in error , wrong file uploader ..';
        }
        else {
      /*    /!*POST - st*!/
          let data={
            filename:this.files[0].response
          }
          const link = this._commonservices.nodesslurl+'getslidevalues';
          this._http.post(link,data)
        .subscribe(res=>{
            let result;
            result=res;
            console.log(result);
            console.log(result.imagePaths);
          })
          /!*POST - end*!/*/
          console.log('yes');
          this.dataForm.patchValue({
            fileservername : this.files[0].response,
            filelocalname : this.files[0].name
          });
        }
      }
      else if(this.dataForm.value['filetype']=='audio'){

        console.log('in audio patch block');
        console.log(this.files);
        console.log(this.files[0].type);
        if(this.files[0].type.indexOf('audio')==-1){
          console.log('in error , wrong audio file uploader ..');
          console.log('No');
          this.errormg='in error , wrong audio file uploader ..';
        }
        else {
          console.log('yes');
          this.dataForm.patchValue({
            audioservername : this.files[0].response,
            audiolocalname : this.files[0].name
          });
        }
      }
      else if(this.dataForm.value['filetype']=='video'){
        if(this.files[0].type.indexOf('video')==-1){
          console.log('in error , wrong video file uploader ..');
          this.errormg='in error , wrong video file uploader ..';
        }
        else {
          this.dataForm.patchValue({
            videoservername : this.files[0].response,
            videolocalname : this.files[0].name
          });
        }
      }
      else if(this.dataForm.value['filetype']=='image'){
        if(this.files[0].type.indexOf('image')==-1){
          console.log('in error , wrong video file uploader ..');
          this.errormg='in error , wrong video file uploader ..';
        }
        else {
          this.dataForm.patchValue({
            imageservername : this.files[0].response,
            imagelocalname : this.files[0].name
          });
        }
      }
    }
  }
  getdata()
  {
    console.log("Change...");
    console.log(this.dataForm.controls['trainingcategory'].value);
    const link = this._commonservices.nodesslurl+'datalist?token='+this._cookieservice.get('jwttoken');
    this._http.post(link,{source:'traininglesson',condition:{trainingcategory_object:this.dataForm.controls['trainingcategory'].value}})
        .subscribe(res=>{
          let result;
          result=res;
          this.datalist1=result.res;
          console.log('lessonresult');
          console.log(result);
        })

  }
  dosubmit() {
    this.issubmit=1;
    this.errormg='';


    /*mark all touch*/
    let x: any;
    for (x in this.dataForm.controls) {
      this.dataForm.controls[x].markAsTouched();
      console.log(this.dataForm.controls[x].valid);
    }

    /*Clear dynamic validations*/
    this.dataForm.controls['htmleditorvalue'].clearValidators();
    this.dataForm.controls["htmleditorvalue"].updateValueAndValidity();
    this.dataForm.controls['fileservername'].clearValidators();
    this.dataForm.controls["fileservername"].updateValueAndValidity();
    this.dataForm.controls['audioservername'].clearValidators();
    this.dataForm.controls["audioservername"].updateValueAndValidity();
    this.dataForm.controls['videoservername'].clearValidators();
    this.dataForm.controls["videolocalname"].updateValueAndValidity();
    this.dataForm.controls['imageservername'].clearValidators();
    this.dataForm.controls["imagelocalname"].updateValueAndValidity();

    //Dynamically add validation
    if(this.dataForm.value['filetype']=='html')
    {
      this.dataForm.controls['htmleditorvalue'].setValidators(Validators.required);
      this.dataForm.controls['htmleditorvalue'].markAsTouched();
      this.dataForm.controls["htmleditorvalue"].updateValueAndValidity();

      this.dataForm.value['fileservername']=null;
      this.dataForm.value['filelocalname']=null;
      this.dataForm.value['audioservername']=null;
      this.dataForm.value['audiolocalname']=null;
      this.dataForm.value['videoservername']=null;
      this.dataForm.value['videolocalname']=null;
      this.dataForm.value['imageservername']=null;
      this.dataForm.value['imagelocalname']=null;
    }
    else if(this.dataForm.value['filetype']=='file')
    {
      this.dataForm.controls['fileservername'].setValidators(Validators.required);
      this.dataForm.controls['fileservername'].markAsTouched();
      this.dataForm.controls["fileservername"].updateValueAndValidity();

      this.dataForm.value['htmleditorvalue']=null;
      this.dataForm.value['audioservername']=null;
      this.dataForm.value['audiolocalname']=null;
      this.dataForm.value['videoservername']=null;
      this.dataForm.value['videolocalname']=null;
      this.dataForm.value['imageservername']=null;
      this.dataForm.value['imagelocalname']=null;
    }
    else if(this.dataForm.value['filetype']=='audio')
    {
      this.dataForm.controls['audioservername'].setValidators(Validators.required);
      this.dataForm.controls['audiolocalname'].markAsTouched();
      this.dataForm.controls["audioservername"].updateValueAndValidity();

      this.dataForm.value['htmleditorvalue']=null;
      this.dataForm.value['filelocalname']=null;
      this.dataForm.value['fileservername']=null;
      this.dataForm.value['videoservername']=null;
      this.dataForm.value['videolocalname']=null;
      this.dataForm.value['imageservername']=null;
      this.dataForm.value['imagelocalname']=null;
    }
    else if(this.dataForm.value['filetype']=='video')
    {
      this.dataForm.controls['videoservername'].setValidators(Validators.required);
      this.dataForm.controls['videolocalname'].markAsTouched();
      this.dataForm.controls["videoservername"].updateValueAndValidity();

      this.dataForm.value['htmleditorvalue']=null;
      this.dataForm.value['filelocalname']=null;
      this.dataForm.value['fileservername']=null;
      this.dataForm.value['audioservername']=null;
      this.dataForm.value['audiolocalname']=null;
      this.dataForm.value['imageservername']=null;
      this.dataForm.value['imagelocalname']=null;
    }
    else if(this.dataForm.value['filetype']=='image')
    {
      this.dataForm.controls['imageservername'].setValidators(Validators.required);
      this.dataForm.controls['imagelocalname'].markAsTouched();
      this.dataForm.controls["imageservername"].updateValueAndValidity();

      this.dataForm.value['htmleditorvalue']=null;
      this.dataForm.value['filelocalname']=null;
      this.dataForm.value['fileservername']=null;
      this.dataForm.value['audioservername']=null;
      this.dataForm.value['audiolocalname']=null;
      this.dataForm.value['videoservername']=null;
      this.dataForm.value['videolocalname']=null;
    }

// console.log('this.dataForm.value====================');
// console.log(this.dataForm.value);
    let data;
    data=this.dataForm.value;
    if(this.editid!=null){
      data.id=this.editid;
    }
    console.log(data);
    if (this.dataForm.valid) {
      let link = this._commonservices.nodesslurl + 'addorupdatedata?token='+this._cookieservice.get('jwttoken');
      let objarr=['trainingcategory','prerequisite_lesson'];
      this._http.post(link, {source:'traininglesson',data:data,sourceobj:objarr})
          .subscribe(res => {
            let result:any ={};
            result = res;
            this.issubmit=0;
            console.log('result....');
            console.log(result);
            this.sliderresult=result;
            if(result.status=='error'){
              this.errormg=result.msg;
            }
            else {
              if(this.dataForm.value['filetype']=='file'){
                this.callslider();
              }

              this.router.navigate(['/trainingsectionlist']);
              this.dataForm.reset();
              this.files=[];
            }
          }, error => {
            this.callslider();
            console.log('Oooops!');
          });
    }
  }
  callslider(){
    let data={
      filename:this.files[0].response,
      lessonid:this.sliderresult.res,
    }
    const link = this._commonservices.nodesslurl+'getslidevalues';
    this._http.post(link,data)
        .subscribe(res=>{
          let result;
          result=res;
          console.log(result);
          console.log(result.imagePaths);
        }, error =>{
          this.callslider();
          console.log('Ooops');
        });
  }
}
