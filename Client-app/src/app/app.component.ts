import { Component } from '@angular/core';
import { AuthServiceService } from './auth-service.service';
import { ConnectionsService } from './connections.service';
import { RouteService } from './route.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Intros LinkdIn';
  menuList : any[] = []
  menuList2 : any[] = []
  user : any;
  defaultImage : string = "https://i.ibb.co/6ym0x7x/default.png"
  logdIn : boolean = false
  register : boolean = false
  currRoute : string = ''
  list : any[] = []

  data : any = {};

  constructor(private auth : AuthServiceService,private route : RouteService,private connect : ConnectionsService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.auth.checkUser()
    this.auth.user$.subscribe((res : any)=>{
      this.user = res[0]
      this.logdIn = res.length;
      this.setMenu(res.length)
    })
    
    this.connect.current$.subscribe((res : any)=>{
      this.data = res;
    })

    this.auth.InProg$.subscribe(
      data =>{
        if(data){this.spinner.show()}else{this.spinner.hide()};
      })

    this.route.route$.subscribe((res : any)=>{
      this.currRoute = res
      let temp = this.auth.person.length > 0 ? true : false
      this.setMenu(temp)
    })

    this.connect.list$.subscribe((res : any)=>{
      this.list = res;
      this.setMenu(this.auth.loggedIn);
    })
  }

  setMenu (loggedIn : boolean) {
    if(loggedIn && this.currRoute=='Lists')
    {
      this.menuList = [
        {str : 'Home',icon : 'home'}
      ];
      this.menuList2 = [];
      for(let k of this.list)
      {
        this.menuList2.push({str : k.name,icon : 'list'})
      }
      this.menuList2.push({str : 'Add Empty List',icon : 'add_box'})
    }
    else if(loggedIn)
    {
      this.menuList = [
        {str : 'Home',icon : 'home'},
        {str : 'Lists',icon : 'view_list'},
        {str : 'Pending',icon : 'pending'},
        {str : 'Settings',icon : 'settings'}
      ];
      this.menuList2 = [
        {str : 'Help',icon : 'help'},
        {str : 'Log Out',icon : 'logout'}
      ];
    }
    else
    {
      this.menuList = [
        {str : 'Log In',icon : 'login'},
        {str : 'Register',icon : 'app_registration'}
      ];
      this.menuList2 = [
        {str : 'Help',icon : 'help'},
        {str : 'About',icon : 'info'}
      ];
    }
  }

  btnClick(str : string)
  {
    if(str=='Home') { this.route.setRoute(str) }
    else if(str=='Log In') { this.register = false; }
    else if(str=='Register') { this.logdIn = false; this.register = true;}
    else if(str=='Log Out') { this.auth.logout() }
    else if(str=='Lists') { this.route.setRoute(str); this.route.newBtnClick(str);}
    else if(this.currRoute=='Lists') { this.route.newBtnClick(str); }
    else { this.route.setRoute(str); }
  }

  getImage() {
    return this.defaultImage;
  }

  getName() {
    if(this.user)
    {
      return this.user.fullName;
    }
    return 'Guest';
  }

  getPos() {
    if(this.user)
    {
      return this.user.position;
    }
    return '';
  }
}
