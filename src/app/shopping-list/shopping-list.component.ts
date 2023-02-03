import { Component, ElementRef, ContentChild, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { LogginService } from '../logging.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']  
})
export class ShoppingListComponent implements OnInit, OnDestroy{
  ingredients: Ingredient[]=[];
  ingredientedSusbcription: Subscription;
  @ContentChild('nameInput', {static: true}) nameInput: ElementRef;

  constructor(
    private shoppingListService: ShoppingListService,
    private loggingService: LogginService){  
  }

  ngOnInit(){
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientedSusbcription = this.shoppingListService.ingredientsChanged
    .subscribe((ingredients:Ingredient[]) => this.ingredients = ingredients
    );
    this.loggingService.printLog('Hello from ShoppingComponent ngOnit');
  }

  ngOnDestroy(): void {
    this.ingredientedSusbcription.unsubscribe();
  }

  onEditItem(index: number) {
    this.shoppingListService.startEditing.next(index);
  }
 


}
