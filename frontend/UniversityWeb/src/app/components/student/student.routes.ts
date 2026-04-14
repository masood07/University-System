import { Routes } from "@angular/router";
import { StudentList } from "./student-list/student-list";
import { StudentAdd } from "./student-add/student-add";
import { StudentDetails } from "./student-details/student-details";

export const stdroutes: Routes = [
         {path:"",component:StudentList},
         {path:"add",component:StudentAdd},
         {path:"edit/:id",component:StudentAdd},
         {path:"details/:id",component:StudentDetails},
]
