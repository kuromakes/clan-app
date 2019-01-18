import { Component, OnInit } from '@angular/core';
import { Clan } from 'src/app/config/clan.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  darkTheme = false;
  mobile: boolean;

  ngOnInit() {
    this.darkTheme = this.checkStorage('darkTheme');
    if (window.screen.width < 600) {
      this.mobile = true;
      // console.log('Mobile device detected')
    } else {
      this.mobile = false;
    }
  }

  constructor(public clan: Clan) {}

  public toggleTheme(): void {
    this.darkTheme = !this.darkTheme;
    if (this.darkTheme) {
      localStorage.darkTheme = this.darkTheme;
      // console.log('Dark theme on');
    } else {
      localStorage.removeItem('darkTheme');
      // console.log('Dark theme off');
    }
  }

  private checkStorage(key): boolean  {
  	// localStorage only supports strings so check for valid value
  	if (typeof localStorage[key] === 'string') {
  		// log what's in storage
  		// console.log('Found key in localStorage: ' + key + ' = ' + localStorage[key]);
  		// update cart item counters across site
  		return JSON.parse(localStorage[key]);
  	} else {
  		// console.log('No existing value for ' + key);
  		return false;
  	}
  }

}
