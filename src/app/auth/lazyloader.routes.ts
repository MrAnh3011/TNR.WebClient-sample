import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AuthGuard } from '../guards/auth-guard.service'
import { LoginComponent } from '../login/login.component';
import { DashboardCrmComponent } from '../dashboard-crm/dashboard-crm.component';
import { MaintainComponent } from '../maintain/maintain.component';
import { MenuComponent } from '../menu/menu.component';

export const appRoutes: Routes = [{
    path: '', component: AuthComponent, children: [
        { path: 'dashboard', component: DashboardCrmComponent, canActivate: [AuthGuard] },
        { path: 'search/:funcSign', loadChildren: '../search/search.module#SearchModule', canActivate: [AuthGuard] },
        { path: 'maintain/:funcSign', component: MaintainComponent, canActivate: [AuthGuard] },
        { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    ]
}];