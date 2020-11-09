import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneProfileModalComponent } from './zone-profile-modal.component';

describe('ZoneProfileModalComponent', () => {
  let component: ZoneProfileModalComponent;
  let fixture: ComponentFixture<ZoneProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneProfileModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
