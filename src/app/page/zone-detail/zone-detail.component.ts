import { Component, OnInit } from '@angular/core';
import { SensorEntity } from '../monitoring/entity/sensor.entity';
import { WarehouseEntity, ZoneDataDto } from '../monitoring/entity/warehouse.entity';
import { SensorDataModels, ZoneEntity, ZoneGraphData } from '../monitoring/entity/zone.entity';
import { ActivatedRoute } from '@angular/router';
import { MonitoringService } from '../monitoring/service/monitoring-service';
declare var echarts: any;

@Component({
  selector: 'app-zone-detail',
  templateUrl: './zone-detail.component.html',
  styleUrls: ['./zone-detail.component.scss']
})
export class ZoneDetailComponent implements OnInit {

  ctx: CanvasRenderingContext2D;

  warehouseEntityList: WarehouseEntity[];

  zoneEntityList: ZoneEntity[];

  sensorEntityList: SensorEntity[];

  isListExpand: boolean;

  isDiagramExpand: boolean;

  curWhId: string;

  curZoneId: string;

  curWhName: string;

  isRealTime: boolean;

  zoneGraphData: ZoneGraphData[];

  zoneRealTimeGraphData: ZoneGraphData[];

  tempXAxisDataTemp: any[];

  tempSeriesDataTemp: any[];

  tempXAxisDataHumd: any[];

  tempSeriesDataHumd: any[];

  constructor(
    private route: ActivatedRoute,
    public service: MonitoringService
  ) {
    this.zoneEntityList = [];
    this.sensorEntityList = [];
    this.isListExpand = false;
    this.isDiagramExpand = false;
    this.isRealTime = false;
    this.zoneGraphData = [];
    this.zoneRealTimeGraphData = [];
    this.tempXAxisDataTemp = [];
    this.tempSeriesDataTemp = [];
    this.tempXAxisDataHumd = [];
    this.tempSeriesDataHumd = [];
  }

  ngOnInit(): void {


    this.curWhName = this.route.snapshot.queryParamMap.get('whName');
    this.curWhId = this.route.snapshot.queryParamMap.get('whId');
    this.curZoneId = this.route.snapshot.queryParamMap.get('zoneId');

    this.service.getZoneGraphDataEvent().subscribe((data: any[]) => {
      this.zoneGraphData = [];
      if (data.length > 0) {
        data.forEach((temp) => {
          const zoneGraphData = new ZoneGraphData();
          zoneGraphData.time = temp.time;
          temp.sensor_data_models.forEach((temp2) => {
            const sensorDetail = new SensorDataModels();
            sensorDetail.sid = temp2.sid;
            sensorDetail.sampleTime = temp2.sample_time;
            if (temp2.value.temperature) {
              sensorDetail.humidity = temp2.value.temperature;
              sensorDetail.hasTemp = true;
            }
            if (temp2.value.humidity) {
              sensorDetail.humidity = temp2.value.humidity;
              sensorDetail.hasHumi = true;
            }
            zoneGraphData.sensorDataModels.push(sensorDetail);
          });
          this.zoneGraphData.push(zoneGraphData);
        });
      }
      this.setGraphData();
    });

    this.service.getZoneRealTimeDataEvent().subscribe((data: any[]) => {
      this.zoneRealTimeGraphData = [];
      if (data.length > 0) {
        data.forEach((temp) => {
          let zoneGraphData = new ZoneGraphData();
          zoneGraphData.time = temp.time;
          temp.sensor_data_models.forEach((temp2) => {
            let sensorDetail = new SensorDataModels()
            sensorDetail.sid = temp2.sid;
            sensorDetail.sampleTime = temp2.sample_time;
            if (temp2.tem_value) {
              sensorDetail.humidity = temp2.tem_value;
              sensorDetail.hasTemp = true;
            }
            if (temp2.hum_value) {
              sensorDetail.humidity = temp2.hum_value;
              sensorDetail.hasHumi = true;
            }
            zoneGraphData.sensorDataModels.push(sensorDetail);
          });
          this.zoneGraphData.push(zoneGraphData);
        });
      }
      this.setGraphData();
    });


    this.service.getSensorList(this.curWhId, this.curZoneId);
    this.service.getSensorListEvent().subscribe((data: any[]) => {
      if (data.length > 0) {
        data.forEach((temp) => {
          const sensor = new SensorEntity();
          sensor.sensor_id = temp.sensor_id;
          sensor.sensor_name = temp.sensor_name;
          if (temp.tem_value_min && temp.tem_value_max) {
            sensor.settingTemp = temp.tem_value_min + '°C ~ ' + temp.tem_value_max + '°C';
          }
          if (temp.hum_value_min && temp.hum_value_max) {
            sensor.settingHumidity = temp.hum_value_min + '% ~ ' + temp.hum_value_max + '%';
          }
          sensor.cur_temp_value = temp.cur_temp_value;
          sensor.cur_hum_value = temp.cur_hum_value;
          sensor.date = temp.date;
          this.sensorEntityList.push(sensor);
        });
      }
    });
    this.showList();
  }

  showList(): void{
    document.getElementById('list').style.color = 'black';
    document.getElementById('diag').style.color = '#337ab7';
    this.isListExpand = true;
    this.isDiagramExpand = false;
  }

  showDiagram(): void {
    document.getElementById('list').style.color = '#337ab7';
    document.getElementById('diag').style.color = 'black';
    this.isListExpand = false;
    this.isDiagramExpand = true;
  }


  zoneExpand(zoneId: any): void {
    console.log(zoneId);
    this.zoneEntityList.forEach(element => {
      if (zoneId === element.zone_name) {
        if (element.isExpand === true) {
          element.isExpand = false;
          document.getElementById(element.zone_name).textContent = 'Expand';
        } else {
          element.isExpand = true;
          document.getElementById(element.zone_name).textContent = 'Collapse';
        }
      }
    });
  }

  getHistoryData(): void {
    this.service.getZoneGraphData(this.curWhId, this.curZoneId);
  }

  getRealTime(): void {
    this.service.getZoneGraphRealTimeData(this.curWhId, this.curZoneId);
  }

  setGraphData(): void {
    let legendDataTemp = '';
    let legendDataHumd = '';
    let xAxisDataTemp = [];
    let xAxisDataHumd = [];
    let seriesDataTemp = [];
    let seriesDataHumd = [];
    let elementTempId = this.isRealTime === true ? 'canvasTempRealTime' : 'canvasTemp';
    let elementHumdId = this.isRealTime === true ? 'canvasHumiRealTime' : 'canvasHumidity';
    if (this.isRealTime) {
      this.zoneRealTimeGraphData.forEach((temp) => {
        temp.sensorDataModels.forEach((temp2) => {
          if (temp2.hasTemp === true) {
            this.tempXAxisDataTemp.push(temp.time);
            legendDataTemp = 'Temperture';
            this.tempSeriesDataTemp.push(temp.sensorDataModels);
          }
          if (temp2.hasHumi === true) {
            this.tempXAxisDataHumd.push(temp.time);
            legendDataHumd = 'Humidity';
            this.tempSeriesDataHumd.push(temp.sensorDataModels);
          }
        });
      });
    } else {
      this.zoneGraphData.forEach((temp) => {
        temp.sensorDataModels.forEach((temp2) => {
          if (temp2.hasTemp === true) {
            xAxisDataTemp.push(temp.time);
            legendDataTemp = 'Temperture';
            seriesDataTemp.push(temp.sensorDataModels);
          }
          if (temp2.hasHumi === true) {
            xAxisDataHumd.push(temp.time);
            legendDataHumd = 'Humidity';
            seriesDataHumd.push(temp.sensorDataModels);
          }
        });
      });
    }
    if (legendDataTemp === 'Temperture') {
      if (this.isRealTime === true) {
        this.drawGraph(elementTempId, legendDataTemp, this.tempXAxisDataTemp, this.tempSeriesDataTemp)
      } else {
        this.drawGraph(elementTempId, legendDataTemp, xAxisDataTemp, seriesDataTemp);
      }
    }
    if (legendDataHumd === 'Humidity') {
      if (this.isRealTime === true) {
        this.drawGraphHum(elementTempId, legendDataTemp, this.tempXAxisDataHumd, this.tempSeriesDataHumd)
      } else {
        this.drawGraphHum(elementHumdId, legendDataHumd, xAxisDataHumd, seriesDataHumd);
      }
    }
  }

  drawGraph(elementId: any, legendData: any, xAxisData: any[], seriesData: any[]): void {

    let myChart = echarts.init(document.getElementById(elementId));
    var option = {
      title: {
        text: legendData
      },
      tooltip: {},
      legend: {
        // data: [zoneOneName, zoneTwoName]
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
      series: [
        //   {
        //   name: zoneOneName,
        //   type: 'line',
        //   color: '#DC8243',
        //   data: zoneOneList
        // },
        // {
        //   name: zoneTwoName,
        //   type: 'line',
        //   color: '#4E72BE',
        //   data: zoneTwoList
        // }
      ]
    };
    let zoneTemp = []
    this.zoneGraphData.forEach((temp) => {
      temp.sensorDataModels.forEach((temp2) => {

      });
      // temp.array.forEach(element => {
      //   console.log(element)
      // });
      console.log(temp);

    });

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
    let myChart = echarts.init(document.getElementById(elementId));
    var option = {
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
}
