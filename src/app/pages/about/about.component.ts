import { Component, OnInit } from '@angular/core';
import { SEOService } from 'src/app/services/seo.service';
import { Clan } from 'src/app/config/clan.config';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  providers: [SEOService]
})
export class AboutComponent implements OnInit {

  constructor(
    public clan: Clan,
    private seo: SEOService,
    ) { }

  ngOnInit() {
    this.seo.updateTitle('About - ' + this.clan.name);
    this.seo.updateDescription(`Information about PC clan ${this.clan.name}. Learn about the clan, how to get in, and read the FAQ.`);
  }

}
