import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('ingredientForm', {static: false}) ingredientForm: NgForm;
  ingredientToEdit:Ingredient;
  itemEditSubscription: Subscription;
  nameToEdit = '';
  amountToEdit = 0;
  editMode = false;
  editedItem: Ingredient;
  

  constructor(  
    private store: Store<fromApp.IAppState>
    ){    
  }
  
  ngOnInit(): void {
    this.itemEditSubscription = this.store.select('shoppingList').subscribe(stateData => {
      next: {
        if(stateData.editedIngredientIndex > -1){
          this.editMode = true;
          this.editedItem = stateData.editedIngredient;        
          this.ingredientForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          });
        }else{
          this.editMode = false;
        }
      }
    })
    // this.itemEditSubscription = this.shoppingListService.startEditing.subscribe(
    //   (index:number) => {
    //     this.editMode = true;
    //     this.editingItemIndex = index;
    //     this.editedItem = this.shoppingListService.getIngredientByIndex(index);
    //     this.ingredientForm.setValue({
    //       name: this.editedItem.name,
    //       amount: this.editedItem.amount
    //     });
    //   }
    // );
  }

  onSubmit(){  
    const name = this.ingredientForm.value.name; 
    const amount = this.ingredientForm.value.amount;
    const newIngredient = new Ingredient(name, amount);  

    if(this.editMode){
      //this.shoppingListService.updateIngredient(this.editingItemIndex, newIngredient)
      this.store.dispatch(new ShoppingListActions
                        .UpdateIngredient(newIngredient));
    }else{
      // this.shoppingListService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }                
    this.editMode = false;
    this.editedItem = null;
    this.ingredientForm.reset();
  }

  onReset() {
    this.ingredientForm.reset();
    this.editMode = false;
    this.editedItem = null;
    this.store.dispatch(new ShoppingListActions.StopEdit(0));
  }

  onDelete() {    
   //this.shoppingListService.deleteIngredient(this.editingItemIndex);    
   this.store.dispatch(new ShoppingListActions.DeleteIngredient(-1));
    this.onReset();
  }

  ngOnDestroy(): void {
    this.itemEditSubscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit(0));
  }
}
