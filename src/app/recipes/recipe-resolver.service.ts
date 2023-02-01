import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { RecipeService } from "./recipe.service";

interface Recipe {
    name: string;
    description: string;
    imagePath: string;   
    ingredients: Ingredient[]; 
}

@Injectable()
export class RecipeResolver implements Resolve<Recipe> {
    constructor(private recipeService: RecipeService){

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
    Observable<Recipe> | Promise<Recipe> | Recipe {
        return this.recipeService.getRecipe(+route.params['id']);
    }
}
