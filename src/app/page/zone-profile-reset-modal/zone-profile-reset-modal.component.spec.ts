import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneProfileResetModalComponent } from './zone-profile-reset-modal.component';

describe('ZoneProfileResetModalComponent', () => {
  let component: ZoneProfileResetModalComponent;
  let fixture: ComponentFixture<ZoneProfileResetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneProfileResetModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneProfileResetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
