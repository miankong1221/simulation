import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorMasterDataComponent } from './sensor-master-data.component';

describe('SensorMasterDataComponent', () => {
  let component: SensorMasterDataComponent;
  let fixture: ComponentFixture<SensorMasterDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorMasterDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorMasterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
