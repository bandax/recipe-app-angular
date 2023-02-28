import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'Test';
  constructor(
    private store: Store
  ){

  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.autoLogin());
  }
}
