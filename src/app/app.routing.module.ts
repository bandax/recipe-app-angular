import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
import { RecipeResolver } from "./recipes/recipe-resolver.service";
import { RecipeStartComponent } from "./recipes/recipe-start/recipe-start.component";
import { RecipesResolverService } from "./recipes/recipes-resolver.service";
import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";

const appRoutes: Routes = [
    {path: '', redirectTo: '/recipes', pathMatch: 'full'},
    {path: 'recipes', 
        component: RecipesComponent, 
        canActivate: [AuthGuard],
        children:[
            {path: '', component: RecipeStartComponent },
            {path: 'new', component: RecipeEditComponent},   
            //{path: ':id', component: RecipeDetailComponent, resolve: {recipe: RecipeResolver}},   //Resolver is causing issues generating another instance of service
            {path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService]},  // Make sure data exist before execute this component
            //{path: ':id', component: RecipeDetailComponent},        
            {path: ':id/edit', component: RecipeEditComponent} 
    ] },
    {path: 'shopping-list', component: ShoppingListComponent},
    {path: 'auth', component: AuthComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {

}