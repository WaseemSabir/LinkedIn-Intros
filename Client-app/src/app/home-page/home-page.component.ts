import { Component, Input, OnInit } from '@angular/core';
import { ConnectionsService } from '../connections.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Subject } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  // Input Fields
  search = ''
  passwordVisible = false;
  password: string = '';
  username: string = '';
  
  // Error Showing
  error : boolean = false
  errorStr : string = ''

  // Check Boxes
  checkBox : boolean[] = []
  allCheck : boolean = false

  // Modal Visibility
  isVisible : boolean = false

  // Data
  connections : any[] = []
  @Input() fullData : any;
  OverlapCount : number = 0;
  NonlapCount : number = 0;
  
  // Filters and Sorts
  showOverLap: boolean = false;
  list : string[] = ['both','Education','Work']
  sort : string = 'both'
  filter : string = 'both'
  eventEmitter : Subject<void> = new Subject<void>();

  constructor(private connect : ConnectionsService,private spinner: NgxSpinnerService,private modal: NzModalService) { }

  ngOnInit(): void {
    if(this.fullData)
    {
      this.initData();
    }
  }

  submitSearch()
  {
    this.connect.setSelected([]);
    this.isVisible = false;
    if(this.search.length)
    {
      this.error = false
      this.spinner.show();
      this.connect.searchConnections(this.search,this.username,this.password)
      .subscribe(
        data =>{
          this.spinner.hide();
          this.error = false;
          this.fullData = data;
          this.modal.success({
            nzTitle: 'Success',
            nzContent: `Successfully added to your pending connection requests`
          });
        },
        err => {
          this.spinner.hide();
          this.error = true;
          this.errorStr = "Some error occured! Please try again later."
        }
      );
    }
    else
    {
      this.error = true;
      this.errorStr = "Please give valid input!"
    }
  }

  allEvent(ev : any)
  {
    for(let i=0;i<this.checkBox.length;i++)
    {
      this.checkBox[i] = ev.checked;
    }
    this.allCheck = ev.checked;
    this.updateSelected();
  }

  checkProcess(ev : any,i : number)
  {
    try
    {
      this.checkBox[i] = ev.checked;
      let temp = true
      for(let k of this.checkBox)
      {
        temp = temp && k
      } 
      this.allCheck = temp;
      this.updateSelected();
    }
    catch
    {
      console.log("Listing errored out")
    }
  }

  updateSelected()
  {
    this.connect.setSelected(this.connections.filter((val : any,i : number)=>{return this.checkBox[i]}));
  }

  // Modal view 
  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  overlapProcess(ev: any)
  {
    this.showOverLap = ev.checked;
    this.initData()
  }

  initData()
  {
    this.allCheck = false;
    if(this.showOverLap)
    {
      this.connections = JSON.parse(JSON.stringify(this.fullData.Connections));
      this.connections = this.filterData(this.connections);
    }
    else
    {
      let temp = JSON.parse(JSON.stringify(this.fullData))
      this.connections = this.filterData(temp.Connections);
      this.connections = temp.Connections.filter((val : any)=>{
        return (Object.keys(val.score.work_score).length || Object.keys(val.score.edu_score).length)
      });

      this.OverlapCount = this.connections.length;
      this.NonlapCount = this.fullData.Connections.length - this.OverlapCount;
    }

    // Initilize check box list for checking
    this.checkBox = []
    for(let k of this.connections)
    {
      this.checkBox.push(false);
    }

    this.filterSortLogic();

    // Apply sorts
    this.connections = this.sortData(this.connections)

    this.eventEmitter.next();
  }

  filterSortLogic()
  {
    if(this.filter=='Work')
    {
      this.sort = 'Work'
    }
    else if(this.filter=='Education')
    {
      this.sort = 'Education'
    }
  }

  filterData(list : any[]) : any[]
  {
    list = list.map((val : any)=>{
      if(this.filter=="Education")
      {
        val.score.work_score = {}
      }
      else if(this.filter=="Work")
      {
        val.score.edu_score = {}
      }
      return val;
    })
    return list;
  }

  sortData(list : any[]) : any[]
  {
    let sorted = list.sort((a : any,b : any)=>{
      let total_a = 0
      let total_b = 0

      if(this.sort=="both" || this.sort=="Education")
      {
        for(let key of Object.keys(a.score.edu_score)){
          total_a += a.score.edu_score[key]
        }
        for(let key of Object.keys(b.score.edu_score)){
          total_b += b.score.edu_score[key]
        }
      }

      if(this.sort=="both" || this.sort=="Work")
      {
        for(let key of Object.keys(a.score.work_score)){
          total_a += a.score.work_score[key]
        }
        for(let key of Object.keys(b.score.work_score)){
          total_b += b.score.work_score[key]
        }
      }

      return (total_b) -(total_a);
    })
    return sorted;
  }
}