import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorMasterDataDeleteModalComponent } from './sensor-master-data-delete-modal.component';

describe('SensorMasterDataDeleteModalComponent', () => {
  let component: SensorMasterDataDeleteModalComponent;
  let fixture: ComponentFixture<SensorMasterDataDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorMasterDataDeleteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorMasterDataDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
