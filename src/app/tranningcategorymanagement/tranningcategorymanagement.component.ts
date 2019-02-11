import { Component, OnInit } from '@angular/core';
import {Commonservices} from '../app.commonservices' ;

@Component({
  selector: 'app-tranningcategorymanagement',
  templateUrl: './tranningcategorymanagement.component.html',
  styleUrls: ['./tranningcategorymanagement.component.css'],
  providers: [Commonservices]
})
export class TranningcategorymanagementComponent implements OnInit {
public formdata:any;
public datasource:any;
public tabledatalis:any[];
public sourcecondition:any={type:this._commonservices.roletypes[3].type3}

  constructor(public _commonservices: Commonservices) {
  this.tabledatalis=[
    {value:'id',name:'Id',role:0,func:'',class:'id',type:'#'},
    {value:'categoryname',name:'Category Name',role:0,func:'',class:'categoryname',type:'text'},
    {value:'description',name:'Description',role:0,func:'',class:'description',type:'text'},
    {value:'type',name:'Type',role:0,func:'',class:'type',type:'text'},
    {value:'roleaccess',name:'Role Access',role:0,func:'',class:'roleaccess',type:'text'},
    {value:'status',name:'Status',role:0,func:'',class:'status',type:'checkbox',editrole:['admin']},
  ];
  this.formdata=[
    {inputtype:'text',name:'categoryname',label:'Category Name',placeholder:'Enter Category Name',validationrule:{required:true},validationerrormsg:'is required'},
    {inputtype:'textarea',name:'description',label:'Description',placeholder:'Enter Description',validationrule:{required:true},validationerrormsg:'is required'},
    {inputtype:'text',name:'type',label:'Choose Type',placeholder:'type',validationrule:{required:true},validationerrormsg:'is required'},
    {inputtype:'hidden',name:'type',label:"type",placeholder:"Enter Password",value:this._commonservices.roletypes[3].type3},
    {inputtype:'text',name:'roleaccess',label:'Choose Role Access',placeholder:'role',validationrule:{required:true},validationerrormsg:'is required'},
    {inputtype:'checkbox',name:'status',label:'Status',value:false},
  ];
    this.datasource={table:'users',objarr:[]};
  }

  ngOnInit() {
  }

}
