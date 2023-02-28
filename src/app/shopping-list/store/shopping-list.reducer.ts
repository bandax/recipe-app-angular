import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface IState {
    ingredients: Ingredient[],
    editedIngredient: Ingredient,
    editedIngredientIndex: number
}


export interface IAppState {
    shoppingList: IState
}


const initialState: IState = {
    ingredients: [
        new Ingredient('Apples', 10),
        new Ingredient('Bananas', 5),
      ],
    editedIngredient: null,
    editedIngredientIndex: -1
}

export function  shoppingListReducer(
    state: IState = initialState, 
    action: ShoppingListActions.ShoppingListActions
    ){
    switch(action.type){
        case ShoppingListActions.ADD_INGREDIENT:            
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload as Ingredient]
            }
            break;
        case ShoppingListActions.ADD_INGREDIENTS:            
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload as Ingredient[]]
            }
            break;
        case ShoppingListActions.UPDATE_INGREDIENT:                     
            const ingredient = state.ingredients[state.editedIngredientIndex];
            const updatedIngredient = {
                ...ingredient,
                ...action.payload as Ingredient
            };
            const updatedIngredients  = [...state.ingredients];
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredientIndex: -1,
                editedIngredient: null
            }
            break;            
        case ShoppingListActions.DELETE_INGREDIENT:   
            return{
                ...state,
                ingredients: state.ingredients.filter((element, index) => {
                    return index !== state.editedIngredientIndex;
                }),
                editedIngredientIndex: -1,
                editedIngredient: null
            }         
            break;
            case ShoppingListActions.START_EDIT:
                return {
                    ...state,
                    editedIngredientIndex: action.payload as number,
                    editedIngredient: {...state.ingredients[action.payload as number]}
                }
                break;
            case ShoppingListActions.STOP_EDIT:
                return {
                    ...state,
                    editedIngredientIndex: -1,
                    editedIngredient: null
                }
                break;
        default:
            return state;
            break;
    }
}