import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SensorSimSynDto, WarehouseSimDto } from '../sensor-master-data/entity/warehouse.entity';
import { SensorMasterDataService } from '../sensor-master-data/service/sensor-master-data-service';
declare var $: any;

@Component({
  selector: 'app-sensor-master-data-modal',
  templateUrl: './sensor-master-data-modal.component.html',
  styleUrls: ['./sensor-master-data-modal.component.scss']
})
export class SensorMasterDataModalComponent implements OnInit {

  isAdd: boolean;

  isTemp: boolean;

  isHumd: boolean;

  isIntegrated: boolean;

  warehouseSimListView: WarehouseSimDto[];

  sampleInterval: string;

  valueRangeTempMin: string;

  valueRangeTempMax: string;

  valueRangeHumdMin: string;

  valueRangeHumdMax: string;

  sampleRangeTempMin: string;

  sampleRangeTempMax: string;

  sampleRangeHumdMin: string;

  sampleRangeHumdMax: string;

  excSampleRangeTempMin: string;

  excSampleRangeTempMax: string;

  excSampleRangeHumdMin: string;

  excSampleRangeHumdMax: string;

  isSelected: boolean;

  sensor: SensorSimSynDto;

  whNm: string;

  sensorId: string;

  isChecked: boolean;

  selectedWh: string;

  sensorName: string;

  whId: string;

  category: string;

  categoryList = ['TEMPERATURE', 'HUMIDITY', 'INTEGRATED'];

  constructor(
    public bsModalRef: BsModalRef,
    public service: SensorMasterDataService,
    private modalService: BsModalService
  ) {
    this.isAdd = false;
    this.isTemp = false;
    this.isHumd = false;
    this.isIntegrated = false;
    this.warehouseSimListView = [];
    this.isSelected = false;
    this.isChecked = false;
    this.sensor = new SensorSimSynDto();
  }

  ngOnInit(): void {
    this.isAdd = this.modalService.config.initialState[0] === 0 ? true : false;
    if (this.isAdd) {
      this.warehouseSimListView = this.modalService.config.initialState[1];
    } else {
      this.sensor = this.modalService.config.initialState[1];
      this.whNm = this.modalService.config.initialState[2];
      if (this.sensor.category === this.categoryList[0]) {
        this.isTemp = true;
        this.isHumd = false;
        this.isIntegrated = false;
        if (this.sensor.exceptionSampleRangeTempMin ||
          this.sensor.exceptionSampleRangeHumdMin) {
          this.isSelected = true;
          this.isChecked = true;
        } else {
          this.isSelected = false;
        }
      } else if (this.sensor.category === this.categoryList[1]) {
        this.isHumd = true;
        this.isTemp = false;
        this.isIntegrated = false;
        this.isSelected = false;
        if (this.sensor.exceptionSampleRangeTempMin ||
          this.sensor.exceptionSampleRangeHumdMin) {
          this.isSelected = true;
          this.isChecked = true;
        } else {
          this.isSelected = false;
        }

      } else if (this.sensor.category === this.categoryList[2]) {
        this.isIntegrated = true;
        this.isHumd = false;
        this.isTemp = false;
        this.isSelected = false;
        if (this.sensor.exceptionSampleRangeTempMin ||
          this.sensor.exceptionSampleRangeHumdMin) {
          this.isSelected = true;
          this.isChecked = true;
        } else {
          this.isSelected = false;
        }
      }
    }
    $('.select2Warehouse').select2({
      theme: 'bootstrap4',
    });

    $('.select2Category').select2({
      theme: 'bootstrap4',
    });

    $('.select2Warehouse').change((event) => {
      this.warehouseSimListView.forEach((wh) => {
        if (wh.name === event.target.value) {
          this.whId = wh.wh_id;
        }
      });
    });

    $('.select2Category').change((event) => {
      this.category = event.target.value;
      if (event.target.value === this.categoryList[0]) {
        this.isTemp = true;
        this.isHumd = false;
        this.isIntegrated = false;
        this.isSelected = false;

      } else if (event.target.value === this.categoryList[1]) {
        this.isHumd = true;
        this.isTemp = false;
        this.isIntegrated = false;
        this.isSelected = false;

      } else if (event.target.value === this.categoryList[2]) {
        this.isIntegrated = true;
        this.isHumd = false;
        this.isTemp = false;
        this.isSelected = false;
      }

    });
  }

  change(): void {
    if (this.isSelected === true) {
      this.isSelected = false;
    } else {
      this.isSelected = true;
    }
  }

  save(): void {
    const request = {
      sid: this.sensor.sid,
      name: this.sensor.name,
      category: this.category,
      value_range: {
        temperature: {
          min: this.sensor.valueRangeTempMin,
          max: this.sensor.valueRangeTempMax
        },
        humidity: {
          min: this.sensor.valueRangeHumdMin,
          max: this.sensor.valueRangeHumdMax
        }
      },
      sample_range: {
        temperature: {
          min: this.sensor.sampleRangeTempMin,
          max: this.sensor.sampleRangeTempMax
        },
        humidity: {
          min: this.sensor.sampleRangeHumdMin,
          max: this.sensor.sampleRangeHumdMax
        }
      },
      exception_sample_range: {
        temperature: {
          min: this.sensor.exceptionSampleRangeTempMin,
          max: this.sensor.exceptionSampleRangeTempMax
        },
        humidity: {
          min: this.sensor.exceptionSampleRangeHumdMin,
          max: this.sensor.exceptionSampleRangeHumdMax
        }
      },
      wh_id: this.sensor.whId,
      sample_interval_sec: this.sensor.sampleIntervalSec
    };
    this.service.addSensor(request);
    this.bsModalRef.hide();
  }

  confirm(): void {
    let request = {};
    if (this.category === 'INTEGRATED') {
      request = {
        sid: this.sensorId,
        name: this.sensorName,
        category: this.category,
        value_range: {
          temperature: {
            min: this.valueRangeTempMin,
            max: this.valueRangeTempMax
          },
          humidity: {
            min: this.valueRangeHumdMin,
            max: this.valueRangeHumdMax
          }
        },
        sample_range: {
          temperature: {
            min: this.sampleRangeTempMin,
            max: this.sampleRangeTempMax
          },
          humidity: {
            min: this.sampleRangeHumdMin,
            max: this.sampleRangeHumdMax
          }
        },
        exception_sample_range: {
          temperature: {
            min: this.excSampleRangeTempMin,
            max: this.excSampleRangeTempMax
          },
          humidity: {
            min: this.excSampleRangeHumdMin,
            max: this.excSampleRangeHumdMax
          }
        },
        wh_id: this.warehouseSimListView[0].wh_id,
        sample_interval_sec: this.sampleInterval,
      };
    }else if (this.category === 'TEMPERATURE'){
      request = {
        sid: this.sensorId,
        name: this.sensorName,
        category: this.category,
        value_range: {
            min: this.valueRangeTempMin,
            max: this.valueRangeTempMax,
        },
        sample_range: {
            min: this.sampleRangeTempMin,
            max: this.sampleRangeTempMax,
        },
        exception_sample_range: {
            min: this.excSampleRangeTempMin,
            max: this.excSampleRangeTempMax,
        },
        wh_id: this.warehouseSimListView[0].wh_id,
        sample_interval_sec: this.sampleInterval,
      };
    }else {
      request = {
        sid: this.sensorId,
        name: this.sensorName,
        category: this.category,
        value_range: {
            min: this.valueRangeHumdMin,
            max: this.valueRangeHumdMax,
        },
        sample_range: {
            min: this.sampleRangeHumdMin,
            max: this.sampleRangeHumdMax,
        },
        exception_sample_range: {
            min: this.excSampleRangeHumdMin,
            max: this.excSampleRangeHumdMax,
        },
        wh_id: this.warehouseSimListView[0].wh_id,
        sample_interval_sec: this.sampleInterval,
      };
    }
    this.service.addSensor(request);
    this.bsModalRef.content.value = request;
    this.bsModalRef.hide();
  }
}
