import { Component } from "@angular/core"
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthResponseData, AuthService } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error:string = null;

    constructor(private authService:AuthService,
        private router: Router) {

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
            error: (errorMessage) =>{
                this.error = errorMessage;                    
                console.log(errorMessage);
                this.isLoading = false;
            }
        });

        authForm.reset();
    }
}