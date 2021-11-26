import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

  register = new FormGroup({
    fullName : new FormControl(''),
    position : new FormControl(''),
    username : new FormControl(''),
    password : new FormControl(''),
    profileImage : new FormControl(null,Validators.required)
  })
  errorStr : string = ''
  error : boolean = false

  constructor(private auth : AuthServiceService,private cd: ChangeDetectorRef,private fb: FormBuilder,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  userChanged(ev : any)
  {
    this.register.get('username')!.setValue(ev.target.value)
  }

  nameChanged(ev : any)
  {
    this.register.get('fullName')!.setValue(ev.target.value)
  }

  posChanged(ev : any)
  {
    this.register.get('position')!.setValue(ev.target.value)
  }

  passChanged(ev : any)
  {
    this.register.get('password')!.setValue(ev.target.value)
  }

  imageChanged(event : any)
  {
    const reader = new FileReader();
 
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.register.patchValue({
          profileImage: reader.result
        });
      
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  submit() {
    if(this.register.get('fullName')!.value.length && this.register.get('position')!.value.length && this.register.get('username')!.value.length && this.register.get('password')!.value.length)
    {
      this.error = false;
      this.spinner.show();
      this.auth.register(this.register.get('fullName')!.value,this.register.get('position')!.value,this.register.get('username')!.value,this.register.get('password')!.value,this.register.get('profileImage')!.value)
      .subscribe(
        data =>{
          this.spinner.hide();
        },
        err =>{
          this.spinner.hide();
          this.error = true;
          this.errorStr = "Regitration Failed.\nUser might already exist, Please check your input"
        }
      )
    }
    else
    {
      this.error = true;
      this.errorStr = "Fields cannot be empty!"
    }
  }

}
