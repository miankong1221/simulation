import { Component, OnDestroy, OnInit } from '@angular/core';
import { StringUtils } from 'src/app/common/utils/string.util';
import { SensorEntity } from '../entity/sensor.entity';
import { WarehouseEntity, WarehouseGraphData, ZoneDataDto } from '../entity/warehouse.entity';
import { ZoneEntity, ZoneLocation } from '../entity/zone.entity';
import { MonitoringService } from '../service/monitoring-service';
declare var $: any;
declare var echarts: any;


@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit, OnDestroy {

  public warehouseOriginEntityList: WarehouseEntity[];
  public warehouseEntityList: WarehouseEntity[];
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public currentUrl: string;
  public zoneEntityList: ZoneEntity[];
  public sensorEntityList: SensorEntity[];
  public zoneLocationList: ZoneLocation[];
  public currentWhId: string;
  public currentWhName: any;
  public warehouseGraphData: WarehouseGraphData[];
  public warehouseRealTimeGraphData: WarehouseGraphData[];
  public isRealTime: boolean;
  public tempXAxisDataTemp: any[];
  public tempSeriesDataTemp: any[];
  public tempXAxisDataHumd: any[];
  public tempSeriesDataHumd: any[];

  constructor(
    public service: MonitoringService
  ) {
    this.warehouseEntityList = [];
    this.warehouseOriginEntityList = [];
    this.zoneLocationList = [];
    this.warehouseGraphData = [];
    this.isRealTime = false;
    this.tempXAxisDataTemp = [];
    this.tempSeriesDataTemp = [];
    this.tempXAxisDataHumd = [];
    this.tempSeriesDataHumd = [];
    this.warehouseRealTimeGraphData = [];
  }
  ngOnDestroy(): void {
    // this.whSub.unsubscribe()
  }

  ngOnInit(): void {

    // get warehouse list
    this.service.getAllWarehouse();

    // subscribe get warehouse list event
    this.service.getAllWarehouseEvent().subscribe((result: WarehouseEntity[]) => {
      this.warehouseOriginEntityList = result;
      if(this.warehouseOriginEntityList.length > 0 ){
        this.warehouseOriginEntityList.forEach(t1 => {
          t1.isMapExpand = false;
          t1.isExpand = false;
          t1.isListExpand = false;
          t1.isDiagramExpand = false
        })
      }
      this.warehouseEntityList = this.warehouseOriginEntityList;
      if(this.warehouseEntityList.length >0 ){
        this.warehouseEntityList.forEach(t2 => {
          t2.isMapExpand = false;
          t2.isExpand = false;
          t2.isListExpand = false;
          t2.isDiagramExpand = false
        })
      }
    });

    // subscribe get zone list event
    this.service.getZoneListEvent().subscribe((result: ZoneEntity[]) => {
      this.zoneEntityList = [];
      this.zoneEntityList = result;
    });

    // subscribe get zone location event
    this.service.getZoneLocationEvent().subscribe((result: ZoneLocation[]) => {
      this.zoneLocationList = result;
      if (this.zoneLocationList.length > 0) {
        if (!StringUtils.isEmpty(this.currentWhId)) {
          this.loadImage(this.currentWhId).then(() => {
            if (this.currentUrl !== '../assets/img/demo.jpg') {
              this.drawLocationDetail(this.ctx);
            }
          });
        }
      }
    });

    // subscribe get sensor List event
    this.service.getSensorListEvent().subscribe((result: SensorEntity[]) => {
      this.sensorEntityList = [];
      this.sensorEntityList = result;
    });

    // subscribe get warehouse graph event
    this.service.getWarehouseGraphDataEvent().subscribe((data: any[]) => {
      this.warehouseGraphData = [];
      if (data.length > 0) {
        data.forEach((temp) => {
          const warehouseGraphData = new WarehouseGraphData();
          warehouseGraphData.time = temp.time;
          temp.zone_data_dtos.forEach((temp2) => {
            const zoneData = new ZoneDataDto();
            zoneData.time = temp2.time;
            zoneData.zone = temp2.zone;
            zoneData.whId = temp2.wh_id;
            zoneData.temValue = temp2.tem_value;
            zoneData.humValue = temp2.hum_value;
            warehouseGraphData.zoneDataDto.push(zoneData);
          });
          this.warehouseGraphData.push(warehouseGraphData);
        });
      }
      this.setGraphData();
    });

    // subscribe get warehouse realtime graph event
    this.service.getWarehouseRealTimeDataEvent().subscribe((data: any[]) => {
      this.warehouseRealTimeGraphData = [];
      if (data.length > 0) {
        data.forEach((temp) => {
          const warehouseGraphData = new WarehouseGraphData();
          warehouseGraphData.time = temp.time;
          temp.zone_data_dtos.forEach((temp2) => {
            const zoneData = new ZoneDataDto();
            zoneData.time = temp2.time;
            zoneData.zone = temp2.zone;
            zoneData.whId = temp2.wh_id;
            zoneData.temValue = temp2.tem_value;
            zoneData.humValue = temp2.hum_value;
            warehouseGraphData.zoneDataDto.push(zoneData);
          });
          this.warehouseRealTimeGraphData.push(warehouseGraphData);
        });
      }
      this.setGraphData();
    });

    $('.select2Warehouse').select2({
      theme: 'bootstrap4',
    });

    $('.select2Warehouse').change((event) => {
      if (event.target.value === 'Select a warehouse') {
        this.warehouseEntityList = this.warehouseOriginEntityList;
      } else {
        this.warehouseEntityList = this.warehouseOriginEntityList.filter((temp) => {
          return temp.wh_name === event.target.value;
        });
        this.warehouseEntityList.forEach((temp) => {
          if (temp.wh_name === event.target.value) {
            temp.isExpand = false;
          }
        });
      }
    });
  }

  loadImage(whId: any): Promise<any> {
    const id = 'getCanvas' + whId;
    this.canvas = document.getElementById(id) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 880;
    this.canvas.height = 646;
    if (whId === 'NAS06') {
      this.currentUrl = '../assets/img/NAS06.jpg';
    } else if (whId === 'NAS05') {
      this.currentUrl = '../assets/img/NAS05.jpg';
    } else {
      this.currentUrl = '../assets/img/demo.jpg';
    }
    return new Promise(resolve => {
      if (whId) {
        const image = new Image();
        image.src = this.currentUrl;
        image.addEventListener('load', () => {
          this.ctx.drawImage(image, 0, 0);
          resolve(image);
        });
      }
    });
  }

  drawLocationDetail(ctx: any): void {
    this.zoneLocationList.forEach((zone) => {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.fillStyle = 'orange';
      ctx.arc(zone.x, zone.y, 15, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.arc(zone.x, zone.y, 15, 0, Math.PI * 2, false);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'blue';
      ctx.stroke();
      ctx.font = '15px "微软雅黑"';
      ctx.fillStyle = 'black';
      ctx.fillText(zone.zone, zone.x - 15, zone.y - 20);
    });
  }

  warehouseExpand(whId: any): void{
    this.currentWhId = whId;
    // get zone location
    this.service.getZoneLocation(whId);
    this.warehouseEntityList.forEach(element => {
      if (whId === element.wh_id) {
        this.currentWhName = element.wh_name;
        if (element.isExpand === true) {
          element.isExpand = false;
          document.getElementById(element.wh_id).textContent = 'Expand';
        } else {
          element.isExpand = true;
          element.isMapExpand = true;
          element.isListExpand = false;
          element.isDiagramExpand = false;
          this.changeTabColor(this.currentWhId, 'black', '#337ab7', '#337ab7');
          document.getElementById(element.wh_id).textContent = 'Collapse';
        }
      } else {
        element.isExpand = false;
      }
    });
  }

  showMap(whId: any): void {
    this.changeTabColor(whId, 'black', '#337ab7', '#337ab7');
    this.warehouseOriginEntityList.forEach(element => {
      if (whId === element.wh_id) {
        element.isMapExpand = true;
        element.isListExpand = false;
        element.isDiagramExpand = false;
      }
    });
  }

  showList(): void {
    this.service.getZoneList(this.currentWhId);
    this.changeTabColor(this.currentWhId, '#337ab7', 'black', '#337ab7');
    this.warehouseOriginEntityList.forEach(element => {
      if (this.currentWhId === element.wh_id) {
        element.isMapExpand = false;
        element.isListExpand = true;
        element.isDiagramExpand = false;
      }
    });
  }

  showDiagram(whId: any): void  {
    this.changeTabColor(whId, '#337ab7', '#337ab7', 'black');
    this.warehouseOriginEntityList.forEach(element => {
      if (whId === element.wh_id) {
        element.isMapExpand = false;
        element.isListExpand = false;
        element.isDiagramExpand = true;
      }
    });
    this.getHistoryData();
  }

  zoneExpand(zoneId: any): void {
    this.service.getSensorList(this.currentWhId, zoneId);
    this.zoneEntityList.forEach(element => {
      if (zoneId === element.zone_name) {
        if (element.isExpand === true) {
          element.isExpand = false;
          document.getElementById(element.zone_name).textContent = 'Expand';
        } else {
          element.isExpand = true;
          document.getElementById(element.zone_name).textContent = 'Collapse';
        }
      } else {
        if (element.isExpand === true) {
          document.getElementById(element.zone_name).textContent = 'Expand';
        }
        element.isExpand = false;
      }
    });
  }

  setGraphData(): void {
    let legendDataTemp = '';
    let legendDataHumd = '';
    const xAxisDataTemp = [];
    const xAxisDataHumd = [];
    const seriesDataTemp = [];
    const seriesDataHumd = [];
    const elementTempId = this.isRealTime === true ? 'canvasTempRealTime' : 'canvasTemp';
    const elementHumdId = this.isRealTime === true ? 'canvasHumiRealTime' : 'canvasHumidity';
    if (this.isRealTime) {
      this.warehouseRealTimeGraphData.forEach((temp) => {
        temp.zoneDataDto.forEach((temp2) => {
          if (temp2.temValue) {
            this.tempXAxisDataTemp.push(temp.time);
            legendDataTemp = 'Temperture';
            this.tempSeriesDataTemp.push(temp.zoneDataDto);
          }
          if (temp2.humValue) {
            this.tempXAxisDataHumd.push(temp.time);
            legendDataHumd = 'Humidity';
            this.tempSeriesDataHumd.push(temp.zoneDataDto);
          }
        });
      });
    } else {
      this.warehouseGraphData.forEach((temp) => {
        temp.zoneDataDto.forEach((temp2) => {
          if (temp2.temValue) {
            xAxisDataTemp.push(temp.time);
            legendDataTemp = 'Temperture';
            seriesDataTemp.push(temp.zoneDataDto);
          }
          if (temp2.humValue) {
            xAxisDataHumd.push(temp.time);
            legendDataHumd = 'Humidity';
            seriesDataHumd.push(temp.zoneDataDto);
          }
        });
      });
    }
    if (legendDataTemp === 'Temperture') {
      if (this.isRealTime === true) {
        this.drawGraph(elementTempId, legendDataTemp, this.tempXAxisDataTemp, this.tempSeriesDataTemp);
      } else {
        this.drawGraph(elementTempId, legendDataTemp, xAxisDataTemp, seriesDataTemp);
      }
    }
    if (legendDataHumd === 'Humidity') {
      if (this.isRealTime === true) {
        this.drawGraphHum(elementHumdId, legendDataHumd, this.tempXAxisDataHumd, this.tempSeriesDataHumd);
      } else {
        this.drawGraphHum(elementHumdId, legendDataHumd, xAxisDataHumd, seriesDataHumd);
      }
    }
  }

  drawGraph(elementId: any, legendData: any, xAxisData: any[], seriesData: any[]): void {
    let zoneOneList: ZoneDataDto[];
    zoneOneList = [];
    let zoneTwoList: ZoneDataDto[];
    zoneTwoList = [];
    let zoneOneName = '';
    let zoneTwoName = '';
    seriesData.forEach(temp => {
      zoneOneList.push(temp[0].temValue);
      zoneOneName = temp[0].zone;
      zoneTwoList.push(temp[1].temValue);
      zoneTwoName = temp[1].zone;
    });
    const myChart = echarts.init(document.getElementById(elementId));
    const option = {
      title: {
        text: legendData
      },
      tooltip: {},
      legend: {
        data: [zoneOneName, zoneTwoName]
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        data: xAxisData
      },
      yAxis: {},
      series: [{
        name: zoneOneName,
        type: 'line',
        color: '#DC8243',
        data: zoneOneList
      },
      {
        name: zoneTwoName,
        type: 'line',
        color: '#4E72BE',
        data: zoneTwoList
      }
      ]
    };
    myChart.setOption(option);
  }

  drawGraphHum(elementId: any, legendData: any, xAxisData: any[], seriesData: any[]): void {
    let zoneOneList: ZoneDataDto[];
    zoneOneList = [];
    let zoneTwoList: ZoneDataDto[];
    zoneTwoList = [];
    let zoneOneName = '';
    let zoneTwoName = '';
    seriesData.forEach(temp => {
      zoneOneList.push(temp[0].humValue);
      zoneOneName = temp[0].zone;
      zoneTwoList.push(temp[1].humValue);
      zoneTwoName = temp[1].zone;
    });
    const myChart = echarts.init(document.getElementById(elementId));
    const option = {
      title: {
        text: legendData
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: [zoneOneName, zoneTwoName]
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        data: xAxisData
      },
      yAxis: {},
      series: [{
        name: zoneOneName,
        type: 'line',
        color: '#DC8243',
        data: zoneOneList
      },
      {
        name: zoneTwoName,
        type: 'line',
        color: '#4E72BE',
        data: zoneTwoList
      }
      ]
    };
    myChart.setOption(option);
  }

  getHistoryData(): void{
    this.isRealTime = false;
    document.getElementById('today').style.border = '5px solid #cccccc';
    this.service.getWarehouseGraphData(this.currentWhId);
  }

  getRealTime(): void {
    this.isRealTime = true;
    document.getElementById('today').style.border = '1px solid #cccccc';
    this.service.getWarehouseGraphRealTimeData(this.currentWhId);
    setInterval(() => {
      this.service.getWarehouseGraphRealTimeData(this.currentWhId);
    }, 6000);
  }

  changeTabColor(whId: string, mapColor: string, listColor: string, diagColor: string): void{
    document.getElementById('map_' + whId).style.color = mapColor;
    document.getElementById('list_' + whId).style.color = listColor;
    document.getElementById('diag_' + whId).style.color = diagColor;
  }
}
