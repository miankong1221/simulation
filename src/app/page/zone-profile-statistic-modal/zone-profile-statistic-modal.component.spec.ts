import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneProfileStatisticModalComponent } from './zone-profile-statistic-modal.component';

describe('ZoneProfileStatisticModalComponent', () => {
  let component: ZoneProfileStatisticModalComponent;
  let fixture: ComponentFixture<ZoneProfileStatisticModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneProfileStatisticModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneProfileStatisticModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
