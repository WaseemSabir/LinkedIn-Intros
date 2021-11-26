import { Component, OnInit } from '@angular/core';
import { ConnectionsService } from '../connections.service';
import { RouteService } from '../route.service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {

  constructor(private route : RouteService,private connect : ConnectionsService) { }

  allLists : any[] = []
  listName : string[] = []
  currClick : string = 'Lists';
  currList : any[] = []

  ngOnInit(): void {

    this.route.btnClick$.subscribe(
      data =>{
        this.currClick = data;
        this.handleActions();
      },
      err => {
        console.log(err,"Can not obtain clicks from routing")
      }
    )

    this.connect.list$.subscribe(
      data =>{
        this.allLists = data;
        this.listName = []
        for(let k of this.allLists)
        {
          this.listName.push(k.name);
        }
      },
      err => {
        console.log("Could Not obtain lists in list view")
      }
    )
  }

  handleActions()
  {
    if(this.currClick=="Add Empty List") {
      this.connect.setSelected([]);
      this.route.setVisible(true);
      this.route.newBtnClick('');
      this.currList = [];
    }
    else if(this.currClick=="Lists")
    {
      this.currList = [];
    }
    else if(this.listName.includes(this.currClick))
    {
      this.pushCurrentList(this.currClick);
    }
  }

  goBackHome()
  {
    this.route.setRoute('Home');
  }

  pushCurrentList(naam : string) {
    this.currList = []
    for(let k of this.allLists)
    {
      if(k.name == naam)
      {
        this.currList.push(...k.data);
      }
    }
  }
}
