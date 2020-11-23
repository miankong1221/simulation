import { Component, OnDestroy, OnInit } from '@angular/core';
import { StringUtils } from 'src/app/common/utils/string.util';
import { SensorEntity } from '../entity/sensor.entity';
import { WarehouseEntity, WarehouseGraphData, ZoneDataDto } from '../entity/warehouse.entity';
import { ZoneEntity, ZoneLocation } from '../entity/zone.entity';
import { MonitoringService } from '../service/monitoring-service';
import h377 from 'heatmap.js-2.0.5';
import * as T from 'src/assets/js/temperate/temperatureMap.js';
import L from 'leaflet/dist/leaflet';
import { he } from 'date-fns/locale';
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
  public currentWhName: string;
  public warehouseGraphData: WarehouseGraphData[];
  public warehouseRealTimeGraphData: WarehouseGraphData[];
  public isRealTime: boolean;
  public tempXAxisDataTemp: any[];
  public tempSeriesDataTemp: any[];
  public tempXAxisDataHumd: any[];
  public tempSeriesDataHumd: any[];
  public heatmapInstance: any;
  public generateGraphInterval: any;
  public chilledCurTemp: number;
  public frozenCurTemp: number;
  public deepFrozenCurTemp: number;
  public curTime: string;
  public isGraphErr: boolean;
  public times: number;
  public benchMark: number;
  // points: any;
  // sensor1: any;
  // sensor2: any;
  // sensor3: any;
  // sensor4: any;
  // isFirst: boolean;

  constructor(
    public service: MonitoringService
  ) {
    this.isGraphErr = false;
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
    this.benchMark = 6;
    this.times = 0;
  }
  ngOnDestroy(): void {
    clearInterval(this.generateGraphInterval);
  }

  ngOnInit(): void {

    // this.heatMap();
    // get warehouse list
    this.service.getAllWarehouse();

    // subscribe get warehouse list event
    this.service.getAllWarehouseEvent().subscribe((result: WarehouseEntity[]) => {
      this.warehouseOriginEntityList = result;
      if (this.warehouseOriginEntityList.length > 0) {
        this.warehouseOriginEntityList.forEach(t1 => {
          t1.isMapExpand = false;
          t1.isExpand = false;
          t1.isListExpand = false;
          t1.isDiagramExpand = false;
        });
      }
      this.warehouseEntityList = this.warehouseOriginEntityList;
      if (this.warehouseEntityList.length > 0) {
        this.warehouseEntityList.forEach(t2 => {
          t2.isMapExpand = false;
          t2.isExpand = false;
          t2.isListExpand = false;
          t2.isDiagramExpand = false;
        });
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
        // this.warehouseRealTimeGraphData = data;
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
      ctx.font = '15px "Maersk Text"';
      ctx.fillStyle = 'black';
      ctx.fillText(zone.zone, zone.x - 15, zone.y - 20);
    });
  }

  warehouseExpand(whId: any): void {
    this.currentWhId = whId;
    // get zone location
    this.service.getZoneLocation(whId);
    this.warehouseEntityList.forEach(element => {
      if (whId === element.wh_id) {
        this.generateGraph();
        this.generateGraphInterval  = setInterval(() => this.generateGraph(), 2000);
        this.currentWhName = element.wh_name;
        if (element.isExpand === true) {
          element.isExpand = false;
          document.getElementById(element.wh_id).textContent = 'Expand';
        } else {
          element.isExpand = true;
          element.isMapExpand = true;
          element.isListExpand = false;
          element.isDiagramExpand = false;
          this.changeTabColor(this.currentWhId, 'black', '#337ab7', '#337ab7', '#337ab7');
          document.getElementById(element.wh_id).textContent = 'Collapse';
        }
      } else {
        element.isExpand = false;
      }
    });
  }

  getRandom(start: number, end: number): string {
    const differ = end - start;
    const random = Math.random();
    return (start + differ * random).toFixed(1);
  }


  showMap(whId: any): void {
    this.changeTabColor(whId, 'black', '#337ab7', '#337ab7', '#337ab7');
    this.warehouseOriginEntityList.forEach(element => {
      if (whId === element.wh_id) {
        element.isMapExpand = true;
        element.isHeatMapExpand = false;
        element.isListExpand = false;
        element.isDiagramExpand = false;
      }
    });
  }

  generateGraph(): void {
    this.times++;
    const dataDeep = [];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 16; j++) {
        const value = Number((Math.random() * 5).toFixed(1)) - 30;
        const temp = [i, j, value];
        dataDeep.push(temp);
      }
    }
    const dataFrozen = [];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 16; j++) {
        const value = Number((Math.random() * 10).toFixed(1)) - 20;
        const temp = [i, j, value];
        dataFrozen.push(temp);
      }
    }
    const dataChill = [];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 16; j++) {
        const start = -5;
        const end = 4;
        let value = Number(this.getRandom(start, end));
        if (value === 0) {
          value = 0.1;
        }
        const temp = [i, j, value];
        dataChill.push(temp);
      }
    }
    this.blockGraph(dataDeep, dataFrozen, dataChill);
  }

  showList(): void {
    this.service.getZoneList(this.currentWhId);
    this.changeTabColor(this.currentWhId, '#337ab7', 'black', '#337ab7', '#337ab7');
    this.warehouseOriginEntityList.forEach(element => {
      if (this.currentWhId === element.wh_id) {
        element.isMapExpand = false;
        element.isHeatMapExpand = false;
        element.isListExpand = true;
        element.isDiagramExpand = false;
      }
    });
  }

  showDiagram(whId: any): void {
    this.changeTabColor(whId, '#337ab7', '#337ab7', 'black', '#337ab7');
    this.warehouseOriginEntityList.forEach(element => {
      if (whId === element.wh_id) {
        element.isMapExpand = false;
        element.isListExpand = false;
        element.isHeatMapExpand = false;
        element.isDiagramExpand = true;
      }
    });
    this.getHistoryData();
  }

  zoneExpand(zoneId: any): void {
    this.service.getSensorList(this.currentWhId, zoneId);
    setInterval(() => this.service.getSensorList(this.currentWhId, zoneId), 1000);
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
  }

  drawGraph(elementId: any, legendData: any, xAxisData: any[], seriesData: any[]): void {
    const zoneOneList: number[] = [];
    const zoneTwoList: number[] = [];
    let zoneOneName = '';
    let zoneTwoName = '';
    seriesData.forEach(temp => {
      temp[0].temValue = 20;
      zoneOneList.push(temp[0].temValue);
      zoneOneName = temp[0].zone;
      temp[1].temValue = 30;
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
        data: xAxisData,
        type: 'time',
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
    const zoneOneList: number[] = [];
    const zoneTwoList: number[] = [];
    let zoneOneName = '';
    let zoneTwoName = '';
    const myChart = echarts.init(document.getElementById(elementId));
    seriesData.forEach(temp => {
      temp[0].humValue = 10;
      zoneOneList.push(temp[0].humValue);
      zoneOneName = temp[0].zone;
      temp[1].humValue = 10;
      zoneTwoList.push(temp[1].humValue);
      zoneTwoName = temp[1].zone;
    });
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
        data: xAxisData,
        type: 'time',
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

  getHistoryData(): void {
    this.isRealTime = false;
    document.getElementById('today').style.border = '3px solid #cccccc';
    document.getElementById('realTime').style.border = '3px solid #cccccc';
    this.service.getWarehouseGraphData(this.currentWhId);
  }

  getRealTime(): void {
    this.isRealTime = true;
    document.getElementById('realTime').style.border = '3px solid #cccccc';
    document.getElementById('today').style.border = '3px solid #cccccc';
    this.service.getWarehouseGraphRealTimeData(this.currentWhId);
    setInterval(() => {
      this.service.getWarehouseGraphRealTimeData(this.currentWhId);
    }, 6000);
  }

  changeTabColor(whId: string, mapColor: string, listColor: string, diagColor: string, hmColor: string): void {
    document.getElementById('map_' + whId).style.color = mapColor;
    document.getElementById('list_' + whId).style.color = listColor;
    document.getElementById('heatMap_' + whId).style.color = hmColor;
    document.getElementById('diag_' + whId).style.color = diagColor;
  }


  blockGraph(dataDeep: any, dataFrozen: any, dataChill: any): void {
    this.chilledCurTemp = Number((Math.random() * 1).toFixed(1)) + 1;
    this.frozenCurTemp = Number((Math.random() * 1).toFixed(1)) - 14;
    this.deepFrozenCurTemp = Number((Math.random() * 1).toFixed(1)) - 28;
    this.curTime = StringUtils.getCurTime();
    const myChart1 = echarts.init(document.getElementById('demo1'));
    const locations1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
      '10', '11', '12', '13', '14', '15', '16'];
    const layers1 = ['B', 'A'];
    const dataNew1 = dataChill.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });
    let optionMin = -5;
    let optionMax = 4;
    let optionColor = ['#00CD00', '#FFFF00'];
    if (this.times >= this.benchMark){
      optionMin = 5;
      optionMax = 20;
      optionColor = ['#FFB90F', '#CD2626'];
      dataNew1.forEach(e => {
        e[2] = Number((Math.random() * 15).toFixed(1)) + 5;
      });
      this.chilledCurTemp = Number((Math.random() * 1).toFixed(1)) + 5;
      this.isGraphErr = true;
    }
    const option1 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        borderColor: 'red',
        borderWidth: 10,
        top: '20%'
      },
      xAxis: {
        type: 'category',
        data: locations1,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers1,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: optionMin,
        max: optionMax,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: optionColor,
          symbolSize: [optionMin, optionMax]
        }
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew1,
        label: {
          show: true,
          fontSize: 12
        },
        itemStyle: {
          borderWidth: 1.5,
          borderColor: 'rgba(50, 41, 41, 1)',
        },
        emphasis: {
          itemStyle: {
            borderColor: 'rgba(50, 41, 41, 1)',
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart1.setOption(option1);


    const myChart2 = echarts.init(document.getElementById('demo2'));
    const locations2 = ['17', '18', '19', '20', '21', '22', '23', '24', '25',
      '26', '27', '28', '29', '30', '31', '32'];
    const layers2 = ['B', 'A'];
    const dataNew2 = dataChill.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });

    const option2 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        borderColor: 'red',
        borderWidth: 10,
        top: '20%'
      },
      xAxis: {
        type: 'category',
        data: locations2,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers2,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: -5,
        max: 4,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: ['#00CD00', '#FFFF00'],
          symbolSize: [-5, 4]
        },
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew2,
        label: {
          show: true,
        },
        itemStyle: {
          borderWidth: 1.5,
          borderColor: 'rgba(50, 41, 41, 1)',
        },
        emphasis: {
          itemStyle: {
            borderColor: 'rgba(50, 41, 41, 1)',
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart2.setOption(option2);

    const myChart3 = echarts.init(document.getElementById('demo3'));
    const locations3 = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
      '10', '11', '12', '13', '14', '15', '16'];
    const layers3 = ['D', 'C'];
    const dataNew3 = dataChill.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });

    const option3 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        top: '20%'
      },
      xAxis: {
        type: 'category',
        data: locations3,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers3,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: -5,
        max: 4,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: ['#00CD00', '#FFFF00'],
          symbolSize: [-5, 4]
        },
      },
      itemStyle: {
        borderWidth: 1.5,
        borderColor: 'rgba(50, 41, 41, 1)',
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew3,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart3.setOption(option3);

    const myChart4 = echarts.init(document.getElementById('demo4'));
    const locations4 = ['17', '18', '19', '20', '21', '22', '23', '24', '25',
      '26', '27', '28', '29', '30', '31', '32'];
    const layers4 = ['D', 'C'];
    const dataNew4 = dataChill.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });

    const option4 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        top: '20%'
      },
      itemStyle: {
        borderWidth: 1.5,
        borderColor: 'rgba(50, 41, 41, 1)',
      },
      xAxis: {
        type: 'category',
        data: locations4,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers4,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: -5,
        max: 4,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: ['#00CD00', '#FFFF00'],
          symbolSize: [-5, 4]
        },
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew4,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart4.setOption(option4);

    const myChart5 = echarts.init(document.getElementById('demo5'));
    const locations5 = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
      '10', '11', '12', '13', '14', '15', '16'];
    const layers5 = ['F', 'E'];
    const dataNew5 = dataChill.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });

    const option5 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        top: '20%'
      },
      itemStyle: {
        borderWidth: 1.5,
        borderColor: 'rgba(50, 41, 41, 1)',
      },
      xAxis: {
        type: 'category',
        data: locations5,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers5,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: -5,
        max: 4,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: ['#00CD00', '#FFFF00'],
          symbolSize: [-5, 4]
        },
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew5,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart5.setOption(option5);

    const myChart6 = echarts.init(document.getElementById('demo6'));
    const locations6 = ['17', '18', '19', '20', '21', '22', '23', '24', '25',
      '26', '27', '28', '29', '30', '31', '32'];
    const layers6 = ['F', 'E'];
    const dataNew6 = dataChill.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });

    const option6 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        top: '20%'
      },
      itemStyle: {
        borderWidth: 1.5,
        borderColor: 'rgba(50, 41, 41, 1)',
      },
      xAxis: {
        type: 'category',
        data: locations6,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers6,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: -5,
        max: 4,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: ['#00CD00', '#FFFF00'],
          symbolSize: [-5, 4]
        },
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew6,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart6.setOption(option6);

    const myChart7 = echarts.init(document.getElementById('demo7'));
    const locations7 = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
      '10', '11', '12', '13', '14', '15', '16'];
    const layers7 = ['H', 'G'];
    const dataNew7 = dataFrozen.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });

    const option7 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        borderColor: 'red',
        borderWidth: 10,
        top: '20%'
      },
      xAxis: {
        type: 'category',
        data: locations7,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers7,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: -20,
        max: -10,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: ['#00BFFF', '#00CD00'],
          symbolSize: [-20, -10]
        },
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew7,
        label: {
          show: true,
        },
        itemStyle: {
          borderWidth: 1.5,
          borderColor: 'rgba(50, 41, 41, 1)',
        },
        emphasis: {
          itemStyle: {
            borderColor: 'rgba(50, 41, 41, 1)',
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart7.setOption(option7);


    const myChart8 = echarts.init(document.getElementById('demo8'));
    const locations8 = ['17', '18', '19', '20', '21', '22', '23', '24', '25',
      '26', '27', '28', '29', '30', '31', '32'];
    const layers8 = ['G', 'H'];
    const dataNew8 = dataFrozen.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });

    const option8 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        borderColor: 'red',
        borderWidth: 10,
        top: '20%'
      },
      xAxis: {
        type: 'category',
        data: locations8,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers8,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: -20,
        max: -10,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: ['#00BFFF', '#00CD00'],
          symbolSize: [-20, -10]
        },
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew8,
        label: {
          show: true,
        },
        itemStyle: {
          borderWidth: 1.5,
          borderColor: 'rgba(50, 41, 41, 1)',
        },
        emphasis: {
          itemStyle: {
            borderColor: 'rgba(50, 41, 41, 1)',
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart8.setOption(option8);

    const myChart9 = echarts.init(document.getElementById('demo9'));
    const locations9 = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
      '10', '11', '12', '13', '14', '15', '16'];
    const layers9 = ['J', 'I'];
    const dataNew9 = dataFrozen.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });

    const option9 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        top: '20%'
      },
      xAxis: {
        type: 'category',
        data: locations9,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers9,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: -20,
        max: -10,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: ['#00BFFF', '#00CD00'],
          symbolSize: [-20, -10]
        },
      },
      itemStyle: {
        borderWidth: 1.5,
        borderColor: 'rgba(50, 41, 41, 1)',
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew9,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart9.setOption(option9);

    const myChart10 = echarts.init(document.getElementById('demo10'));
    const locations10 = ['17', '18', '19', '20', '21', '22', '23', '24', '25',
      '26', '27', '28', '29', '30', '31', '32'];
    const layers10 = ['J', 'I'];
    const dataNew10 = dataFrozen.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });

    const option10 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        top: '20%'
      },
      itemStyle: {
        borderWidth: 1.5,
        borderColor: 'rgba(50, 41, 41, 1)',
      },
      xAxis: {
        type: 'category',
        data: locations10,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers10,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: -20,
        max: -10,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: ['#00BFFF', '#00CD00'],
          symbolSize: [-20, -10]
        },
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew10,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart10.setOption(option10);

    const myChart11 = echarts.init(document.getElementById('demo11'));
    const locations11 = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
      '10', '11', '12', '13', '14', '15', '16'];
    const layers11 = ['L', 'K'];
    const dataNew11 = dataFrozen.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });

    const option11 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        top: '20%'
      },
      itemStyle: {
        borderWidth: 1.5,
        borderColor: 'rgba(50, 41, 41, 1)',
      },
      xAxis: {
        type: 'category',
        data: locations11,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers11,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: -20,
        max: -10,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: ['#00BFFF', '#00CD00'],
          symbolSize: [-20, -10]
        },
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew11,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart11.setOption(option11);

    const myChart12 = echarts.init(document.getElementById('demo12'));
    const locations12 = ['17', '18', '19', '20', '21', '22', '23', '24', '25',
      '26', '27', '28', '29', '30', '31', '32'];
    const layers12 = ['L', 'K'];
    const dataNew12 = dataFrozen.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });

    const option12 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        top: '20%'
      },
      itemStyle: {
        borderWidth: 1.5,
        borderColor: 'rgba(50, 41, 41, 1)',
      },
      xAxis: {
        type: 'category',
        data: locations12,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers12,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: -20,
        max: -10,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: ['#00BFFF', '#00CD00'],
          symbolSize: [-20, -10]
        },
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew12,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart12.setOption(option12);

    const myChart13 = echarts.init(document.getElementById('demo13'));
    const locations13 = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
      '10', '11', '12', '13', '14', '15', '16'];
    const layers13 = ['N', 'M'];
    const dataNew13 = dataDeep.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });

    const option13 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        borderColor: 'red',
        borderWidth: 10,
        top: '20%'
      },
      xAxis: {
        type: 'category',
        data: locations13,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers13,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: -30,
        max: -25,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: ['#0000FF', '#00BFFF'],
          symbolSize: [-30, -25]
        },
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew13,
        label: {
          show: true,
        },
        itemStyle: {
          borderWidth: 1.5,
          borderColor: 'rgba(50, 41, 41, 1)',
        },
        emphasis: {
          itemStyle: {
            borderColor: 'rgba(50, 41, 41, 1)',
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart13.setOption(option13);


    const myChart14 = echarts.init(document.getElementById('demo14'));
    const locations14 = ['17', '18', '19', '20', '21', '22', '23', '24', '25',
      '26', '27', '28', '29', '30', '31', '32'];
    const layers14 = ['N', 'M'];
    const dataNew14 = dataDeep.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });

    const option14 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        borderColor: 'red',
        borderWidth: 10,
        top: '20%'
      },
      xAxis: {
        type: 'category',
        data: locations14,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers14,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: -30,
        max: -25,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: ['#0000FF', '#00BFFF'],
          symbolSize: [-30, -25]
        },
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew14,
        label: {
          show: true,
        },
        itemStyle: {
          borderWidth: 1.5,
          borderColor: 'rgba(50, 41, 41, 1)',
        },
        emphasis: {
          itemStyle: {
            borderColor: 'rgba(50, 41, 41, 1)',
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart14.setOption(option14);

    const myChart15 = echarts.init(document.getElementById('demo15'));
    const locations15 = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
      '10', '11', '12', '13', '14', '15', '16'];
    const layers15 = ['P', 'O'];
    const dataNew15 = dataDeep.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });

    const option15 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        top: '20%'
      },
      xAxis: {
        type: 'category',
        data: locations15,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers15,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: -30,
        max: -25,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: ['#0000FF', '#00BFFF'],
          symbolSize: [-30, -25]
        },
      },
      itemStyle: {
        borderWidth: 1.5,
        borderColor: 'rgba(50, 41, 41, 1)',
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew15,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart15.setOption(option15);

    const myChart16 = echarts.init(document.getElementById('demo16'));
    const locations16 = ['17', '18', '19', '20', '21', '22', '23', '24', '25',
      '26', '27', '28', '29', '30', '31', '32'];
    const layers16 = ['P', 'O'];
    const dataNew16 = dataDeep.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });

    const option16 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        top: '20%'
      },
      itemStyle: {
        borderWidth: 1.5,
        borderColor: 'rgba(50, 41, 41, 1)',
      },
      xAxis: {
        type: 'category',
        data: locations16,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers16,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: -30,
        max: -25,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: ['#0000FF', '#00BFFF'],
          symbolSize: [-30, -25]
        },
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew16,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart16.setOption(option16);

    const myChart17 = echarts.init(document.getElementById('demo17'));
    const locations17 = ['1', '2', '3', '4', '5', '6', '7', '8', '9',
      '10', '11', '12', '13', '14', '15', '16'];
    const layers17 = ['R', 'Q'];
    const dataNew17 = dataDeep.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });

    const option17 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        top: '20%'
      },
      itemStyle: {
        borderWidth: 1.5,
        borderColor: 'rgba(50, 41, 41, 1)',
      },
      xAxis: {
        type: 'category',
        data: locations17,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers17,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: -30,
        max: -25,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: ['#0000FF', '#00BFFF'],
          symbolSize: [-30, -25]
        },
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew17,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart17.setOption(option17);

    const myChart18 = echarts.init(document.getElementById('demo18'));
    const locations18 = ['17', '18', '19', '20', '21', '22', '23', '24', '25',
      '26', '27', '28', '29', '30', '31', '32'];
    const layers18 = ['R', 'Q'];
    const dataNew18 = dataDeep.map(item => {
      return [item[1], item[0], item[2] || '-'];
    });

    const option18 = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '30%',
        top: '20%'
      },
      itemStyle: {
        borderWidth: 1.5,
        borderColor: 'rgba(50, 41, 41, 1)',
      },
      xAxis: {
        type: 'category',
        data: locations18,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: layers18,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: false,
        min: -30,
        max: -25,
        calculable: true,
        itemHeight: 340,
        orient: 'horizontal',
        left: 'center',
        bottom: '25%',
        inRange: {
          color: ['#0000FF', '#00BFFF'],
          symbolSize: [-30, -25]
        },
      },
      series: [{
        name: 'Location',
        type: 'heatmap',
        data: dataNew18,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    myChart18.setOption(option18);



  }

  showHeatMap(whId: string): void {
    this.changeTabColor(whId, '#337ab7', '#337ab7', '#337ab7', 'black');
    this.warehouseOriginEntityList.forEach(element => {
      if (whId === element.wh_id) {
        element.isMapExpand = false;
        element.isHeatMapExpand = true;
        element.isListExpand = false;
        element.isDiagramExpand = false;
      }
    });
    // this.generateHeatMap();
    // this.generateHeatMap2();
  }

  // generateHeatMap(): void {
  //   const height = 600;
  //   const width = 600;
  //   this.heatmapInstance = h377.create({
  //     container: document.getElementById('point'),
  //     radius: 25
  //   });
  //   const ctx = this.heatmapInstance._renderer.ctx;
  //   this.heatmapInstance.setData(this.generateData());
  //   // setInterval(() => this.heatmapInstance.setData(this.generateData()), 4000);
  // }

  // generateData(): {} {
  //   let max = 2000000;
  //   const width = 750;
  //   const height1 = 200;
  //   const height2 = 400;
  //   const height3 = 600;
  //   let len = 170000;
  //   this.points = [];
  //   while (len--) {
  //     if (len > 70000 && len < 150000) {
  //       const val = Math.floor(Math.random() * 200);
  //       max = Math.max(max, val);
  //       const point = {
  //         x: Math.floor(Math.random() * width) + 500,
  //         y: Math.floor(Math.random() * height1),
  //         value: val
  //       };
  //       this.points.push(point);
  //     }
  //     else if (len > 10000 && len < 70000) {
  //       const val = Math.floor(Math.random() * 50);
  //       max = Math.max(max, val);
  //       const point = {
  //         x: Math.floor(Math.random() * width) + 500,
  //         y: Math.floor(Math.random() * height2),
  //         value: val
  //       };
  //       this.points.push(point);
  //     }
  //     else if (len < 50000) {
  //       const val = Math.floor(Math.random() * 100);
  //       max = Math.max(max, val);
  //       const point = {
  //         x: Math.floor(Math.random() * width) + 500,
  //         y: Math.floor(Math.random() * height3),
  //         value: val
  //       };
  //       this.points.push(point);
  //     }

  //   }
  //   let len2 = 30000;
  //   while (len2--) {
  //     const val = Math.floor(Math.random() * 100000);
  //     max = Math.max(max, val);
  //     const point2 = {
  //       x: Math.floor(Math.random() * 250) + 250,
  //       y: Math.floor(Math.random() * 600),
  //       value: val
  //     };
  //     this.points.push(point2);
  //   }

  //   const data = {
  //     max: max,
  //     data: this.points
  //   };

  //   return data;

  // }

  generateHeatMap2(): void {
    this.heatmapInstance = h377.create({
      container: document.getElementById('point'),
    });
    const ctx = this.heatmapInstance._renderer.ctx;
    // this.drawSensorLoc(ctx);
    setTimeout(() => this.drawHeatMap(ctx), 500);
    // this.drawHeatMap(ctx);
    // this.drawPoints(ctx);
    // this.drawHeatMap();
  }

  drawHeatMap(ctx): void {
    const height = 1000;
    const width = 1200;
    const drw0 = new T.TemperatureMap(ctx);
    drw0.setRandomPoints(4800, width, height);
    drw0.drawLow(5, 8, false, () => {
      // setInterval(() => this.drawPoints(ctx), 2000);
    });
  }

  // drawSensorLoc(ctx: any): void {
    // const iconUrl = '../assets/img/marker-icon.png';
    // const image = new Image();
    // image.src = iconUrl;
    // image.addEventListener('load', () => {
    //   ctx.drawImage(image, 685, 500);
    //   ctx.drawImage(image, 955, 500);
    //   ctx.drawImage(image, 685, 80);
    //   ctx.drawImage(image, 955, 80);
    //   ctx.drawImage(image, 685, 280);
    //   ctx.drawImage(image, 955, 280);
    // });
  // }

  // drawPoints(ctx: any): void {
    // const loc = [[695, 500, '4.1°C'], [965, 500, '4.2°C'],
    // [695, 80, '-30.1°C'], [965, 80, '-30°.4°C'],
    // [695, 280, '-10.2°C'], [965, 280, '-10.2°C']];
    // window.requestAnimationFrame( (timestamp) => {
    //   loc.forEach( t => {
    //     ctx.fillStyle = 'rgba(255, 255, 255, 128)';
    //     ctx.beginPath();
    //     ctx.lineWidth = 2;
    //     ctx.arc(t[0], t[1], 25, 0, Math.PI * 2, false);
    //     ctx.fill();
    //     ctx.lineWidth = 1;
    //     ctx.strokeStyle = 'red';
    //     ctx.beginPath();
    //     ctx.arc(t[0], t[1], 25, 0, Math.PI * 2, false);
    //     ctx.stroke();
    //     ctx.textAlign = 'center';
    //     ctx.textBaseline = 'middle';
    //     ctx.font = '15px "微软雅黑"';
    //     ctx.fillStyle = 'rgb(0, 0, 0)';
    //     ctx.fillText(t[2], t[0], t[1]);
    //   });
    // });
  // }

}
