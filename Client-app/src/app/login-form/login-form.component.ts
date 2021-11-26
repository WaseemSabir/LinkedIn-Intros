import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  login = new FormGroup({
    username  : new FormControl(''),
    password : new FormControl('')
  })
  error : boolean = false
  errorStr : string = ''

  constructor(private auth : AuthServiceService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  userChanged(ev : any)
  {
    this.login.get('username')!.setValue(ev.target.value)
  }

  passChanged(ev : any)
  {
    this.login.get('password')!.setValue(ev.target.value)
  }

  submit()
  {
    if(this.login.get('username')!.value && this.login.get('password')!.value)
    {
      this.error = false;
      this.spinner.show()
      this.auth.login(this.login.get('username')!.value,this.login.get('password')!.value)
      .subscribe(
        data=>{
          this.spinner.hide();
        },
        err =>{
          this.spinner.hide();
          this.error = true;
          this.errorStr = "Login Failed. Please check your credentials."
        }
      )
    }
    else
    {
      this.error = true;
      this.errorStr = 'Username or password cannot be empty!'
    }
  }

}
