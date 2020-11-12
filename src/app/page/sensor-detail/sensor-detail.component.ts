import { Component, OnInit } from '@angular/core';
import { SensorDetailGraphData, SensorEntity, SensorHistory } from '../monitoring/entity/sensor.entity';
import { WarehouseEntity } from '../monitoring/entity/warehouse.entity';
import { ZoneEntity } from '../monitoring/entity/zone.entity';
import { MonitoringService } from '../monitoring/service/monitoring-service';
import { ActivatedRoute } from '@angular/router';
import { StringUtils } from 'src/app/common/utils/string.util';
declare var echarts: any;

@Component({
  selector: 'app-sensor-detail',
  templateUrl: './sensor-detail.component.html',
  styleUrls: ['./sensor-detail.component.scss']
})
export class SensorDetailComponent implements OnInit {

  ctx: CanvasRenderingContext2D;

  warehouseEntityList: WarehouseEntity[];

  zoneEntityList: ZoneEntity[];

  sensorEntityList: SensorEntity[];

  isMapExpand: boolean;

  isListExpand: boolean;

  isDiagramExpand: boolean;

  curWhId: string;

  curZoneId: string;

  sensorId: string;

  curWhName: string;

  sensor: SensorEntity;

  sensorHistoryList: SensorHistory[];

  sensoGraphDataList: SensorDetailGraphData[];

  sensoGraphRealTimeDataList: SensorDetailGraphData[];

  total: any;

  isRealTime: boolean;

  realInterval: any;

  tempXAxisDataTemp: any[];

  tempSeriesDataTemp: any[];

  tempXAxisDataHumd: any[];

  tempSeriesDataHumd: any[];

  constructor(
    public service: MonitoringService,
    private route: ActivatedRoute
  ) {
    this.warehouseEntityList = [];
    this.zoneEntityList = [];
    this.isListExpand = false;
    this.sensorHistoryList = [];
    this.sensor = new SensorEntity();
    this.sensoGraphDataList = [];
    this.sensoGraphRealTimeDataList = [];
    this.isRealTime = false;
    this.tempXAxisDataTemp = [];
    this.tempSeriesDataTemp = [];
    this.tempXAxisDataHumd = [];
    this.tempSeriesDataHumd = [];
  }

  ngOnInit(): void {
    this.curWhId = this.route.snapshot.queryParamMap.get('whId');
    this.curWhName = this.route.snapshot.queryParamMap.get('whName');
    this.curZoneId = this.route.snapshot.queryParamMap.get('zoneId');
    this.sensorId = this.route.snapshot.queryParamMap.get('sensorId');
    document.getElementById('today').style.border = '5px solid #cccccc';
    this.service.getSensorList(this.curWhId, this.curZoneId);
    this.service.getSenesorHistory(this.sensorId);
    this.service.getSensorRealTimeDataEvent().subscribe((data: any[]) => {
      this.sensoGraphRealTimeDataList = [];
      if (data.length > 0) {
        data.forEach((temp) => {
          const sensorDetail = new SensorDetailGraphData();
          sensorDetail.sensorId = temp.sid;
          sensorDetail.date = temp.sample_time;
          if (temp.value.temperature) {
            sensorDetail.type = 'Temp';
            sensorDetail.temp = temp.value.temperature;
          }
          if (temp.value.humidity) {
            if (sensorDetail.type === 'Temp'){
              sensorDetail.type = 'Integrated';
            }else{
              sensorDetail.type = 'Humidity';
            }
            sensorDetail.humidity = temp.value.humidity;
          }
          this.sensoGraphRealTimeDataList.push(sensorDetail);
        });
      }
      this.setGraphData();
    });
    this.service.getSensorGraphDataEvent().subscribe((data: any[]) => {
      this.sensoGraphDataList = [];
      if (data.length > 0) {
        data.forEach((temp) => {
          const sensorDetail = new SensorDetailGraphData();
          sensorDetail.sensorId = temp.sid;
          sensorDetail.date = temp.sample_time;
          if (temp.value.temperature) {
            sensorDetail.type = 'Temp';
            sensorDetail.temp = temp.value.temperature;
          }
          if (temp.value.humidity) {
            if (sensorDetail.type === 'Temp'){
              sensorDetail.type = 'Integrated';
            }else{
              sensorDetail.type = 'Humidity';
            }
            sensorDetail.humidity = temp.value.humidity;
          }
          this.sensoGraphDataList.push(sensorDetail);
        });
      }
      this.setGraphData();
    });
    this.service.getSensorListEvent().subscribe((data: any[]) => {
      if (data.length > 0) {
        data.forEach((temp) => {
          if (temp.sensor_id === this.sensorId) {
            this.sensor.sensor_id = temp.sensor_id;
            this.sensor.sensor_name = temp.sensor_name;
            if (temp.tem_value_min && temp.tem_value_max) {
              this.sensor.settingTemp = temp.tem_value_min + '°C ~' + temp.tem_value_max + '°C';
            }
            if (temp.hum_value_min && temp.hum_value_max) {
              this.sensor.settingHumidity = temp.hum_value_min + '% ~' + temp.hum_value_max + '%';
            }
            this.sensor.cur_temp_value = temp.cur_temp_value;
            this.sensor.cur_hum_value = temp.cur_hum_value;
            this.sensor.date = temp.date;
          }
        });
      }
    });
    this.service.getSensorHistoryEvent().subscribe((data: any[]) => {
      this.total = String(data.length);
      this.isListExpand = true;
      if (data.length > 0) {
        data.forEach((temp) => {
          const sensorHistory = new SensorHistory();
          sensorHistory.sensorId = temp.sensor_id;
          sensorHistory.value = temp.value;
          sensorHistory.detail = temp.detail;
          sensorHistory.date = temp.date;
          this.sensorHistoryList.push(sensorHistory);
        });
      }
    });
  }


  showList(): void {
    document.getElementById('history').style.color = 'black';
    document.getElementById('diag').style.color = '#337ab7';
    this.isListExpand = true;
    this.isDiagramExpand = false;
  }

  showDiagram(): void {
    this.isRealTime = false;
    this.isListExpand = false;
    this.isDiagramExpand = true;
    document.getElementById('history').style.color = '#337ab7';
    document.getElementById('diag').style.color = 'black';
    this.getHistoryData();
  }

  getRealTime(): void {
    this.isRealTime = true;
    document.getElementById('today').style.border = '1px solid #cccccc';
    document.getElementById('realTime').style.border = '5px solid #cccccc';
    this.service.getRealTimeData(this.sensorId);
    this.realInterval = setInterval(() => {
      this.service.getRealTimeData(this.sensorId);
    }, 10000);
  }

  getHistoryData(): void {
    if (this.realInterval) {
      clearInterval(this.realInterval);
    }
    this.isRealTime = false;
    document.getElementById('realTime').style.border = '1px solid #cccccc';
    document.getElementById('today').style.border = '5px solid #cccccc';
    // get today
    const start = StringUtils.getToday();
    const end = StringUtils.getCurrentTime();
    this.service.getSensorGraphData(this.sensorId, start, end);
  }

  setGraphData(): void {
    let legendDataTemp = '';
    let legendDataHumd = '';
    const xAxisDataTemp = [];
    const xAxisDataHumd = [];
    const seriesDataTemp = [];
    const seriesDataHumd = [];
    const elementTempId = this.isRealTime === true ? 'canvasSenserDetailTempRealTime' : 'canvasSenserDetailTemp';
    const elementHumdId = this.isRealTime === true ? 'canvasSenserDetailHumiRealTime' : 'canvasSenserDetailHumidity';
    if (this.isRealTime) {
      this.sensoGraphRealTimeDataList.forEach((temp) => {
        if (temp.type === 'Integrated'){
          this.tempXAxisDataTemp.push(temp.date);
          legendDataTemp = 'Temperture';
          this.tempSeriesDataTemp.push(temp.temp);
          this.tempXAxisDataHumd.push(temp.date);
          legendDataHumd = 'Humidity';
          this.tempSeriesDataHumd.push(temp.humidity);
        }else if (temp.type === 'Temp') {
            this.tempXAxisDataTemp.push(temp.date);
            legendDataTemp = 'Temperture';
            this.tempSeriesDataTemp.push(temp.temp);
        }else if (temp.type === 'Humidity'){
            this.tempXAxisDataHumd.push(temp.date);
            legendDataHumd = 'Humidity';
            this.tempSeriesDataHumd.push(temp.humidity);
        }
      });
    } else {
      this.sensoGraphDataList.forEach((temp) => {
        if (temp.type === 'Integrated'){
          xAxisDataTemp.push(temp.date);
          legendDataTemp = 'Temperture';
          seriesDataTemp.push(temp.temp);
          xAxisDataHumd.push(temp.date);
          legendDataHumd = 'Humidity';
          seriesDataHumd.push(temp.humidity);
        }else if (temp.type === 'Temp') {
          xAxisDataTemp.push(temp.date);
          legendDataTemp = 'Temperture';
          seriesDataTemp.push(temp.temp);
        } else if (temp.type === 'Humidity') {
          xAxisDataHumd.push(temp.date);
          legendDataHumd = 'Humidity';
          seriesDataHumd.push(temp.humidity);
        }
      });
    }
    if (legendDataTemp === 'Temperture') {
      if (this.isRealTime === true){
        this.drawGraph(elementTempId, legendDataTemp, this.tempXAxisDataTemp, this.tempSeriesDataTemp);
      } else {
        this.drawGraph(elementTempId, legendDataTemp, xAxisDataTemp, seriesDataTemp);
      }
    }
    if (legendDataHumd === 'Humidity') {
      if (this.isRealTime === true) {
        this.drawGraph(elementHumdId, legendDataHumd, this.tempXAxisDataHumd, this.tempSeriesDataHumd);
      }else{
        this.drawGraph(elementHumdId, legendDataHumd, xAxisDataHumd, seriesDataHumd);
      }
    }
  }

  drawGraph(elementId: any, legendData: any, xAxisData: any[], seriesData: any[]): void {
    const myChart = echarts.init(document.getElementById(elementId));
    const option = {
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
        data: seriesData
      }]
    };
    myChart.setOption(option);
  }
}
