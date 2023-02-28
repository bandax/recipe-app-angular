import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";
import { Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(
        private authService:AuthService, 
        private router: Router,
        private store: Store<fromApp.IAppState>){

    }

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): 
    boolean | Promise<boolean> | Observable<boolean | UrlTree> | UrlTree {
        return this.store.select('auth').pipe(
        take(1), 
        map(authState => {
            return authState.user;
        }),
        map(user => {
            const isAuth =  !!user;
            if(isAuth){
                return true;
            }
            return this.router.createUrlTree(['/auth']);
        }));
    }
}