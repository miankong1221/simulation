import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ObjectUtils } from 'src/app/common/utils/object.utils';
import { MasterDataMappingDeleteModalComponent } from '../master-data-mapping-delete-modal/master-data-mapping-delete-modal.component';

import { MasterDataMappingModalComponent } from '../master-data-mapping-modal/master-data-mapping-modal.component';
import { SensorDetail, WarehouseMaster } from './entity/masterDataEntity';
import { MasterDataMappingService } from './service/master-data-mapping-service';
declare var $: any;

@Component({
  selector: 'app-master-data-mapping',
  templateUrl: './master-data-mapping.component.html',
  styleUrls: ['./master-data-mapping.component.scss']
})
export class MasterDataMappingComponent implements OnInit {

  modalRef: BsModalRef;

  sensorDetailView: SensorDetail[];

  isZoneDisable: boolean;

  isAddDisable: boolean;

  warehouseList: WarehouseMaster[];

  zoneList: any[];

  selectedWarehouse: string;

  selectedZone: string;

  selectedWarehouseId: string;

  isAddHidden: boolean;

  constructor(
    public http: HttpClient,
    private service: MasterDataMappingService,
    private modalService: BsModalService
  ) {
    this.sensorDetailView = [];
    this.warehouseList = [];
    this.zoneList = [];
    this.isAddHidden = false;
  }

  ngOnInit(): void {
    $('.selectWarehouse').select2({
      theme: 'bootstrap4',
    });
    $('.selectZone').select2({
      theme: 'bootstrap4',
    });
    this.isZoneDisable = true;
    this.isAddDisable = true;

    this.service.getWarehouse();

    this.registerEvent();

    $('.selectWarehouse').change((event) => {
      if (event.target.value) {
        this.isZoneDisable = false;
        this.selectedWarehouse = event.target.value;
        this.warehouseList.forEach((temp) => {
          if (temp.whName === this.selectedWarehouse) {
            this.selectedWarehouseId = temp.whId;
          }
        });
        this.zoneList = [];
        this.warehouseList.map(temp => {
          if (temp.whName === this.selectedWarehouse) {
            temp.zoneNames.forEach(t1 => {
              this.zoneList.push(t1);
            });
          }
        });
        this.sensorDetailView = [];
        const select = document.getElementById('test');
        select[0].selected = true;
        this.isAddDisable = true;
      }
    });
    $('.selectZone').change((event) => {
      this.sensorDetailView = [];
      if (event.target.value) {
        this.isAddDisable = true;
        this.selectedZone = event.target.value;
      }
      // call sensor api
      this.service.getSensorList(this.selectedWarehouseId, this.selectedZone);
    });

  }

  add(): void {
    const config: ModalOptions = {
      initialState: ['new', this.selectedWarehouse, this.selectedZone, this.warehouseList, this.sensorDetailView],
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(MasterDataMappingModalComponent, config);
    this.modalRef.onHidden.subscribe(() => {
      if (this.modalRef.content.value) {
        this.modalRef.content.value.forEach(temp => {
          const sensorTemp = new SensorDetail();
          sensorTemp.sensorId = temp.sensor_id;
          sensorTemp.sensorName = temp.sensor_name;
          sensorTemp.category = temp.category;
          sensorTemp.sampleInterval = temp.sample_interval_sec;
          sensorTemp.minTemp = temp.tem_value_max;
          sensorTemp.maxTemp = temp.tem_value_min;
          sensorTemp.minHumidity = temp.hum_value_max;
          sensorTemp.maxHumidity = temp.hum_value_max;
          this.sensorDetailView.push(sensorTemp);
        });
      }
    });
  }


  edit(sensorDetail: SensorDetail): void {
    const selectedSensorId = sensorDetail.sensorId;
    const config: ModalOptions = {
      initialState: [ObjectUtils.clone(sensorDetail), this.selectedWarehouse, this.selectedZone, selectedSensorId, this.warehouseList],
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(MasterDataMappingModalComponent, config);
    this.modalRef.onHidden.subscribe(() => {
      if (this.modalRef.content.value) {
        const temp = this.modalRef.content.value;
        this.sensorDetailView.map((sd, index) => {
          if (sd.sensorId === temp) {
            this.sensorDetailView.splice(index, 1);
          }
        });
      }
    });
  }

  delete(sensorDetail: SensorDetail): void {
    const config: ModalOptions = {
      initialState: [this.selectedWarehouseId, this.selectedZone, sensorDetail.sensorId],
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(MasterDataMappingDeleteModalComponent, config);
    this.modalRef.onHidden.subscribe(() => {
      if (this.modalRef.content.value) {
        const temp = this.modalRef.content.value;
        this.sensorDetailView.map((sd, index) => {
          if (sd.sensorId === temp) {
            this.sensorDetailView.splice(index, 1);
          }
        });
      }
    });
  }

  registerEvent(): void {
    this.service.getWarehouseEvent().subscribe((result: WarehouseMaster[]) => {
      this.warehouseList = result;
    });
    this.service.getSenesorEvent().subscribe((result: SensorDetail[]) => {
      this.sensorDetailView = result;
      if (this.sensorDetailView.length > 0) {
        this.isAddHidden = true;
      }
    });
  }
}
