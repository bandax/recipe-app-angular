import { User } from "../user.model";
import * as AuthActions from "./auth.actions";
import {createReducer, on} from '@ngrx/store';



export interface UserLogged {    
    email: string,
    userId: string,
    token: string,
    expirationDate: Date;
    redirect: boolean              
}

export interface IState {
    user: UserLogged,
    authError: string,
    loading: boolean
}

const initialState: IState = {
    user: null,
    authError: null,
    loading: false
}


export const authReducer = createReducer(
    initialState,
    on(AuthActions.loginSuccess, (state, user) => {    
      return {
        ...state,
        user,
        authError: null,
        loading: false  
      }
    }),
    on(AuthActions.logout, (state) => ({
        ...state,
        user: null,
        authError: null,
        loading: false     
    })),
    on(AuthActions.loginStart, (state) => ({
        ...state,
        authError: null,
        loading: true     
    })),
    on(AuthActions.signUpStart, (state) => ({
        ...state,
        authError: null,
        loading: true     
    })),
    on(AuthActions.loginFail, (state, {errorMessage}) => ({
        ...state,
        user: null,
        authError: errorMessage,
        loading: false      
    })),
    on(AuthActions.clearError, (state) => ({        
        ...state,        
        authError: null    
    })),    
  );
