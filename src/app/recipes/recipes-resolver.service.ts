import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { map, of, switchMap, take } from "rxjs";
import { Recipe } from "./recipe.model";
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';
import { Actions, ofType } from '@ngrx/effects';


@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private store: Store<fromApp.IAppState>,
    private actions$: Actions) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    let recipes;
      return this.store.select('recipes').pipe(
        take(1),
        map(recipesState => {
          return recipesState.recipes;
        }),
        switchMap((recipesSelected: Recipe[]) => {
          //return of(recipesSelected);
          if(recipesSelected.length === 0){
            this.store.dispatch(RecipeActions.fetchRecipes());
            return this.actions$.pipe(
              ofType(RecipeActions.setRecipes),
              take(1)
            );
          }else{
            return of(recipesSelected);
          }
        })
      );
        //return this.dataStorageService.fetchRecipes();
        
   // }
    return recipes; 
      
  }
}