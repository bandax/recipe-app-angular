import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, Subject, tap, throwError } from "rxjs";
import { User } from "./user.model";

export interface AuthResponseData {
    idToken:string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    kind: string;
    registered?: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    authUser = new BehaviorSubject<User>(null);   
    timerLogout = null; 

    constructor(private http: HttpClient, private router: Router){
        
    }

    signUp(email:string, password:string){
        const payload = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        // Info: https://firebase.google.com/docs/reference/rest/auth#section-create-email-password        
         return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBOvt1oIDtpqRWWqM6PMy2vFW7eiXOJmY0',
            payload)
            .pipe(
                catchError(this.handleError),
                tap(responseData => {
                    this.handleAuthentication(responseData.email, 
                        responseData.localId, 
                        responseData.idToken,
                        +responseData.expiresIn);                                           
                }));            
    }

    private handleAuthentication(email:string, userId:string, token:string, expiresIn:number) {
        const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000))
        const user = new User(email, userId, token, expirationDate);
        this.authUser.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
        this.autoLogout(expiresIn * 1000);
    }

    login(email:string, password: string) {
        const payload = {
            email: email,
            password: password,
            returnSecureToken: true
        }

        // Info: https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password        
        return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBOvt1oIDtpqRWWqM6PMy2vFW7eiXOJmY0',  
                payload)
                .pipe(
                    catchError(this.handleError),
                    tap(responseData => {
                        this.handleAuthentication(responseData.email, 
                            responseData.localId, 
                            responseData.idToken,
                            +responseData.expiresIn);                                                   
                    }));
    }

    logout(){
        this.authUser.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.timerLogout){
            clearTimeout(this.timerLogout);
        }
    }

    private handleError(errorRes: HttpErrorResponse) {
        let error = 'An error ocurred';
        if(!errorRes.error || !errorRes.error.error){
            return throwError(() => new Error(error));
        }
        console.log(errorRes);
        switch(errorRes.error.error.message){
            case 'EMAIL_NOT_FOUND':
                error = 'There is no user record corresponding to this identifier. The user may have been deleted.';
                break;
            case 'INVALID_PASSWORD':
                error = 'The password is invalid or the user does not have a password.';
                break;
            case 'USER_DISABLED':
                error = 'The user account has been disabled by an administrator.';
                break;
            case 'EMAIL_EXISTS':
                error = 'The email address is already in use by another account';
                break;
            case 'OPERATION_NOT_ALLOWED':
                error = 'Password sign-in is disabled for this project';
                break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                error = 'We have blocked all requests from this device due to unusual activity. Try again later.';
                break;
        }               
        return throwError(() => new Error(error));
    }

    autologin(){
        const userData :{
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if(!userData){
            return;
        }
        
        const loadedUser = new User(userData.email, 
            userData.id, 
            userData._token, 
            new Date(userData._tokenExpirationDate) );

        if(loadedUser.token){
            this.authUser.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
        return;
    }

    autoLogout(expirationDuration: number) {
        console.log(expirationDuration);
        this.timerLogout = setTimeout(() => {
            this.logout();
        }, expirationDuration)
    }
}