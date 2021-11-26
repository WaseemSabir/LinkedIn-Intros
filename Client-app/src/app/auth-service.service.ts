import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { ConnectionsService } from './connections.service';
import { personData } from './Interfeces';
import { tap } from 'rxjs/operators';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  readonly server : string = environment.APIEndpoint;

  constructor(private cookie : CookieService,private connect : ConnectionsService,private http : HttpClient) { }

  private readonly _person = new BehaviorSubject<personData[]>([]);

  readonly user$ = this._person.asObservable();

  get person(): personData[] {
    return this._person.getValue();
  }

  private set person(val: personData[]) {
    this._person.next(val);
  }
  
  register(fn : string, ps : string,un : string,pass : string,im : File) {
    let temp = {
      fname : fn,
      position : ps,
      image : im,
      username : un,
      password : pass
    }

    return this.http.post(this.server+'register',temp)
    .pipe (
      tap (
        data => {
          this.login(un,pass).subscribe((res : any)=>{})
        },
        error => console.log(error)
      )
    )
  }

  checkUser() {
    let temp = this.cookie.get('intro-cookie')
    if (temp)
    {
      this._inProg.next(true);
      let header = {
        headers: new HttpHeaders()
          .set('Authorization',  `Bearer ${this.cookie.get('intro-cookie')}`)
      }
      this.http.get(this.server+'getProfile',header).subscribe((res : any)=>{
        let userData = res.data
        let temp : personData = {
          id : userData.id,
          fullName : userData.fname,
          position : userData.position,
          profileImage : this.server+'static/images'+userData.profileimage,
          userName : userData.username
        }
        this.person = [temp]
        this._loggedIn.next(true);
        this._inProg.next(false);
        this.connect.initList()
        .subscribe(
        )
      },
      err =>{
        this.cookie.delete('intro-cookie')
        this._loggedIn.next(false);
        this._inProg.next(false);
      })
    }
    else
    {
      this._inProg.next(false);
      this._loggedIn.next(false);
      this.person = []
    }
  }

  login(uid : string,pass : string)
  {
    let temp = {
    username : uid,
    password : pass
    }
    return this.http.post(this.server+'api/token/',temp)
    .pipe(
      tap (
        data =>{
          let temp : any = data
          this.cookie.set('intro-cookie',temp.access)
          this.checkUser()
        },
        error => console.log(error)
      )
    )
  }

  logout()
  {
    this.cookie.delete('intro-cookie')
    this.checkUser()
  }

  // User Data reterival in Progress
  _inProg = new BehaviorSubject<boolean>(false);
  InProg$ = this._inProg.asObservable();

  // User Logged In or not
  private readonly _loggedIn = new BehaviorSubject<boolean>(false);

  get loggedIn() : boolean {
    return this._loggedIn.getValue();
  }

  getHeader()
  {
    return {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.cookie.get('intro-cookie')}`)
    }
  }

  getSetting()
  {
    return this.http.get(this.server+'getSetting',this.getHeader());
  }

  setSetting(work : number,edu : number,delay : number)
  {
    let temp = {
      'workThreshold' : work,
      'eduThreshold' : edu,
      'timeDelay' : delay
    }
    return this.http.post(this.server+'setSetting',temp,this.getHeader());
  }
}
