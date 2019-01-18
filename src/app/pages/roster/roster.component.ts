import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BungieService } from 'src/app/services/bungie.service';
import { Clan } from 'src/app/config/clan.config';
import { SEOService } from 'src/app/services/seo.service';

export interface Member {
  name: string;
  icon: string;
  destinyId: string;
  memberType: string;
  joinDate: string;
  status: string;
}

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss'],
  providers: [BungieService, SEOService]
})

export class RosterComponent implements OnInit {

  players;

  displayedColumns: string[] = ['icon', 'name', 'joined', 'status', 'profile'];
  dataSource: MatTableDataSource<Member>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public bungie: BungieService,
    public clan: Clan,
    private seo: SEOService
    ) { }

  ngOnInit() {
    // set page title
    this.seo.updateTitle('Roster - ' + this.clan.name);
    this.seo.updateDescription(`Full clan roster for Destiny 2 Clan ${this.clan.name}`);
    // get roster from Bungie API
    this.bungie.getRoster().subscribe(response => {
      if (response.length != this.clan.clanIds.length) {
        alert('Looks like we weren\'t able to load the entire roster. Bungie may be experiencing high server traffic, or there could be a configuration issue. Please try again, and if the issue persists, contact clan leadership.');
      }
      this.players = this.bungie.joinRoster(response);
      this.dataSource = new MatTableDataSource(this.players);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      console.error(err);
      alert('Uh oh, there was an error retrieving the clan roster. Bungie\'s servers may be down for maintenance.');
    });
  }

  // public methods

  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
