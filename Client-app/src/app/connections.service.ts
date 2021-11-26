import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionsService {

  readonly server : string = environment.APIEndpoint;

  constructor(private http : HttpClient,private cookie : CookieService) { }

  private readonly _currConnection = new BehaviorSubject<any>({});
  private readonly _Lists = new BehaviorSubject<any[]>([]); 

  readonly current$ = this._currConnection.asObservable();

  get current(): any {
    return this._currConnection.getValue();
  }
  private set current(val: any) {
    this._currConnection.next(val);
  }

  readonly list$ = this._Lists.asObservable();
  get list(): any[] {
    return this._Lists.getValue();
  }
  private set list(val: any[]) {
    this._Lists.next(val);
  }

  getHeader()
  {
    return {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.cookie.get('intro-cookie')}`)
    }
  }

  searchConnections(url : string,username : string,password : string) {
    let temp = {
      url : url,
      username : username,
      password : password
    }
    return this.http.post(this.server+'scrap',temp,this.getHeader())
  }

  initList() {
    // obtain user lists here
    return this.http.get(this.server+"getlist",this.getHeader())
    .pipe (
      tap (
        data =>{
          this.list = data as any[];
        },
        err =>{
          console.log("Could not initilize list data")
        }
      )
    )
  }

  syncListsWithServer(name : string, data : any[],isNew : boolean) {
    // Sync list data here
    let temp = {
      name : name,
      data : data
    }
    let str = isNew ? "addList" : "updateList"
    this.http.post(this.server+str,temp,this.getHeader())
    .subscribe(
      res =>{
        console.log("Syncing Successful!")
      },
      err =>{
        console.log("Syncing with server failed")
      }
    )
  }

  addToExisting(n : string,data : any[]) : boolean {
    let temp = []
    let found = false
    for(let k of this.list)
    {
      if(k.name==n)
      {
        found = true;
        if(k.data)
        {
          k.data = [...k.data,...data]
        }
      }
      temp.push(k);
    }
    this.list = temp;
    if(found)
    {
      // to sync data
      this.syncListsWithServer(n,data,false);
    }
    return found;
  }

  addNew(obj : any) : boolean
  {
    let temp = true;
    if(obj.name)
    {
      for(let k of this.list)
      {
        if(k.name==obj.name)
        {
          temp = false
        }
      }
    }
    if(temp && obj.name)
    {
      this.list = [...this.list,obj]
      // to sync data
      this.syncListsWithServer(obj.name,obj.data,true);
    }
    return temp;
  }

  // simple service for selected lists
  selected: any[] = [];

  setSelected(select : any[])
  {
    this.selected = select;
  }

  getSelected()
  {
    return this.selected;
  }

  getTempList()
  {
    return this.http.get(this.server+'getTempList',this.getHeader())
  }

  viewTempConnections(i : string)
  {
    let temp = {
      id : i
    }
    return this.http.post(this.server+'getTempConnections',temp,this.getHeader())
    .pipe(
      tap(
        data =>{
          this.current = data
        },
        err =>{
          console.log("Error in obtaining temporary connection for temp list")
        }
      )
    )
  }
}
