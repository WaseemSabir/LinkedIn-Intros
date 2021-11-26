import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConnectionsService } from '../connections.service';
import { RouteService } from '../route.service';

@Component({
  selector: 'app-pending-list',
  templateUrl: './pending-list.component.html',
  styleUrls: ['./pending-list.component.scss']
})
export class PendingListComponent implements OnInit {

  pendingList : any[] = []
  refreshStatus : boolean = false;
  reErr : boolean = false;

  constructor(private connect : ConnectionsService,private spinner : NgxSpinnerService,private route: RouteService) { }

  ngOnInit(): void {
    this.spinner.show()
    this.connect.getTempList().subscribe((res : any)=>{
      this.spinner.hide();
      this.pendingList = res.reverse();
    })
  }

  viewConnection(i : string)
  {
    this.spinner.show();
    this.connect.viewTempConnections(i)
    .subscribe(
      data =>{
        this.spinner.hide();
        this.route.setRoute('ViewList');
      }
    )
  }

  refresh()
  {
    this.refreshStatus = true;
    this.connect.getTempList().toPromise()
    .then((data:any)=>{
      this.refreshStatus = false;
      this.reErr = false;
      this.pendingList = data.reverse();
    })
    .catch(err=>{
      this.refreshStatus = false;
      this.reErr = true;
    })
  }

}
