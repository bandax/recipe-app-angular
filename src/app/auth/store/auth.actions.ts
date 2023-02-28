import { Action } from '@ngrx/store';
import {createAction, props} from '@ngrx/store';
import { User } from '../user.model';

 
export interface UserLogged {    
    email: string,
    userId: string,
    token: string,
    expirationDate: Date;
    redirect: boolean              
}

export interface CustomAction extends Action {
    type: string;
    payload?: any;
    }

export interface LoginData {    
    email: string,
    password: string,    
}

export const login = createAction('[Auth] Login', props<{user: User}>());
export const logout = createAction('[Auth] Logout');
export const loginStart = createAction('[Auth] Login Start', props<{loginData: LoginData}>());
export const loginSuccess = createAction('[Auth] Login Success', props<UserLogged>());
export const loginFail = createAction('[Auth] Login Fail', props<{errorMessage: string}>());
export const loginError = createAction('[Auth] Login Error');
export const signUpStart = createAction('[Auth] Signup Start', props<{loginData: LoginData}>());
export const clearError = createAction('[Auth] Clear Error');
export const autoLogin = createAction('[Auth] Autologin');
