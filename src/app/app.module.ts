import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GoogleMapsModule } from '@angular/google-maps'

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { AdListComponent } from './ad-list/ad-list.component';

import { DataAnunciosService } from './services/data-anuncios.service';
import { AdListFilterPipe } from './ad-list/ad-list-filter.pipe';
import { AdComponent } from './ad/ad.component';
import { AdFormComponent } from './ad-form/ad-form.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AdListComponent,
    HomeComponent,
    AdListFilterPipe,
    AdComponent,
    AdFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule
  ],
  providers: [DataAnunciosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
