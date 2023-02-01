import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService{

  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];

  constructor(private shoppingListService: ShoppingListService){

  }


  //private recipes: Recipe[] = [        
      //   new Recipe(      
      //   'Salad', 
      //   'Healthy salad', 
      //   'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg',
      //   [
      //     new Ingredient('Apples', 10),
      //     new Ingredient('Bananas', 5),
      //   ]),
      //   new Recipe(       
      //     'Guacamole', 
      //   'Made by aguacate', 
      //   'https://www.goya.com/media/3968/mexican-guacamole.jpg?quality=80',
      //   [
      //     new Ingredient('Aguacate', 20),
      //     new Ingredient('Lime', 20),
      //   ]),
      //   new Recipe(     
      //     'Pozole', 
      //   'Pork soup', 
      //   'https://i.blogs.es/e5febf/como-hacer-pozole-rojo-de-puerco-receta-de-antojito-mexicano-1-/1366_2000.jpg',
      //   [
      //     new Ingredient('Pork', 10),
      //     new Ingredient('Corn', 4),
      //   ])
      // ];

      setRecipes(recipes: Recipe[]){
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
      }

      getRecipes(){
        return this.recipes.slice();
      }

      getRecipe(index: number){
        return this.recipes[index];
      }

      addIngredientsToShoppingList(ingredients: Ingredient[]){
        this.shoppingListService.addListOfIngredients(ingredients);
      }

      addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
      }

      updateRecipe(index:number, newRecipe:Recipe){
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
      }

      deleteRecipe(index:number){
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
      }
}