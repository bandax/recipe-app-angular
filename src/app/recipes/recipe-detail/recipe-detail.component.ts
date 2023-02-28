import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params, Route, Router } from '@angular/router';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs/operators';
import * as RecipeActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.IAppState>) {
    
  }

  ngOnInit() {
    // this.route.data.subscribe(
    //   (data: Data) => {
    //     this.recipe = data['recipe'];
    //   }
    // );

    this.route.params.pipe(map(params => {
      return +params['id'];
    }),
    switchMap(id => {
      this.id = id;
      return this.store.select('recipes');
    }),
    map(recipeState => {
      return recipeState.recipes.find((recipe, index) =>{
        return index === this.id;
      })
    }))
    .subscribe(recipe => {
          this.recipe = recipe;
     })
  }

  onAddToShoppingList(){
    //this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  onEdit(){
    this.router.navigate(['edit'],{relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

  onDelete() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(RecipeActions.deleteRecipe({index: this.id}));
    this.router.navigate(['../'], {relativeTo: this.route});    
  }

}
