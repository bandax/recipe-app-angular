import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { LogginService } from "../logging.service";
import { SharedModule } from "../shared/shared.module";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { ShoppingListRoutingModule } from "./shopping-list.routing.module";

@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent,    
    ], 
    imports: [
        RouterModule,        
        FormsModule,        
        ShoppingListRoutingModule,    
        SharedModule
    ],
    // This will create a separate service instance different that used from app.module
    //providers: [LogginService] // load this service in a lazy loading module
})
export class ShoppingListModule{

}