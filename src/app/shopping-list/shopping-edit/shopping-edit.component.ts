import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

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
  editingItemIndex = 0;
  editedItem: Ingredient;
  

  constructor(private shoppingListService: ShoppingListService){    
  }
  
  ngOnInit(): void {
    this.itemEditSubscription = this.shoppingListService.startEditing.subscribe(
      (index:number) => {
        this.editMode = true;
        this.editingItemIndex = index;
        this.editedItem = this.shoppingListService.getIngredientByIndex(index);
        this.ingredientForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  onSubmit(){  
    const name = this.ingredientForm.value.name; 
    const amount = this.ingredientForm.value.amount;
    const newIngredient = new Ingredient(name, amount);  

    if(this.editMode){
      this.shoppingListService.updateIngredient(this.editingItemIndex, newIngredient)
    }else{
      this.shoppingListService.addIngredient(newIngredient);
    }                
    this.editMode = false;
    this.editedItem = null;
    this.ingredientForm.reset();
  }

  onReset() {
    this.ingredientForm.reset();
    this.editMode = false;
    this.editedItem = null;
  }

  onDelete() {    
    this.shoppingListService.deleteIngredient(this.editingItemIndex);    
    this.onReset();
  }

  ngOnDestroy(): void {
    this.itemEditSubscription.unsubscribe();
  }
}
