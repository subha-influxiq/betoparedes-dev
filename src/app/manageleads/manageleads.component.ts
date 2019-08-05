import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-manageleads',
  templateUrl: './manageleads.component.html',
  styleUrls: ['./manageleads.component.css']
})
export class ManageleadsComponent implements OnInit {
  public formdata: any;
  public datasource: any;
  public tabledatalist: any[];
  public sourcecondition: any = {};
  public hideaddval: any = false;
  constructor(public cookieservice: CookieService) {
    this.tabledatalist = [
      { value: 'id', name: 'Id', role: 0, func: '', class: 'id', type: '#' },
      { value: 'firstname', name: 'First Name', role: 0, func: '', class: 'firstname', type: 'text' },
      { value: 'lastname', name: 'Last Name', role: 0, func: '', class: 'lastname', type: 'text' },
      { value: 'email', name: 'Email Id', role: 0, func: '', class: 'email', type: 'text' },
      { value: 'phoneno', name: 'Mobile No', role: 0, func: '', class: 'mobile', type: 'phoneno' },
      { value: 'address', name: 'Address', role: 0, func: '', class: 'address', type: 'text' },
      { value: 'fullname', name: 'Rep Details', role: 0, func: '', class: 'fullname', type: 'text' }
    ];
    this.formdata = [
      { inputtype: 'text', name: 'firstname', label: 'First Name', placeholder: 'Enter First Name', validationrule: { required: true }, validationerrormsg: 'is required' },
      { inputtype: 'text', name: 'lastname', label: 'Last Name', placeholder: 'Enter Last Name', validationrule: { required: true }, validationerrormsg: 'is required' },
      { inputtype: 'email', name: 'email', label: 'Email Id', placeholder: 'Enter Your Email', validationrule: { required: true, email: true }, validationerrormsg: 'is required and should be valid' },
      { inputtype: 'textarea', name: 'address', label: 'Address', placeholder: 'Enter Address' },
      { inputtype: 'text', name: 'phoneno', label: 'Phone No.', placeholder: 'Enter Mobile Number' },
      { inputtype: 'hidden', name: 'created_by', label: "created_by", placeholder: "Created By", value: this.cookieservice.get('userid') }
    ];
    this.datasource = { table: 'leads', objarr: ["created_by"] };
    if (this.cookieservice.get('usertype') == 'admin') {
      this.sourcecondition = {};
      this.hideaddval = true;
      this.tabledatalist = [
        { value: 'id', name: 'Id', role: 0, func: '', class: 'id', type: '#' },
        { value: 'firstname', name: 'First Name', role: 0, func: '', class: 'firstname', type: 'text' },
        { value: 'lastname', name: 'Last Name', role: 0, func: '', class: 'lastname', type: 'text' },
        { value: 'email', name: 'Email Id', role: 0, func: '', class: 'email', type: 'text' },
        { value: 'phoneno', name: 'Mobile No', role: 0, func: '', class: 'mobile', type: 'phoneno' },
        { value: 'address', name: 'Address', role: 0, func: '', class: 'address', type: 'text' },
        { value: 'fullname', name: 'Rep Details', role: 0, func: '', class: 'fullname', type: 'text' }
      ];
    } else {
      this.sourcecondition = { 'created_by_object': this.cookieservice.get('userid') };
      this.hideaddval = false;
      this.tabledatalist = [
        { value: 'id', name: 'Id', role: 0, func: '', class: 'id', type: '#' },
        { value: 'firstname', name: 'First Name', role: 0, func: '', class: 'firstname', type: 'text' },
        { value: 'lastname', name: 'Last Name', role: 0, func: '', class: 'lastname', type: 'text' },
        { value: 'email', name: 'Email Id', role: 0, func: '', class: 'email', type: 'text' },
        { value: 'phoneno', name: 'Mobile No', role: 0, func: '', class: 'mobile', type: 'phoneno' },
        { value: 'address', name: 'Address', role: 0, func: '', class: 'address', type: 'text' }
      ];
    }
  }

  ngOnInit() {
    console.log(this.cookieservice.get('usertype'));
    // console.log(this.sourcecondition);
    console.log(this.hideaddval);
  }

}
