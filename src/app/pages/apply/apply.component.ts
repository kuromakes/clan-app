import { Component, OnInit } from '@angular/core';
import { BungieService } from 'src/app/services/bungie.service';
import { GoogleService } from 'src/app/services/google.service';
import { Clan } from 'src/app/config/clan.config';
import { SEOService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss'],
  providers: [BungieService, GoogleService, SEOService]
})
export class ApplyComponent implements OnInit {

  playerName: string;
  discordName: string;
  referral: string;
  sending = false;
  applicationStatus = '';
  age = false;

  constructor(
    public bungieService: BungieService,
    private googleService: GoogleService,
    public clan: Clan,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.seo.updateTitle('Apply - ' + this.clan.name);
    this.seo.updateDescription(`Apply to join the ranks of ${this.clan.name}`);
  }

  public getUsername(event: any): void {
    this.playerName = event.target.value;
  }

  public getDiscordName(event: any): void {
    this.discordName = event.target.value;
  }

  public getReferral(event: any): void {
    this.referral = event.target.value;
  }

  public apply(): void {
    if (this.age) {
      // disable repeat submissions by setting 'sending' to true
      this.sending = true;
      this.applicationStatus = 'Sending...';
      // create reference to 'this' to be accessed from nested scopes
      const _this = this;
      const bungie = this.bungieService;
      const google = this.googleService;
      // check for empty fields
      if (this.playerName != '' && this.discordName != '') {
        // check discord name at least a little
        if (this.checkDiscordName(this.discordName)) {
          // look up player by name
          bungie.getPlayerByName(this.playerName).subscribe(player => {

            if (player.ErrorCode === 1 && player.Response.length > 0) {

              // console.log('Retrieving player info...');
              // console.log('Bungie server response:', player);

              const destinyId = player.Response[0].membershipId;
              // retreive account stats
              bungie.getAccountStats(destinyId).subscribe(stats => {

                if (stats.ErrorCode === 1) {
                  // console.log('Retrieving player stats...');
                  // console.log('Bungie server response:', stats);
                  // categories
                  const pvp = stats.Response.allPvP.allTime;
                  const raid = stats.Response.raid.allTime;
                  // stat values
                  // check for falsy values before sending to Google
                  const pvpKd = () => pvp ? pvp.killsDeathsRatio.basic.displayValue : 'No PvP stats';
                  const pvpKda = () => pvp ? pvp.killsDeathsAssists.basic.displayValue : 'No PvP stats';
                  const pvpKad = () => pvp ? pvp.efficiency.basic.displayValue : 'No PvP stats';
                  const pvpKills = () => pvp ? pvp.kills.basic.displayValue : 'No PvP stats';
                  const raidClears = () => raid ? raid.activitiesCleared.basic.displayValue : 'No raid stats';

                  // format object
                  const application = {
                    'Gamertag': this.playerName,
                    'Discord': this.discordName,
                    'PvP KD': pvpKd(),
                    'PvP KDA': pvpKda(),
                    'PvP KAD': pvpKad(),
                    'PvP Kills': pvpKills(),
                    'Raid Clears': raidClears(),
                    'Referred By': this.referral ? this.referral : '',
                    'Applied': new Date().toLocaleString()
                  }

                  // send to Google Sheets
                  google.sendApplication(application, function (response) {
                    // console.log('Google sheets response:', response);
                    if (response.result === 'success') {
                      _this.applicationStatus = 'Success!';
                      alert('Success! Your application has been received, and clan admins will be in touch via Discord if your application is approved.');
                    } else {
                      _this.sending = false; // only reenable submissions if unsuccessful
                      _this.applicationStatus = 'Error sending application';
                      alert('Uh oh, there was a problem sending your application to our database. Please try again, and if the problem persists, contact ' + this.clan.contact + ' on Discord.');
                    }
                  });

                } else {
                  console.error('Bungie server response:', stats);
                  alert('There was a problem getting your data from Bungie.\n' + stats.ErrorStatus + ': ' + stats.Message);
                  this.sending = false;
                  this.applicationStatus = 'Error sending application';
                }

              });

            }

          }, err => {
            console.error('Could not connect to Bungie servers');
            alert('There was a problem connecting to the Bungie database. Check to see if Bungie is performing maintenance, and please try again. If the error persists, please contact ' + this.clan.contact + ' on Discord');
            this.sending = false;
            this.applicationStatus = 'Error sending application';
          });

        } else {

          console.error('Invalid Discord username syntax detected');
          alert('Please enter a valid Discord username. Make sure your name is formatted correctly (e.g. - name#0001).');
          this.sending = false;
          this.applicationStatus = 'Error sending application';

        }

      } else {

        console.error('Required fields missing');
        alert(bungie.parsePlatform(this.clan.platform) + ' and Discord usernames required.');
        this.sending = false;
        this.applicationStatus = 'Error sending application';

      }
    } else {
      alert(`Sorry, but you must be 18 years old or older to join ${this.clan.name}.`);
    }

  }

  private checkDiscordName(name: string): boolean {
    const regexp = /^[^#]{2,32}#\d{4}$/;
    return regexp.test(name);
  }

}
