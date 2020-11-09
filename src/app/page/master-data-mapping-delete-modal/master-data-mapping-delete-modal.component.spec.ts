import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataMappingDeleteModalComponent } from './master-data-mapping-delete-modal.component';

describe('MasterDataMappingDeleteModalComponent', () => {
  let component: MasterDataMappingDeleteModalComponent;
  let fixture: ComponentFixture<MasterDataMappingDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDataMappingDeleteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDataMappingDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
