import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserLogged = false;
  susbcription: Subscription;
 constructor(private dataStorageService: DataStorageService,
  
  private authService: AuthService){ }


  ngOnInit(): void {
    this.susbcription = this.authService.authUser
    .subscribe(user => {
      this.isUserLogged = !!user;
      console.log(!user);
      console.log(!!user);
    });
  }

 onSaveData(){
  this.dataStorageService.storeRecipes();
 }

 onFetchData(){
  this.dataStorageService.fetchRecipes().subscribe();
 }

 onLogout(){
  this.authService.logout();
 }

 ngOnDestroy(): void {
   this.susbcription.unsubscribe();
 }
}
