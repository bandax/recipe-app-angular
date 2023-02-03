import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { DropdownDirective } from './dropdown.directive';
import { CommonModule } from "@angular/common";
import { LogginService } from "../logging.service";

@NgModule({
    declarations: [
        AlertComponent,
        LoadingSpinnerComponent,
        DropdownDirective
    ],
    imports: [
        CommonModule
    ],
    exports:[
        AlertComponent,
        LoadingSpinnerComponent,
        DropdownDirective,
        CommonModule
    ],    
    // because this could be shared by different modules whis will create separates 
    // instace of the service
    // providers: [LogginService] 
})
export class SharedModule{

}