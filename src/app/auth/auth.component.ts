import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from "@angular/core"
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AuthResponseData, AuthService } from "./auth.service";
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { LogginService } from "../logging.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent  implements OnInit, OnDestroy{
    //@ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
    private closeSub : Subscription;

    isLoginMode = true;
    isLoading = false;
    error:string = null;

    constructor(private authService:AuthService,
        private router: Router,
        private viewContainerRef: ViewContainerRef,
        private loggingService: LogginService) {

    }

    ngOnInit(): void {
        this.authService.autologin();
        this.loggingService.printLog('Hello from AppComponent ngOnit');
    }


    ngOnDestroy(): void {
       if(this.closeSub){
        this.closeSub.unsubscribe();
       }
    }

    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(authForm: NgForm){
        if(!authForm.valid) return;
        this.isLoading = true;        
        console.log(authForm.value);

        let authObs: Observable<AuthResponseData>;
        const email = authForm.value.email;
        const password = authForm.value.password;
        if(this.isLoginMode){
           authObs = this.authService
                .login(email, password)
               
        }else{
            authObs = this.authService
            .signUp(email, password);            
        }

        authObs.subscribe({
            next: (responseData) => {
                console.log(responseData);
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            },
            error: (error) =>{
                this.error = error.message;                    
                console.log(error);
                this.showErrorAlert(error.message);
                this.isLoading = false;
            }
        });

        authForm.reset();
    }

    onHandleError(){
        this.error = null;
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