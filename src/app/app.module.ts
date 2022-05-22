import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps'

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdListComponent } from './ad-list/ad-list.component';
import { DataAnunciosService } from './services/data-anuncios.service';
import { AdListFilterPipe } from './ad-list/ad-list-filter.pipe';
import { AdComponent } from './ad/ad.component';
import { AdFormComponent } from './ad-form/ad-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { NgxCaptchaModule } from 'ngx-captcha';
import { CookieService } from 'ngx-cookie-service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { ProfileComponent } from './profile/profile.component';
import { AdminComponent } from './admin/admin.component';
import { MatTableModule } from '@angular/material/table';
import { AdEditComponent } from './ad-edit/ad-edit.component';
import { DialogoConfirmacionComponent } from './dialogo-confirmacion/dialogo-confirmacion.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UsuariosService } from './services/usuarios.service';
import { DialogEditProfileComponent } from './dialog-edit-profile/dialog-edit-profile.component';
import { FooterComponent } from './footer/footer.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TerminosComponent } from './terminos/terminos.component';
import { CookieComponent } from './cookie/cookie.component';
import { LegalComponent } from './legal/legal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AdListComponent,
    HomeComponent,
    AdListFilterPipe,
    AdComponent,
    AdFormComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    AdminComponent,
    AdEditComponent,
    DialogoConfirmacionComponent,
    DialogEditProfileComponent,
    FooterComponent,
    TerminosComponent,
    CookieComponent,
    LegalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    NgxMatFileInputModule,
    NgxCaptchaModule,
    RecaptchaModule,
    MatTableModule,
    RecaptchaFormsModule,
    MatDialogModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    CloudinaryModule,
    CloudinaryModule.forRoot({Cloudinary}, { cloud_name: 'inmoanuncios' } as CloudinaryConfiguration),
    Ng2SearchPipeModule
  ],
  providers: [
    DataAnunciosService,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
    CookieService,
    UsuariosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
