import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { stringify } from 'querystring';
import { EnvConst } from 'src/app/common/const/env-const';
import { SensorDetail } from '../master-data-mapping/entity/masterDataEntity';
declare var $: any;
@Component({
  selector: 'app-master-data-mapping-modal',
  templateUrl: './master-data-mapping-modal.component.html',
  styleUrls: ['./master-data-mapping-modal.component.scss']
})
export class MasterDataMappingModalComponent implements OnInit, OnDestroy {

  sensorDetailView: SensorDetail;

  formerSensorList: SensorDetail[];

  isDisabled: boolean;

  selectedWarehouse: any;

  selectedWarehouseId: string;

  selectedZone: any;

  selectedSensor: any;

  zoneList: any[];

  sensorList: any[];

  isNew: boolean;

  oldZone: string;

  newZone: string;

  selectedSensorList: any[];

  flag: boolean;

  // isZoneChange: boolean;


  constructor(
    public bsModalRef: BsModalRef,
    public http: HttpClient,
    private modalService: BsModalService,
  ) {
    this.sensorList = [];
    this.isNew = false;
    this.selectedSensorList = [];
    this.zoneList = [];
    this.flag = false;
    this.formerSensorList = [];
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {

    $('.select2-purple').select2({
      theme: 'bootstrap4',
    });

    $('.selectZone-mappingModal').change((event) => {
      this.newZone = event.target.value;
    });

    $('.select2-purple').change(() => {
      // this.selectedSensorList = stringify( $('.select2-purple').val(0))
      this.selectedSensorList = [];
      const temp = stringify($('.select2-purple').val());
      const tempList = temp.split('&');
      tempList.forEach((temp) => {
        this.selectedSensorList.push(temp.slice(temp.indexOf('=') + 1))
      });
    });

    $('.selectZone-mappingModal').select2({
      theme: 'bootstrap4',
    });

    if (this.modalService.config.initialState) {
      this.selectedWarehouse = this.modalService.config.initialState[1];
      this.selectedZone = this.modalService.config.initialState[2];
      this.oldZone = this.selectedZone;
      if (this.modalService.config.initialState[0] === 'new') {
        // add new sensor
        this.sensorDetailView = new SensorDetail();
        this.isDisabled = false;
        this.isNew = true;
        const warehouseList = this.modalService.config.initialState[3];
        this.formerSensorList = this.modalService.config.initialState[4];
        warehouseList.map(temp => {
          if (temp.wh_name === this.selectedWarehouse) {
            this.selectedWarehouseId = temp.wh_id;
            if (temp.zone_names.length > 0) {
              temp.zone_names.forEach(temp => {
                this.zoneList.push(temp);
              });
            }
          }
        });
      } else {
        // edit exist sensor
        this.sensorDetailView = this.modalService.config.initialState[0] as SensorDetail;
        this.isDisabled = true;
        this.selectedSensor = this.modalService.config.initialState[3];
        const warehouseList = this.modalService.config.initialState[4];
        warehouseList.map(temp => {
          if (temp.wh_name === this.selectedWarehouse) {
            this.selectedWarehouseId = temp.wh_id;
            temp.zone_names.forEach( t => {
              this.zoneList.push(t);
            });
          }
        });
      }
    }
    // let url = 'assets/json/master-data-mapping-modal/sensor-available-api.json'
    const url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/master/warehouses/' + this.selectedWarehouseId + '/sensorIds';
    this.http.get(url).subscribe((res: any[]) => {
      res.forEach((temp) => {
        this.flag = false;
        this.formerSensorList.forEach(element => {
          if (temp === element.sensorId){
            this.flag = true;
            return;
          }
        });
        if (this.flag === false){
          this.sensorList.push(temp);
        }
      });
    });

  }

  confirm(): void{
    if (this.isNew) {
      // add new sensor
      const req = {
        wh_id: this.selectedWarehouseId,
        zone: this.selectedZone,
        sensor_id: []
      };
      this.selectedSensorList.forEach((temp) => {
        req.sensor_id.push(temp);
      });
      let url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/master/sensors/relations';
      this.http.post(url, req).subscribe((res) => {
        // console.log(res)
        this.bsModalRef.content.value = res;
      });
    } else {
      // edit exist sensor
      const req = {
        wh_id : this.selectedWarehouseId,
        new_zone : this.newZone,
        old_zone : this.oldZone,
        sensor_id : this.selectedSensor
      };
      this.sensorDetailView.zone = this.newZone;
      let url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/master/sensors/relations';
      this.http.put(url, req).subscribe(() => {
        // remove sensor from old zone
        if (this.oldZone !== this.newZone){
          this.bsModalRef.content.value =  this.selectedSensor;
        }
      });
    }
    this.bsModalRef.hide();
  }
}
