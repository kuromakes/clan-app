// modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module'
import { BungieService } from './services/bungie.service';

// components
import { AppComponent } from './app.component';
import { HeroComponent } from './hero/hero.component';

// pages
import { HomepageComponent } from './pages/home/home.component';
import { RosterComponent } from './pages/roster/roster.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AboutComponent } from './pages/about/about.component';
import { ApplyComponent } from './pages/apply/apply.component';
import { ClanBioComponent } from './config/clan-bio/clan-bio.component';

// pipes
import { SafePipe } from './pipes/safe.pipe';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    HeroComponent,
    RosterComponent,
    HomepageComponent,
    ProfileComponent,
    AboutComponent,
    ApplyComponent,
    ClanBioComponent,
    SafePipe
  ],
  providers: [BungieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
