import { Component, OnInit } from '@angular/core';
import { SensorEntity } from '../monitoring/entity/sensor.entity';
import { WarehouseEntity, WarehouseGraphData, ZoneDataDto } from '../monitoring/entity/warehouse.entity';
import { ZoneEntity, ZoneLocation } from '../monitoring/entity/zone.entity';
import { Chart } from 'node_modules/chart.js/dist/Chart.js';
import { ActivatedRoute } from '@angular/router';
import { MonitoringService } from '../monitoring/service/monitoring-service';
declare var echarts: any;


@Component({
  selector: 'app-warehouse-detail',
  templateUrl: './warehouse-detail.component.html',
  styleUrls: ['./warehouse-detail.component.scss']
})
export class WarehouseDetailComponent implements OnInit {

  ctx: CanvasRenderingContext2D;

  warehouseEntityList: WarehouseEntity[];

  zoneEntityList: ZoneEntity[];

  sensorEntityList: SensorEntity[];

  isMapExpand: boolean;

  isListExpand: boolean;

  isDiagramExpand: boolean;

  curWhId: string;

  curWhName: string;

  zoneLocationList: ZoneLocation[];

  canvas: HTMLCanvasElement;

  currentUrl: any;

  isRealTime: boolean;

  warehouseGraphData: WarehouseGraphData[];

  warehouseRealTimeGraphData: WarehouseGraphData[];

  tempXAxisDataTemp: any[];

  tempSeriesDataTemp: any[];

  tempXAxisDataHumd: any[];

  tempSeriesDataHumd: any[];

  realInterval: any;

  constructor(
    public service: MonitoringService,
    private route: ActivatedRoute
  ) {
    this.warehouseEntityList = [];
    this.zoneEntityList = [];
    this.sensorEntityList = [];
    this.zoneLocationList = [];
    this.isMapExpand = false;
    this.isListExpand = false;
    this.isDiagramExpand = false;
    this.isRealTime = false;
  }

  ngOnInit(): void {

    this.curWhId = this.route.snapshot.queryParamMap.get('id');
    this.curWhName = this.route.snapshot.queryParamMap.get('name');
    this.service.getZoneLocation(this.curWhId);


    this.service.getSensorListEvent().subscribe((data: any[]) => {
      if (data.length > 0) {
        this.sensorEntityList = [];
        data.forEach((temp) => {
          let sensor = new SensorEntity();
          sensor.sensor_id = temp.sensor_id;
          sensor.sensor_name = temp.sensor_name;
          if(temp.tem_value_min && temp.tem_value_max){
            sensor.settingTemp = temp.tem_value_min + '°C ~' + temp.tem_value_max + '°C';
          }
          if (temp.hum_value_min && temp.hum_value_max) {
            sensor.settingHumidity = temp.hum_value_min + '% ~ ' + temp.hum_value_max+ '%';
          }
          sensor.cur_temp_value = temp.cur_temp_value;
          sensor.cur_hum_value = temp.cur_hum_value;
          sensor.date = temp.date
          this.sensorEntityList.push(sensor)
        })
      }
    })

    this.service.getZoneLocationEvent().subscribe((data: any[]) => {
      this.showMap()
      this.zoneLocationList = [];
      data.forEach((temp) => {
        let zoneLocation = new ZoneLocation();
        zoneLocation.wh_id = temp.wh_id;
        zoneLocation.zone = temp.zone;
        zoneLocation.x = temp.x;
        zoneLocation.y = temp.y
        this.zoneLocationList.push(zoneLocation)
      });
      if (data.length > 0) {
        this.loadImage(this.curWhId).then(() => {
          if (this.currentUrl !== "../assets/img/demo.jpg") {
            this.drawLocationDetail(this.ctx);
          }
        });
      } else{
        this.isMapExpand = false;
      }
    });

    this.service.getZoneListEvent().subscribe((data: any[]) => {
      if (data.length > 0) {
        data.forEach((temp) => {
          let zone = new ZoneEntity();
          zone.zone_name = temp.zone_name;
          zone.sensor_cnt = temp.sensor_cnt;
          zone.notification_cnt = temp.notification_cnt;
          zone.time = temp.time;
          zone.cur_zone_temp = temp.cur_zone_temp;
          zone.cur_zone_hum = temp.cur_zone_hum;
          this.zoneEntityList.push(zone);
        });
      }
    });

    this.service.getWarehouseGraphDataEvent().subscribe((data: any[]) => {
      this.warehouseGraphData = [];
      if (data.length > 0) {
        data.forEach((temp) => {
          let warehouseGraphData = new WarehouseGraphData();
          warehouseGraphData.time = temp.time;
          temp.zone_data_dtos.forEach((temp2)=>{
            let zoneData = new ZoneDataDto();
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
  }

  loadImage(whId: any) {
    this.canvas = document.getElementById("getCanvas") as HTMLCanvasElement;
    this.canvas.width = 880;
    this.canvas.height = 646;
    this.ctx = this.canvas.getContext("2d");
    if (whId === 'NAS06') {
      this.currentUrl = "../assets/img/NAS06.jpg";
    } else if (whId === 'NAS05') {
      this.currentUrl = "../assets/img/NAS05.jpg";
    } else {
      this.currentUrl = "../assets/img/demo.jpg";
    }
    return new Promise(resolve => {
      const image = new Image();
      if (whId) {
        image.src = this.currentUrl;
        image.addEventListener('load', () => {
          this.ctx.drawImage(image, 0, 0);
          resolve(image);
        });
      }
    });
  }

  showMap(): void {
    document.getElementById('map').style.color = "black";
    document.getElementById('list').style.color = "#337ab7";
    document.getElementById('diag').style.color = "#337ab7";
    this.isMapExpand = true;
    this.isListExpand = false;
    this.isDiagramExpand = false;
  }


  drawLocationDetail(ctx: any): void {
    this.zoneLocationList.forEach((zone) => {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.fillStyle = "orange";
      ctx.arc(zone.x, zone.y, 15, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.arc(zone.x, zone.y, 15, 0, Math.PI * 2, false);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "blue";
      ctx.stroke();
      ctx.font = '15px "微软雅黑"';
      ctx.fillStyle = "black";
      ctx.fillText(zone.zone, zone.x - 15, zone.y - 20);
    });
  }

  showList() {
    this.zoneEntityList = [];
    this.service.getZoneList(this.curWhId);
    document.getElementById('map').style.color = "#337ab7";
    document.getElementById('list').style.color = "black";
    document.getElementById('diag').style.color = "#337ab7";
    this.isMapExpand = false;
    this.isListExpand = true;
    this.isDiagramExpand = false;
    console.log(this.isListExpand);
  }

  showDiagram() {
    document.getElementById('map').style.color = "#337ab7";
    document.getElementById('list').style.color = "#337ab7";
    document.getElementById('diag').style.color = "black";
    this.isMapExpand = false;
    this.isListExpand = false;
    this.isDiagramExpand = true;
    let c = document.getElementById('canvas') as HTMLCanvasElement;
    let ctx = c.getContext("2d");
    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',
      // The data for our dataset
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'My First dataset',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [0, 10, 5, 2, 20, 30, 45]
        }]
      },
      options: {}
    });
  }


  zoneExpand(zoneId: any){
    console.log(zoneId);
    this.service.getSensorList(this.curWhId, zoneId);
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

  setGraphData() {
    let legendDataTemp = '';
    let legendDataHumd = '';
    let xAxisDataTemp = [];
    let xAxisDataHumd = [];
    let seriesDataTemp = [];
    let seriesDataHumd = [];
    let elementTempId = this.isRealTime === true ? "canvasTempRealTime" : "canvasTemp";
    let elementHumdId = this.isRealTime === true ? "canvasHumiRealTime" : "canvasHumidity";
    if (this.isRealTime) {
      this.warehouseRealTimeGraphData.forEach((temp) => {
        temp.zoneDataDto.forEach((temp2)=>{
          if(temp2.temValue){
            this.tempXAxisDataTemp.push(temp.time);
            legendDataTemp = "Temperture";
            this.tempSeriesDataTemp.push(temp.zoneDataDto);
          }
          if(temp2.humValue){
            this.tempXAxisDataHumd.push(temp.time);
            legendDataHumd = "Humidity";
            this.tempSeriesDataHumd.push(temp.zoneDataDto);
          }
      });
    });
  }else {
    this.warehouseGraphData.forEach((temp) => {
      temp.zoneDataDto.forEach((temp2) => {
        if (temp2.temValue){
          xAxisDataTemp.push(temp.time);
          legendDataTemp = "Temperture";
          seriesDataTemp.push(temp.zoneDataDto);
        }
        if(temp2.humValue){
          xAxisDataHumd.push(temp.time);
          legendDataHumd = "Humidity";
          seriesDataHumd.push(temp.zoneDataDto);
        }
    });
  });
    }
    if (legendDataTemp === "Temperture") {
      if(this.isRealTime === true){
        this.drawGraph(elementTempId, legendDataTemp, this.tempXAxisDataTemp, this.tempSeriesDataTemp)
      } else {
        this.drawGraph(elementTempId, legendDataTemp, xAxisDataTemp, seriesDataTemp)
      }
    } 
    if (legendDataHumd === "Humidity") {
      if(this.isRealTime === true) {
        this.drawGraphHum(elementTempId, legendDataTemp, this.tempXAxisDataHumd, this.tempSeriesDataHumd)
      }else{
        this.drawGraphHum(elementHumdId, legendDataHumd, xAxisDataHumd, seriesDataHumd)
      }
    }
  }

  drawGraph(elementId: any, legendData: any, xAxisData: any[], seriesData: any[]) {
    let zoneOneList: ZoneDataDto[];
    zoneOneList = [];
    let zoneTwoList: ZoneDataDto[];
    zoneTwoList = [];
    seriesData.forEach(temp => {
      zoneOneList.push(temp[0].temValue)
      zoneTwoList.push(temp[1].temValue)
    })
    let myChart = echarts.init(document.getElementById(elementId));
    var option = {
      title: {
        text: legendData
      },
      tooltip: {},
      legend: {
        data: legendData
      },
      xAxis: {
        data: xAxisData
      },
      yAxis: {},
      series: [{
        name: legendData,
        type: 'line',
        data: zoneOneList
      },
      {
        name: legendData,
        type: 'line',
        data: zoneTwoList
      },
    ]
    };
    myChart.setOption(option);
  }

  drawGraphHum(elementId: any, legendData: any, xAxisData: any[], seriesData: any[]) {
    let zoneOneList: ZoneDataDto[];
    zoneOneList = [];
    let zoneTwoList: ZoneDataDto[];
    zoneTwoList = [];
    seriesData.forEach(temp => {
      zoneOneList.push(temp[0].humValue)
      zoneTwoList.push(temp[1].humValue)
    })
    let myChart = echarts.init(document.getElementById(elementId));
    var option = {
      title: {
        text: legendData
      },
      tooltip: {},
      legend: {
        data: legendData
      },
      xAxis: {
        data: xAxisData
      },
      yAxis: {},
      series: [{
        name: legendData,
        type: 'line',
        data: zoneOneList
      },
      {
        name: legendData,
        type: 'line',
        data: zoneTwoList
      },
    ]
    };
    myChart.setOption(option);
  }

  getHistoryData(){
    if (this.realInterval) {
      clearInterval(this.realInterval)
    }
    this.isRealTime = false;
    document.getElementById("today").style.border = "5px solid #cccccc"
    this.service.getWarehouseGraphData(this.curWhId);
  }

  getRealTime(){
    this.isRealTime = true;
    document.getElementById("today").style.border = "1px solid #cccccc"
    this.service.getWarehouseGraphRealTimeData(this.curWhId);
    this.realInterval = setInterval(()=>{
      this.service.getWarehouseGraphRealTimeData(this.curWhId);
    },5000)
  }
}
