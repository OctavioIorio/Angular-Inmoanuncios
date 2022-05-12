import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdListComponent } from './ad-list/ad-list.component';
import { AdComponent } from './ad/ad.component';
import { HomeComponent } from './home/home.component';
import { AdFormComponent } from './ad-form/ad-form.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  // { path: 'ad-list', component: AdListComponent },
  { path: 'ad-list/:mun_id', component: AdListComponent },
  // { path: 'ad-form', component: AdFormComponent },
  { path: 'ad/:id', component: AdComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'admin', component: AdminComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
