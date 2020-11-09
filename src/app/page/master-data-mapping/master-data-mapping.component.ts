import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { EnvConst } from 'src/app/common/const/env-const';
import { ObjectUtils } from 'src/app/common/utils/object.utils';
import { MasterDataMappingDeleteModalComponent } from '../master-data-mapping-delete-modal/master-data-mapping-delete-modal.component';
import { MasterDataMappingModalComponent } from '../master-data-mapping-modal/master-data-mapping-modal.component';
import { SensorDetail, WarehouseMaster } from './entity/masterDataEntity';
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

  constructor(
    public http: HttpClient,
    private modalService: BsModalService
  ) {
    this.sensorDetailView = [];
    this.warehouseList = [];
    this.zoneList = [];
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
    // Init warehouse and zone dropdown
    // const url = 'assets/json/master-data-mapping/warehouse-master-api.json';
    const url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/master/warehouses/zones';
    this.http.get(url).subscribe((res: any[]) => {
      const warehouse_master_api = ObjectUtils.clone(res);
      warehouse_master_api.forEach((index) => {
        const warehouseMaster = new WarehouseMaster();
        warehouseMaster.wh_id = index.wh_id;
        warehouseMaster.wh_name = index.wh_name;
        warehouseMaster.zone_names = index.zone_names;
        this.warehouseList.push(warehouseMaster);
      });
    });

    $('.selectWarehouse').change((event) => {
      if (event.target.value) {
        this.isZoneDisable = false;
        this.selectedWarehouse = event.target.value;
        this.warehouseList.forEach((temp) => {
          if (temp.wh_name === this.selectedWarehouse) {
            this.selectedWarehouseId = temp.wh_id;
          }
        })
        this.zoneList = [];
        this.warehouseList.map(temp => {
          if (temp.wh_name === this.selectedWarehouse) {
            temp.zone_names.forEach(temp => {
              this.zoneList.push(temp);
            });
          }
        });
        this.sensorDetailView = [];
        const select = document.getElementById('test');
        select[0].selected = true;
        this.isAddDisable = true;
      }
    })
    $('.selectZone').change((event) => {
      this.sensorDetailView = [];
      if (event.target.value) {
        this.isAddDisable = false;
        this.selectedZone = event.target.value;
      }
      // call sensor api
      const url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/master/warehouses/' + this.selectedWarehouseId + '/zone/' + this.selectedZone + '/sensors';
      // let url = 'assets/json/master-data-mapping/sensor-api.json';
      this.http.get(url).subscribe((res: any[]) => {
        const sensor_api = ObjectUtils.clone(res);
        sensor_api.forEach((index) => {
          const temp = new SensorDetail();
          temp.zone = index.zone;
          temp.sensorId = index.sensor_id;
          temp.sensorName = index.sensor_name;
          temp.sampleInterval = index.sample_interval_sec;
          temp.category = index.category;
          temp.minTemp = index.tem_value_min;
          temp.maxTemp = index.tem_value_max;
          temp.minHumidity = index.hum_value_min;
          temp.maxHumidity = index.hum_value_max;
          this.sensorDetailView.push(temp);
        })
      })
    })

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
        this.sensorDetailView.map((sensorDetail, index) => {
          if (sensorDetail.sensorId === temp) {
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
        let temp = this.modalRef.content.value;
        this.sensorDetailView.map((sensorDetail, index) => {
          if (sensorDetail.sensorId === temp) {
            this.sensorDetailView.splice(index, 1);
          }
        });
      }
    });
  }
}
