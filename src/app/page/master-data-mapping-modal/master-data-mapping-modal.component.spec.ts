import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataMappingModalComponent } from './master-data-mapping-modal.component';

describe('MasterDataMappingModalComponent', () => {
  let component: MasterDataMappingModalComponent;
  let fixture: ComponentFixture<MasterDataMappingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDataMappingModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDataMappingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
