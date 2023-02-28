import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActionType, Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {

    urlServer = 'https://ng-course-recipe-book-f8b4c-default-rtdb.firebaseio.com/recipes.json'

    fetchRecipes = createEffect(() =>
        this.actions$.pipe(
                ofType(RecipeActions.fetchRecipes),
                switchMap((action: ActionType<typeof RecipeActions.fetchRecipes>) => {
                    return this.http
                    .get<Recipe[]>(this.urlServer)
                    .pipe(
                        map(recipes => {
                            const newRecipes = recipes.map(recipe => {
                                return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
                            });
                            return RecipeActions.setRecipes({recipes: newRecipes});
                        }),
                        catchError(errorRes => {
                            return [RecipeActions.getRecipesFailed({errorMessage: errorRes.message})];
                        })
                    )

                })              
        ) //end of pipe
    )

    storeRecipes = createEffect(() => 
        this.actions$.pipe(
            ofType(RecipeActions.storeRecipes),
            withLatestFrom(this.store.select('recipes')),
            switchMap(([action, recipesState]) => {
                return this.http
                .put(this.urlServer, recipesState.recipes)               
            })
        ), {dispatch: false} //end of pipe
    );


    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.IAppState>){

    }
}