import { Component, OnInit } from '@angular/core';
import { WarehouseEntity } from './entity/simulation-entity';
import { SimulationService } from './service/simulation-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StringUtils } from 'src/app/common/utils/string.util';


declare var $: any;

@Component({
  selector: 'app-simulation-control',
  templateUrl: './simulation-control.component.html',
  styleUrls: ['./simulation-control.component.scss']
})
export class SimulationControlComponent implements OnInit {

  time: Date | null = null;

  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);

  warehouseEntityList: WarehouseEntity[];

  start: string;

  end: string;

  isCardActive: boolean;

  isDropdownActive: boolean;

  isSwitchActive: boolean;

  selectedWh: string;

  switchValue: boolean;

  constructor(
    public service: SimulationService,
    public message: NzMessageService
  ) {
    this.warehouseEntityList = [];
    this.isCardActive = false;
    this.switchValue = false;
    this.isDropdownActive = false;
  }

  ngOnInit(): void {

    $('.select2Warehouse').select2({
      theme: 'bootstrap4',
    });

    $('.select2Warehouse').change((event) => {
      this.warehouseEntityList.forEach(wh => {
        if (wh.name === event.target.value) {
          this.selectedWh = wh.wh_id;
        }
      });
      this.isCardActive = true;
      this.isSwitchActive = false;
    });

    this.service.getAllWarehouse();
    this.service.getAllWarehouseEvent().subscribe((result: WarehouseEntity[]) => {
      this.warehouseEntityList = result;
    });
  }

  onChange(result: Date): void {
    this.start = StringUtils.getToday(result[0]);
    this.end = StringUtils.getToday(result[1]);
  }

  onOk(result: Date | Date[] | null): void {
    console.log('onOk', result);
  }

  onCalendarChange(result: Array<Date | null>): void {
    console.log('onCalendarChange', result);
  }

  generateCorrectData(): void {
    this.service.generateCorrectData(this.selectedWh, this.start, this.end);

  }

  generateExceptionData(): void {
    this.service.generateExceptionData(this.selectedWh, this.start, this.end);
  }

  generateRealTime(): void {
    const reg = new RegExp('^0+');
    let interval = StringUtils.getInterval(this.time);
    interval = interval.replace(reg, '');
    console.log(interval);
    this.isDropdownActive = this.switchValue;
    if (this.switchValue === true) {
      this.service.generateRealTimeStart(this.selectedWh, interval);
    } else {
      this.service.generateRealTimeEnd();
    }

  }

  onChangeTimePick(event): void {
    if (!event) {
      this.switchValue = false;
      this.isSwitchActive = false;
    } else {
      this.isSwitchActive = true;
    }
  }
}
