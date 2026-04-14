import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { Contactus } from './components/contactus/contactus';
import { Notfound } from './components/notfound/notfound';
import { Login } from './components/Account/login/login';
import { Register } from './components/Account/register/register';
import { Department } from './components/department/department';
import { Course } from './components/course/course';
import { Results } from './components/results/results';
import { canloginGuard } from './guards/canlogin-guard';

export const routes: Routes = [
    {path:"dashboard",component:Home,canActivate:[canloginGuard]},
    {path:"home",component:Home,canActivate:[canloginGuard]},
    {path:"about",component:About,canActivate:[canloginGuard]},
    {path:"contactus",component:Contactus,canActivate:[canloginGuard]},
    {path:"login",component:Login},
    {path:"register",component:Register},
    {path:"departments",component:Department,canActivate:[canloginGuard]},
    {path:"courses",component:Course,canActivate:[canloginGuard]},
    {path:"results",component:Results,canActivate:[canloginGuard]},


    {path:"students",canActivate:[canloginGuard],loadChildren:()=>import("./components/student/student.routes").then(s=>s.stdroutes)},
     //{path:"students/add",component:StudentAdd},
    // {path:"students/details/:id",component:StudentDetails},




    // {path:"students",component:StudentList,children:[
    // {path:"add",component:StudentAdd},
    // {path:"details/:id",component:StudentDetails}]},


    {path:"",redirectTo:"login",pathMatch:"full"},
    {path:"**",component:Notfound}

];
