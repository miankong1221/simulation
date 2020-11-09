import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorMasterDataModalComponent } from './sensor-master-data-modal.component';

describe('SensorMasterDataModalComponent', () => {
  let component: SensorMasterDataModalComponent;
  let fixture: ComponentFixture<SensorMasterDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorMasterDataModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorMasterDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
