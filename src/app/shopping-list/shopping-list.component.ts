import { Component, ElementRef, ContentChild, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']  
})
export class ShoppingListComponent implements OnInit, OnDestroy{
  ingredients: Observable<{ingredients: Ingredient[]}>;
  ingredientedSusbcription: Subscription;
  @ContentChild('nameInput', {static: true}) nameInput: ElementRef;

  constructor(    
    private store: Store<fromApp.IAppState>
    ){  
  }

  ngOnInit(){
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.ingredientedSusbcription = this.shoppingListService.ingredientsChanged
    // .subscribe((ingredients:Ingredient[]) => this.ingredients = ingredients
    // );
    //this.loggingService.printLog('Hello from ShoppingComponent ngOnit');
  }

  ngOnDestroy(): void {
    //this.ingredientedSusbcription.unsubscribe();
  }

  onEditItem(index: number) {
    //this.shoppingListService.startEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
 


}
