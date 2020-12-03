import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeServiceInit } from 'ng-devui';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SensorDetail } from '../master-data-mapping/entity/masterDataEntity';
import { SensorMasterDataDeleteModalComponent } from '../sensor-master-data-delete-modal/sensor-master-data-delete-modal.component';
import { SensorMasterDataModalComponent } from '../sensor-master-data-modal/sensor-master-data-modal.component';
import { SensorSimSynDto, WarehouseSimDto } from './entity/warehouse.entity';
import { SensorMasterDataService } from './service/sensor-master-data-service';
declare var $: any;

@Component({
  selector: 'app-sensor-master-data',
  templateUrl: './sensor-master-data.component.html',
  styleUrls: ['./sensor-master-data.component.scss']
})
export class SensorMasterDataComponent implements OnInit {

  modalRef: BsModalRef;

  sensorDetailView: SensorDetail[];

  isZoneDisable: boolean;

  isAddDisable: boolean;

  warehouseSimListView: WarehouseSimDto[];

  sensorSimListView: SensorSimSynDto[];

  zoneList: any[];

  selectedWhId: string;

  isAddHidden: boolean;

  constructor(
    public http: HttpClient,
    private modalService: BsModalService,
    private service: SensorMasterDataService
  ) {
    this.warehouseSimListView = [];
    this.sensorSimListView = [];
    this.zoneList = [];
    this.isAddDisable = true;
    this.isAddHidden = false;
  }

  ngOnInit(): void {

    this.service.getAllWarehouse();

    $('.select2Warehouse').select2({
      theme: 'bootstrap4',
    });

    this.service.getAllWarehouseEvent().subscribe((result) => {
      this.warehouseSimListView = result;
    });

    this.service.getSensorByWarehouseEvent().subscribe((result: any[]) => {
      this.sensorSimListView = [];
      if (this.selectedWhId){
        result.forEach(element => {
          const temp = new SensorSimSynDto();
          temp.sid = element.sid;
          temp.name = element.name;
          temp.whId = element.wh_id;
          temp.sampleIntervalSec = element.sample_interval_sec;
          temp.category = element.category;
          if (element.category === 'HUMIDITY') {
            if (element.value_range) {
              temp.valueRangeHumdMin = element.value_range.min + '%';
              temp.valueRangeHumdMax = element.value_range.max + '%';
            }
            if (element.sample_range) {
              temp.sampleRangeHumdMin = element.sample_range.min + '%';
              temp.sampleRangeHumdMax = element.sample_range.max + '%';
            }
            if (element.exception_sample_range) {
              temp.exceptionSampleRangeHumdMin = element.exception_sample_range.min + '%';
              temp.exceptionSampleRangeHumdMax = element.exception_sample_range.max + '%';
            }
          }
          else if (element.category === 'TEMPERATURE') {
            if (element.value_range) {
              temp.valueRangeTempMin = element.value_range.min + '°C';
              temp.valueRangeTempMax = element.value_range.max + '°C';
            }
            if (element.sample_range) {
              temp.sampleRangeTempMin = element.sample_range.min + '°C';
              temp.sampleRangeTempMax = element.sample_range.max + '°C';
            }
            if (element.exception_sample_range) {
              temp.exceptionSampleRangeTempMin = element.exception_sample_range.min + '°C';
              temp.exceptionSampleRangeTempMax = element.exception_sample_range.max + '°C';
            }
          }
          else if (element.category === 'INTEGRATED') {
            if (element.value_range) {
              temp.valueRangeHumdMin = element.value_range.humidity.min + '%';
              temp.valueRangeHumdMax = element.value_range.humidity.max + '%';
            }
            if (element.sample_range) {
              temp.sampleRangeHumdMin = element.sample_range.humidity.min + '%';
              temp.sampleRangeHumdMax = element.sample_range.humidity.max + '%';
            }
            if (element.exception_sample_range) {
              temp.exceptionSampleRangeHumdMin = element.exception_sample_range.humidity.min + '%';
              temp.exceptionSampleRangeHumdMax = element.exception_sample_range.humidity.max + '%';
            }
            if (element.value_range) {
              temp.valueRangeTempMin = element.value_range.temperature.min + '°C';
              temp.valueRangeTempMax = element.value_range.temperature.max + '°C';
            }
            if (element.sample_range) {
              temp.sampleRangeTempMin = element.sample_range.temperature.min + '°C';
              temp.sampleRangeTempMax = element.sample_range.temperature.max + '°C';
            }
            if (element.exception_sample_range) {
              temp.exceptionSampleRangeTempMin = element.exception_sample_range.temperature.min + '°C';
              temp.exceptionSampleRangeTempMax = element.exception_sample_range.temperature.max + '°C';
            }
          }
          this.sensorSimListView.push(temp);
        });
      }
    });

    $('.select2Warehouse').change((event) => {
      if (event.target.value) {
        this.isAddDisable = false;
        this.warehouseSimListView.forEach((temp) => {
          if (temp.name === event.target.value) {
            this.selectedWhId = temp.wh_id;
            return;
          }
        });
        this.service.getSensorByWarehouse(this.selectedWhId);
      }
    });


  }

  add(): void {
    const config: ModalOptions = {
      initialState: [0, this.warehouseSimListView],
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(SensorMasterDataModalComponent, config);
    this.modalRef.onHidden.subscribe(() => {
      if (this.modalRef.content.value) {
        const temp = this.modalRef.content.value;
        const res = new SensorSimSynDto();
        res.sid = temp.sid;
        res.name = temp.name;
        res.whId = temp.wh_id;
        res.sampleIntervalSec = temp.sample_interval_sec;
        res.category = temp.category;
        if (temp.category === 'HUMIDITY') {
          if (temp.value_range) {
            res.valueRangeHumdMin = temp.value_range.min + '%';
            res.valueRangeHumdMax = temp.value_range.max + '%';
          }
          if (temp.sample_range) {
            res.sampleRangeHumdMin = temp.sample_range.min + '%';
            res.sampleRangeHumdMax = temp.sample_range.max + '%';
          }
          if (temp.exception_sample_range) {
            res.exceptionSampleRangeHumdMin = temp.exception_sample_range.min + '%';
            res.exceptionSampleRangeHumdMax = temp.exception_sample_range.max + '%';
          }
        }
        else if (temp.category === 'TEMPERATURE') {
          if (temp.value_range) {
            res.valueRangeTempMin = temp.value_range.min + '°C';
            res.valueRangeTempMax = temp.value_range.max + '°C';
          }
          if (temp.sample_range) {
            res.sampleRangeTempMin = temp.sample_range.min + '°C';
            res.sampleRangeTempMax = temp.sample_range.max + '°C';
          }
          if (temp.exception_sample_range) {
            res.exceptionSampleRangeTempMin = temp.exception_sample_range.min + '°C';
            res.exceptionSampleRangeTempMax = temp.exception_sample_range.max + '°C';
          }
        }
        else if (temp.category === 'INTEGRATED') {
          if (temp.value_range) {
            res.valueRangeHumdMin = temp.value_range.humidity.min + '%';
            res.valueRangeHumdMax = temp.value_range.humidity.max + '%';
          }
          if (temp.sample_range) {
            res.sampleRangeHumdMin = temp.sample_range.humidity.min + '%';
            res.sampleRangeHumdMax = temp.sample_range.humidity.max + '%';
          }
          if (temp.exception_sample_range) {
            res.exceptionSampleRangeHumdMin = temp.exception_sample_range.humidity.min + '%';
            res.exceptionSampleRangeHumdMax = temp.exception_sample_range.humidity.max + '%';
          }
          if (temp.value_range) {
            res.valueRangeTempMin = temp.value_range.temperature.min + '°C';
            res.valueRangeTempMax = temp.value_range.temperature.max + '°C';
          }
          if (temp.sample_range) {
            res.sampleRangeTempMin = temp.sample_range.temperature.min + '°C';
            res.sampleRangeTempMax = temp.sample_range.temperature.max + '°C';
          }
          if (temp.exception_sample_range) {
            res.exceptionSampleRangeTempMin = temp.exception_sample_range.temperature.min + '°C';
            res.exceptionSampleRangeTempMax = temp.exception_sample_range.temperature.max + '°C';
          }
        }
        this.sensorSimListView.push(res);
      }
    });
  }


  edit(sensorDetail: SensorSimSynDto): void {
    let param = new SensorSimSynDto();
    let whId = '';
    this.sensorSimListView.forEach(temp => {
      if (temp.sid === sensorDetail.sid){
        whId = temp.whId;
        param = temp;
      }
    });
    let whNm = '';
    this.warehouseSimListView.forEach(temp => {
      if (temp.wh_id === whId){
        whNm = temp.name;
      }
    });
    const config: ModalOptions = {
      initialState: [1, param, whNm],
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(SensorMasterDataModalComponent, config);
  }

  delete(sensorDetail: SensorSimSynDto): void {
    const config: ModalOptions = {
      initialState: [],
      ignoreBackdropClick: true
    };
    console.log(sensorDetail.sid);
    this.modalRef = this.modalService.show(SensorMasterDataDeleteModalComponent, config);
    this.modalRef.onHidden.subscribe(() => {
      // if (this.modalRef.content.value) {
        this.service.deleteSensor(sensorDetail.sid);
        this.sensorSimListView.map((sensor, index) => {
          if (sensor.sid === sensorDetail.sid) {
            this.sensorSimListView.splice(index, 1);
          }
        });
        // const temp = this.modalRef.content.value;
        // this.sensorDetailView.map((sd, index) => {
        //   if (sd.sensorId === temp) {
        //     this.sensorDetailView.splice(index, 1);
        //   }
        // });
      // }
    });
  }

}
