import { Component, OnInit } from '@angular/core';
import { Clan } from 'src/app/config/clan.config';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(
    public clan: Clan,
    private titleService: Title
    ) { }

  ngOnInit() {
    this.titleService.setTitle(this.clan.name);
  }

}
