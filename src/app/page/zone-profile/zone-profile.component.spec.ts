import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneProfileComponent } from './zone-profile.component';

describe('ZoneProfileComponent', () => {
  let component: ZoneProfileComponent;
  let fixture: ComponentFixture<ZoneProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
