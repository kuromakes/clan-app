import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import pages
import { HomepageComponent } from './pages/home/home.component';
import { RosterComponent } from './pages/roster/roster.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AboutComponent } from './pages/about/about.component';
import { ApplyComponent } from './pages/apply/apply.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomepageComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'roster',
    component: RosterComponent
  },
  {
    path: 'roster/:bungieId/:destinyId',
    component: ProfileComponent
  },
  {
    path: 'apply',
    component: ApplyComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
