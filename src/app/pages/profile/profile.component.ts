import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BungieService } from 'src/app/services/bungie.service';
import { Clan } from 'src/app/config/clan.config';
import { SEOService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [SEOService]
})

export class ProfileComponent implements OnInit {

  allStats;
  characters;
  characterIds = [];
  destinyProfile;
  failedToLoadStats = false;
  hoursPlayed;
  metaData;
  parsedStats;
  playerName;
  profileData;
  profileStats;
  selectedCharacter = 'all';
  selectedCharactersData = [];
  selectedStats;

  constructor(
    public bungieService: BungieService,
    private route: ActivatedRoute,
    public clan: Clan,
    private seo: SEOService
    ) {
  }

  ngOnInit() {
    const routeParams = this.route.snapshot.params;
    const bungie = this.bungieService;

    // get profile
    bungie.getProfile(routeParams.bungieId).subscribe(data => {
      // check for successful response
      if (data.ErrorCode === 1) {
        // set component data
        this.profileData = data.Response;
        // look for player name property key based on gaming platform
        switch (this.clan.platform) {
          case 1: this.playerName = this.profileData.xboxDisplayName; break;
          case 2: this.playerName = this.profileData.psnDisplayName; break;
          case 4: this.playerName = this.profileData.blizzardDisplayName; break;
          default: this.playerName = 'ERROR';
        }
        // set page metadata
        this.seo.updateTitle(this.playerName + ' - ' + this.clan.name);
        this.seo.updateDescription(`Player information and statistics for ${this.playerName}`);
      } else {
        // handle error
        console.error('Error retrieving profile: ' + data.Message);
        alert('There was an error retrieving Bungie profile. Bungie response: ' + data.Message);
      }
      // console.log('Player profile data:', this.profileData);
    }, err => {
      console.error(err);
      alert('Uh oh, there was an error retrieving the Bungie profile. Bungie\'s servers may be down for maintenance.');
    });

    // get characters
    bungie.getCharacters(routeParams.destinyId).subscribe(data => {
      // check server response
      if (data.ErrorCode === 1) {
        // set component data
        this.characters = data.Response.characters.data;
        // console.log('Characters:', this.characters);
        // immediately update character data
        this.getCharacterInfo('all');
        // store IDs for all characters
        for (let character in this.characters) {
          this.characterIds.push(character);
        }
        // now that we have characters, get stats for all of them
        bungie.getAllStats(routeParams.destinyId, this.characterIds).subscribe(data2 => {
          // set component data
          this.allStats = data2;
          // console.log('Successfully loaded all character stats: ', this.allStats);
          // update selected stats so page loads with "all" stats by default
          this.selectedStats = this.allStats[0].Response;
          this.parsedStats = bungie.parseStats(this.allStats, this.characterIds);
        }, function(err) {
          console.error(err);
          alert('Uh oh, there was an error retrieving player stats. Bungie\'s servers may be down for maintenance.');
          this.failedToLoadStats = true;
        });

        // get hours played
        bungie.getAccountHistoricalStats(routeParams.destinyId).subscribe(accountStats => {
          if (accountStats.ErrorCode === 1) {
            // console.log('Account Historical Stats:', accountStats.Response);
            this.hoursPlayed = Math.floor((accountStats.Response.mergedAllCharacters.merged.allTime.secondsPlayed.basic.value)/3600);
          } else {
            console.error(`There was a problem retrieving hours played:`, accountStats.Message);
          }
        });

      } else {
        this.failedToLoadStats = true;
        console.error('Error retrieving characters: ' + data.Message);
        alert('There was an error retrieving character data. Bungie response: ' + data.Message);
      }
    });

    // get player clan info

    // check if stored in browser first
    if (sessionStorage.getItem('roster')) {
      // convert cached string value -> JSON -> map
      let cachedRoster = JSON.parse(sessionStorage.getItem('roster'));
      cachedRoster = new Map(cachedRoster.map(member => [member.destinyId, member]));
      // set component data
      this.metaData = cachedRoster.get(routeParams.destinyId);
      // console.log('metadata', this.metaData);
      // console.log('Clan rank:', this.clan.ranks[this.metaData.memberType]);
    } else { // if no cached data (user navigated direct to profile or refreshed profile page)
      // get roster from Bungie
      bungie.getRoster().subscribe(data => {
        let roster = bungie.joinRoster(data);
        roster = new Map(roster.map(member => [member.destinyId, member]));
        this.metaData = roster.get(routeParams.destinyId);
        // console.log('metadata', this.metaData);
        // console.log('Clan rank:', this.clan.ranks[this.metaData.memberType]);
      });
    }

    bungie.getDestinyProfile(routeParams.destinyId).subscribe(data => {
      // check server response first
      if (data.ErrorCode === 1) {
        // set component data
        this.destinyProfile = data.Response.profile.data;
        // console.log('Destiny Profile:', this.destinyProfile);
      } else {
        console.error('There was a problem retrieving Destiny Profile:', data.Message);
        alert(`There was a problem retrieving Destiny Profile: ${data.Message}`);
      }
    }, err => {
      console.error(err);
      alert('Uh oh, there was an error retrieving the Destiny profile. Bungie\'s servers may be down for maintenance.');
    });
    
  }

  // private methods
  private getCharacterStats(characterId): void {
    this.selectedStats = this.parsedStats[characterId];
    // console.log('Selected Stats:', this.selectedStats);
  }

  private getCharacterInfo(characterId): void {
    let selectedCharacters = [];
    if (characterId === 'all') {
      for (let character in this.characters) {
        selectedCharacters.push(this.characters[character]);
      }
    } else {
      selectedCharacters.push(this.characters[characterId]);
    }
    // console.log('Selected character(s)', selectedCharacters);
    this.selectedCharactersData = selectedCharacters;
  }

  // public methods
  public selectCharacter(characterId): void {
    this.getCharacterStats(characterId);
    this.getCharacterInfo(characterId);
  }

  public getCharacterProperty(characterId, property): string {
    return this.characters[characterId][property];
  }

}
