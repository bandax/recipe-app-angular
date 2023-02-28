
import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({providedIn: 'root'})
export class AuthService {
    // authUser = new BehaviorSubject<User>(null);   
    tokenExpirationTimer = null; 

    constructor(       
        private store: Store<fromApp.IAppState>
        ){
        
    }        

    setLogoutTimer(expirationDuration: number) {
        console.log(expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(AuthActions.logout());
        }, expirationDuration)
    }

    clearLogoutTimer() {
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }
}