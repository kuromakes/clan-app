import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {

  @Input() title: string;
  @Input() subtitle: string;
  @Input() bannerUrl: string;
  @Input() backgroundImage: Object;
  @Input() fullscreen = false;

  constructor() { }

  ngOnInit() {
    this.backgroundImage = {
      'background-image': 'url("' + this.bannerUrl + '")'
    }
  }

}
