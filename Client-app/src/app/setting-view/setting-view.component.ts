import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-setting-view',
  templateUrl: './setting-view.component.html',
  styleUrls: ['./setting-view.component.scss']
})
export class SettingViewComponent implements OnInit {

  minOverlapWork : number = 0;
  minOverlapUni : number = 0;
  delay : number = 0;
  changed : boolean = false;

  constructor(private auth : AuthServiceService,private spinner : NgxSpinnerService) { }

  ngOnInit(): void {
    this.auth.getSetting().subscribe((res : any)=>{
      this.minOverlapWork = res.workCutout;
      this.minOverlapUni = res.eduCutOut;
      this.delay = res.timeDelay;
    })
  }

  saveNewSet()
  {
    this.spinner.show();
    this.auth.setSetting(this.minOverlapWork,this.minOverlapUni,this.delay).subscribe((res : any)=>{
      this.changed = false;
      this.spinner.hide();
    })
  }

}
