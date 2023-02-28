import { createReducer, on} from '@ngrx/store';
import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions';


export interface IState{
    recipes: Recipe[];
}

const initialState: IState = {
    recipes: []
}

export const recipeReducer = createReducer(
    initialState,
    on(RecipeActions.setRecipes, (state, {recipes}) => ({        
        ...state,
        recipes: [...recipes]
    })),
    on(RecipeActions.addRecipe, (state, recipe) => ({
        ...state,
        recipes: [...state.recipes, recipe]
    })),
    on(RecipeActions.updateRecipe, (state, action) => {
        const updatedRecipe = {
            ...state.recipes[action.index],
            ...action.newRecipe
        };

        const updatedRecipes = [...state.recipes];
        updatedRecipes[action.index] = updatedRecipe;

        return {
            ...state,
            recipes: updatedRecipes
        }
    }),
    on(RecipeActions.deleteRecipe, (state, action) => ({
        ...state,
        recipes: state.recipes.filter((recipe, index) => {
            return index !== action.index;
        })
    }))
);