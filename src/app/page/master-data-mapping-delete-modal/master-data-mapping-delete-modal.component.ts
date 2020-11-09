import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EnvConst } from 'src/app/common/const/env-const';

@Component({
  selector: 'app-master-data-mapping-delete-modal',
  templateUrl: './master-data-mapping-delete-modal.component.html',
  styleUrls: ['./master-data-mapping-delete-modal.component.scss']
})
export class MasterDataMappingDeleteModalComponent implements OnInit {

  deletedWarehouseId: any;
  deletedZone: any;
  deletedSensor: any;

  constructor(
    public bsModalRef: BsModalRef,
    public http: HttpClient,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {

    if (this.modalService.config.initialState) {
      this.deletedWarehouseId = this.modalService.config.initialState[0];
      this.deletedZone = this.modalService.config.initialState[1];
      this.deletedSensor = this.modalService.config.initialState[2];
    }
  }

  hide(): void{
    this.bsModalRef.hide();
    console.log('hide');
  }

  cancel(): void{
    this.bsModalRef.hide();
  }

  confirm(): void{
    const url = EnvConst.DevExtentionConst.API_ROOT  + '/wms-extension/api/v1/equipment/master/warehouses/' + this.deletedWarehouseId + '/zones/' + this.deletedZone + '/sensors/' + this.deletedSensor;
    this.http.delete(url).subscribe(() => {
      this.bsModalRef.content.value = this.deletedSensor;
    });
    this.bsModalRef.hide();
  }

}
