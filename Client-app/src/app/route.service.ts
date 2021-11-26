import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor() { }

  private readonly _route = new BehaviorSubject<string>('Home');

  readonly route$ = this._route.asObservable();

  get route(): string {
    return this._route.getValue();
  }

  private set route(val: string) {
    this._route.next(val);
  }

  setRoute(str : string) {
    this.route = str
  }

  // Button clicks in lists
  _btnClick = new BehaviorSubject<string>('');
  btnClick$ = this._btnClick.asObservable();

  newBtnClick (str : string) {
    this._btnClick.next(str);
  }

  // modal visibility state
  _visible = new BehaviorSubject<boolean>(false);
  visible = this._visible.asObservable();

  setVisible(temp : boolean)
  {
    this._visible.next(temp);
  }
}
