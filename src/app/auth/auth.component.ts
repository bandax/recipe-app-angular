import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from "@angular/core"
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AlertComponent } from '../shared/alert/alert.component';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent  implements OnInit, OnDestroy{
    private storeSub: Subscription;
    private closeSub : Subscription;

    isLoginMode = true;
    isLoading = false;
    error:string = null;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private store: Store<fromApp.IAppState>
        ) {

    }

    ngOnInit(): void {
        // this.authService.autologin();
        this.storeSub = this.store.select('auth').subscribe(authState =>{
            next: {
                this.isLoading = authState.loading;
                this.error = authState.authError;
                if(this.error){
                    this.showErrorAlert(this.error);
                }
            }
        });
       // this.loggingService.printLog('Hello from AppComponent ngOnit');
    }


    ngOnDestroy(): void {
       if(this.closeSub){
        this.closeSub.unsubscribe();
       }       
       this.storeSub.unsubscribe();
    }

    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(authForm: NgForm){
        if(!authForm.valid) return;
        console.log(authForm.value);
       
        const email = authForm.value.email;
        const password = authForm.value.password;
        if(this.isLoginMode){        
            this.store.dispatch(AuthActions.loginStart({loginData:{email, password}}));               
        }else{
            this.store.dispatch(AuthActions.signUpStart({loginData:{email, password}}));         
        }
        authForm.reset();
    }

    onHandleError(){
        this.store.dispatch(AuthActions.clearError());
    }

    private showErrorAlert(message: string){
        const alertComponentRef = this.viewContainerRef.createComponent(AlertComponent);
        alertComponentRef.setInput("message", message);
        alertComponentRef.instance.message = message;
        this.closeSub = alertComponentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            this.viewContainerRef.clear();
        });
    }
}