import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClanBioComponent } from './clan-bio.component';

describe('ClanBioComponent', () => {
  let component: ClanBioComponent;
  let fixture: ComponentFixture<ClanBioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClanBioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClanBioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
