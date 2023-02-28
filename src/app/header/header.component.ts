import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserLogged = false;
  susbcription: Subscription;
 constructor(
  private store: Store<fromApp.IAppState>
  ){ }


  ngOnInit(): void {
   // this.susbcription = this.authService.authUser
   this.susbcription = this.store.select('auth')
    .pipe(
      map(authState => authState.user)
    )
    .subscribe(user => {
      this.isUserLogged = !!user;
      console.log(!user);
      console.log(!!user);
    });
  }

 onSaveData(){
  //this.dataStorageService.storeRecipes();
  this.store.dispatch(RecipeActions.storeRecipes());
 }

 onFetchData(){
  //this.dataStorageService.fetchRecipes().subscribe();
  this.store.dispatch(RecipeActions.fetchRecipes());
 }

 onLogout(){
  this.store.dispatch(AuthActions.logout());
 }

 ngOnDestroy(): void {
   this.susbcription.unsubscribe();
 }
}
