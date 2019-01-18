import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { Clan } from 'src/app/config/clan.config';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  googleResponse: object;

  constructor(private clan: Clan) { }

  sendApplication(player, callback) {
    
    console.log('Application received in Google Service:', player);
    $.ajax({
      url: 'https://script.google.com/macros/s/' + this.clan.googleKey + '/exec',
      method: 'GET',
      data: player,
      dataType: 'json',
      success: callback
    });
  }

}
