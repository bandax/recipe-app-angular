import { HttpClient } from '@angular/common/http';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { ActionType } from '@ngrx/store';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    kind: string;
    registered?: string;
    type: string
}

const handleAuthentication = (resData) => {
    const expirationDate = new Date(new Date().getTime() + (+resData.expiresIn * 1000));
    const user: User = new User(
        resData.email,
        resData.localId,
        resData.idToken,
        expirationDate
    )

    localStorage.setItem('userData', JSON.stringify(user));
    return AuthActions.loginSuccess({ 
        email: resData.email,
        userId: resData.localId,
        token: resData.idToken,
        expirationDate: expirationDate,
        redirect: true
     })
}

const handleError = (errorRes) => {
    let error = 'An error ocurred';
    if (!errorRes.error || !errorRes.error.error) {
        return [AuthActions.loginFail(errorRes.message)];
    }
    switch (errorRes.error.error.message) {
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
    return [AuthActions.loginFail({ errorMessage: error })];
}

@Injectable()
export class AuthEffects {

    authSignup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.signUpStart),
            switchMap((action: ActionType<typeof AuthActions.signUpStart>) => {
                return this.http.post<AuthResponseData>(
                    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey,
                    {
                        email: action.loginData.email,
                        password: action.loginData.password,
                        returnSecureToken: true
                    })                   
                    .pipe(
                        tap((resData) =>{
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                        }),
                        map(resData => {
                          return handleAuthentication(resData);
                        }),
                        catchError(errorRes => {
                            return handleError(errorRes);
                        }),
                    )
            })
        ) // end of pipe
    );

    authLogin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.loginStart),
            switchMap((action: ActionType<typeof AuthActions.loginStart>) => {
                return this.http.post<AuthResponseData>(
                    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey,
                    {
                        email: action.loginData.email,
                        password: action.loginData.password,
                        returnSecureToken: true
                    })
                    .pipe(
                        tap((resData) =>{
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                        }),
                        map(resData => {
                            return handleAuthentication(resData);
                          }),
                          catchError(errorRes => {
                              return handleError(errorRes);
                          }),
                    )
            })
        )
    )

    authRedirect$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.loginSuccess),
            tap((action: ActionType<typeof AuthActions.loginSuccess>) => {
                if(action.redirect){
                    this.router.navigate(['/']);
                }
            })
        ), { dispatch: false }// end pipe
    )

    authLogout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logout),
            tap(() => {
                localStorage.removeItem('userData');
                this.authService.clearLogoutTimer();
                this.router.navigate(['/auth']);
            })
        ), {dispatch: false} //end of pipe
    );

    authAutologin$ = createEffect(() => 
            this.actions$.pipe(
               ofType(AuthActions.autoLogin),
               map(() => {
                const userData :{
                    email: string;
                    id: string;
                    _token: string;
                    _tokenExpirationDate: string;
                } = JSON.parse(localStorage.getItem('userData'));
        
                if(!userData){
                    return {type: 'NO TOKEN'};
                }
                
                const loadedUser = new User(userData.email, 
                    userData.id, 
                    userData._token, 
                    new Date(userData._tokenExpirationDate) );
        
                if(loadedUser.token){
                    //this.authUser.next(loadedUser);   
                    const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                    this.authService.setLogoutTimer(expirationDuration);                   
                    //const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000))
                    //const user = new User(email, userId, token, expirationDate);
                    return AuthActions.loginSuccess({
                        email: userData.email,
                        userId: userData.id,
                        expirationDate: new Date(userData._tokenExpirationDate),
                        token: userData._token,
                        redirect: false
                    });
                    //this.autoLogout(expirationDuration);
                }
                return {type: 'NO TOKEN'};
               })
            ) //end of pipe
    );


    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) {

    }

}