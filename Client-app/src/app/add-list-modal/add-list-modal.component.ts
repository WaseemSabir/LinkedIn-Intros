import { Component, OnInit } from '@angular/core';
import { ConnectionsService } from '../connections.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RouteService } from '../route.service';

// two components in this file
@Component({
  selector: 'app-add-list-modal',
  templateUrl: './add-list-modal.component.html',
  styleUrls: ['./add-list-modal.component.scss']
})
export class AddListModalComponent implements OnInit {

  constructor(private connect : ConnectionsService,private modal: NzModalService,private route : RouteService) { }

  allLists : any[] = [];

  ngOnInit(): void {
    this.connect.list$.subscribe(
      data =>{
        this.allLists = data;
      },
      err => console.log("Unable to obtain lists")
    )
  }

  showModal(): void {
    this.route.setVisible(true);
  }

  addToExistingList(listname : string)
  {
    let data = this.connect.getSelected()
    if(!this.areConnectionsSelected(data)) { return; }
    let temp = this.connect.addToExisting(listname,data);
    if(temp)
    {
      this.modal.success({
        nzTitle: 'Successfully Added',
        nzContent: `Selected connections has been successfully added to ${listname}`
      });
    }
    else
    {
      this.modal.error({
        nzTitle: 'Some Error Occured',
        nzContent: `Please try again and make sure everything is correct.`
      });
    }
  }

  areConnectionsSelected(d : any[])
  {
    if(d.length)
    {
      return true;
    }
    else
    {
      this.modal.error({
        nzTitle: 'Error',
        nzContent: `No connections are selected, Please select connections to add to list.`
      });
      return false;
    }
  }
}


// Component 2 - Modal view

@Component({
  selector: 'app-modal-view',
  templateUrl: './modal-view.html',
  styleUrls: []
})
export class ModalView implements OnInit {

  allLists : any[] = [];
  isVisible : boolean = false;
  newListName = '';

  error : boolean = false
  errorStr : string = ''

  constructor(private connect : ConnectionsService,private modal: NzModalService,private route : RouteService) { }

  ngOnInit(): void {
    this.connect.list$.subscribe(
      data =>{
        this.allLists = data;
      },
      err => console.log("Unable to obtain lists")
    )
    
    this.route.visible.subscribe((res : boolean)=>{
      this.isVisible = res;
    })
  }

  handleOk(): void {
    // on create button click
    if(!this.newListName.length)
    {
      this.error = true
      this.errorStr = 'List Name can not be empty'
    }
    else if(this.nameExists())
    {
      this.error = true
      this.errorStr = 'List with similar name already exists.'
    }
    else
    {
      this.error = false
      this.route.setVisible(false);
      let d = this.connect.getSelected();
      let temp_obj = {
        name : this.newListName,
        data : d
      }
      let temp = this.connect.addNew(temp_obj);
      if(!d.length)
      {
        this.modal.success({
          nzTitle: 'Success',
          nzContent: `New List has been created.Since, no connections were selected, the list is currently empty.`
        });
      }
      else if(temp)
      {
        this.modal.success({
          nzTitle: 'Successfully Added',
          nzContent: `Selected connections has been successfully added to ${this.newListName}`
        });
      }
      else
      {
        this.modal.error({
          nzTitle: 'Some Error Occured',
          nzContent: `Please try again and make sure everything is correct.`
        });
      }
    }
  }

  handleCancel(): void {
    this.route.setVisible(false);
  }

  nameExists() : boolean
  {
    let temp = []
    for(let k of this.allLists)
    {
      temp.push(k.name);
    }
    return temp.includes(this.newListName);
  }
}