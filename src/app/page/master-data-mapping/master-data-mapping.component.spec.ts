import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataMappingComponent } from './master-data-mapping.component';

describe('MasterDataMappingComponent', () => {
  let component: MasterDataMappingComponent;
  let fixture: ComponentFixture<MasterDataMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDataMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDataMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
