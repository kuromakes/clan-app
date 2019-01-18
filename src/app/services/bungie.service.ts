import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Clan } from 'src/app/config/clan.config';

@Injectable({
  providedIn: 'root'
})
export class BungieService {

  constructor(
    private http: HttpClient,
    private clan: Clan
  ) {}

  private httpOptions = {
    headers: new HttpHeaders().set("X-API-Key", this.clan.apiKey)
  };

  platform = this.clan.platform;

  getClan(groupId: number): any {
    const url = `https://www.bungie.net/platform/groupv2/${groupId}`;
    return this.http.get(url, this.httpOptions);
  }

  getRoster(): any {
    // console.log(`Retrieving roster...`);
    let roster = [];
    // if method called, remove existing cached roster
    sessionStorage.removeItem('roster');
    // loop through all clan IDs specified in clan.config
    for (let i = 0; i < this.clan.clanIds.length; i++) {
      // make a request for the roster of each clan ID
      let req = this.http.get(`https://www.bungie.net/Platform/Groupv2/${this.clan.clanIds[i]}/Members/`, this.httpOptions);
      roster.push(req);
    }
    // send back a joint Observable
    return forkJoin(roster);
  }

  joinRoster(res): any {
    let jointRoster = [];
    let cachedRoster = new Map();
    // loop through all associated clan IDs
    for (let i = 0; i < res.length; i++) {
      const roster = res[i];
      // check for "successful" error
      if (roster.ErrorCode === 1) {
        roster.Response.results.forEach(player => {
          // leave out players who don't have a Bungie account
          if (typeof player.bungieNetUserInfo != 'undefined') {
            // format player into object for easier reference
            const formattedPlayer = {
              name: player.destinyUserInfo.displayName,
              icon: player.bungieNetUserInfo.iconPath,
              bungieId: player.bungieNetUserInfo.membershipId,
              destinyId: player.destinyUserInfo.membershipId,
              memberType: player.memberType,
              joinDate: player.joinDate,
              status: player.isOnline ? 'Online' : 'Offline'
            };
            // push formatted object to joint roster for each player
            jointRoster.push(formattedPlayer);
            // add formatted object to cached roster
            cachedRoster.set(player.destinyUserInfo.membershipId, formattedPlayer);
          } else {
            // player does not have Bungie account
            console.warn(`Unable to retrieve Bungie Profile for ${player.destinyUserInfo.displayName}`);
          }
        });
      } else {
        // error retrieving roster for associated clan ID in loop
        console.error(`There was a problem retrieving clan roster for ID #${this.clan.clanIds[i]}`);
      }
    }
    // cache roster
    sessionStorage.setItem('roster', JSON.stringify(jointRoster));
    // sort roster by who's online before returning
    jointRoster.sort(function(a, b) {
      return (a.status < b.status) ? 1 : ((b.status < a.status) ? -1 : 0);
    });
    // console.log('Joint Roster:', jointRoster);
    return jointRoster;
  }

  // get player stats
 
  getAllStats(destinyId, characterIds): any {
    // console.log('Retrieving player stats...');
    const all = `https://www.bungie.net/platform/destiny2/${this.platform}/account/${destinyId}/character/0/stats/`;
    let stats = [];
    let merged = this.http.get(all, this.httpOptions);
    stats.push(merged);
    for (let i = 0; i < characterIds.length; i++) {
      let url = `https://www.bungie.net/platform/destiny2/${this.platform}/account/${destinyId}/character/${characterIds[i]}/stats/`;
      let req = this.http.get(url, this.httpOptions);
      stats.push(req);
    }
    return forkJoin(stats);
  }

  getAccountHistoricalStats(destinyId): any {
    const url = `https://www.bungie.net/platform/destiny2/${this.platform}/account/${destinyId}/stats/`;
    // console.log(`Retrieving account historical stats...`);
    return this.http.get(url, this.httpOptions);
  }

  // get general account info
  
  getProfile(bungieId): any {
    const url = `https://www.bungie.net/platform/user/getBungieNetUserById/${bungieId}/`;
    // console.log('Retrieving player profile...');
    return this.http.get(url, this.httpOptions);
  }

  getDestinyProfile(destinyId): any {
    const url = `https://www.bungie.net/platform/destiny2/${this.platform}/profile/${destinyId}/?components=100`;
    // console.log('Retrieving Destiny Profile...');
    return this.http.get(url, this.httpOptions);
  }

  getCharacters(destinyId): any {
    const url = `https://www.bungie.net/platform/destiny2/${this.platform}/profile/${destinyId}/?components=200`;
    // console.log('Retrieving player characters...');
    return this.http.get(url, this.httpOptions);
  }

  getClanStats(groupId): any {
    const url = `https://www.bungie.net/platform/destiny2/stats/aggregateclanstats/${groupId}/`;
    return this.http.get(url, this.httpOptions);
  }

  // methods for Google

  getPlayerByName(name): any {
    // const userName = name.replace(/ /g, '%20');
    const userName = name.replace(/#/, '%23');
    const url = `https://www.bungie.net/platform/destiny2/searchdestinyplayer/${this.platform}/${userName}/`;
    return this.http.get(url, this.httpOptions);
  }
  
  getAccountStats(destinyId): any {
    const url = `https://www.bungie.net/platform/destiny2/${this.platform}/account/${destinyId}/character/0/stats/`;
    return this.http.get(url, this.httpOptions);
  }

  // parse Bungie types

  parseStats(stats, characterIds) {
    let parsed: any = {};
    for (let i = 0; i < stats.length; i++) {
      if (i < 1) {
        parsed.all = stats[i].Response;
      } else {
        parsed[characterIds[i - 1]] = stats[i].Response;
      }
    }
    // console.log(`Parsed stats:`, parsed);
    return parsed;
  }

  parseClanRank(n): string {
    return this.clan.ranks[n];
  }

  parsePlatform(code): string {
    switch (code) {
      case 1: return 'Xbox'; break;
      case 2: return 'PSN'; break;
      case 4: return 'Battle.net'; break;
    }
  }

  parseIconUrl(url: string): string {
    if (url.startsWith('/')) {
      return `https://bungie.net/${url}`;
    } else {
      return url;
    }
  }

  parseCharacterClass(code): string {
    let classType;
    switch (code) {
      case 0: classType = 'Titan'; break;
      case 1: classType = 'Hunter'; break;
      case 2: classType = 'Warlock'; break;
      default: classType = 'Unknown';
    }
    return classType;
  }

  parseCharacterRace(code): string {
    let race;
    switch (code) {
      case 0: race = 'Human'; break;
      case 1: race = 'Awoken'; break;
      case 2: race = 'Exo'; break;
    }
    return race;
  }

  parseCharacterGender(code): string {
    let gender;
    switch (code) {
      case 0: gender = 'Male'; break;
      case 1: gender = 'Female'; break;
      default: gender = 'Unknown';
    }
    return gender;
  }

  parseSeconds(seconds): string {
    const hours = Math.floor(seconds/3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds/60);
    let hoursPlayed = '';
    if (typeof hours === 'number' && hours > 0 && hours != Infinity) {
      hoursPlayed += (`${hours}h`);
    }
    if (typeof minutes === 'number' && minutes > 0 && minutes != Infinity) {
      hoursPlayed += (` ${minutes}m`);
    }
    return hoursPlayed;
  }

}
