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

    this.service.getZoneGraphDataEvent().subscribe((data: any) => {
      this.zoneGraphData = [];
      if (data.data && data.data.length > 0) {
        data.data.forEach((temp) => {
          const zoneGraphData = new ZoneGraphData();
          zoneGraphData.time = temp.time;
          temp.sensor_data_models.forEach((temp2) => {
            const sensorDetail = new SensorDataModels();
            sensorDetail.sid = temp2.sid;
            sensorDetail.sampleTime = temp2.sample_time;
            if (temp2.value.temperature) {
              sensorDetail.temperature = temp2.value.temperature;
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

    this.service.getZoneRealTimeDataEvent().subscribe((data: any) => {
      this.zoneRealTimeGraphData = [];
      if (data.data && data.data.length > 0) {
        data.data.forEach((temp) => {
          const zoneGraphData = new ZoneGraphData();
          zoneGraphData.time = temp.time;
          temp.sensor_data_models.forEach((temp2) => {
            const sensorDetail = new SensorDataModels();
            sensorDetail.sid = temp2.sid;
            sensorDetail.sampleTime = temp2.sample_time;
            if (temp2.value.temperature) {
              sensorDetail.temperature = temp2.value.temperature;
              sensorDetail.hasTemp = true;
            }
            if (temp2.value.humidity) {
              sensorDetail.humidity = temp2.value.humidity;
              sensorDetail.hasHumi = true;
            }
            zoneGraphData.sensorDataModels.push(sensorDetail);
          });
          this.zoneRealTimeGraphData.push(zoneGraphData);
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

  showList(): void {
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
    this.getHistoryData();
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
    document.getElementById('today').style.border = '3px solid #cccccc';
    document.getElementById('realTime').style.border = '3px solid #cccccc';
    this.service.getZoneGraphData(this.curWhId, this.curZoneId);
  }

  getRealTime(): void {
    this.isRealTime = true;
    // this.service.getZoneGraphRealTimeData(this.curWhId, this.curZoneId);
    setInterval(() => this.service.getZoneGraphRealTimeData(this.curWhId, this.curZoneId), 5000);
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
      this.zoneRealTimeGraphData.forEach((temp) => {
        this.tempXAxisDataTemp.push(temp.time);
        temp.sensorDataModels.forEach((temp2) => {
          if (temp2.hasTemp === true) {
            legendDataTemp = 'Temperture';
            this.tempSeriesDataTemp.push(temp2);
          }
          if (temp2.hasHumi === true) {
            legendDataHumd = 'Humidity';
            this.tempSeriesDataHumd.push(temp2);
          }
        });
      });
    } else {
      this.zoneGraphData.forEach((temp) => {
        xAxisDataTemp.push(temp.time);
        temp.sensorDataModels.forEach((temp2) => {
          if (temp2.hasTemp === true) {
            // xAxisDataTemp.push(temp.sensorDataModels[0].sampleTime);
            legendDataTemp = 'Temperture';
            seriesDataTemp.push(temp2);
          }
          if (temp2.hasHumi === true) {
            xAxisDataHumd.push(temp.time);
            legendDataHumd = 'Humidity';
            seriesDataHumd.push(temp2);
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
    // if (legendDataHumd === 'Humidity') {
    //   if (this.isRealTime === true) {
    //     this.drawGraphHum(elementTempId, legendDataTemp, this.tempXAxisDataHumd, this.tempSeriesDataHumd)
    //   } else {
    //     this.drawGraphHum(elementHumdId, legendDataHumd, xAxisDataHumd, seriesDataHumd);
    //   }
    // }
  }

  drawGraph(elementId: any, legendData: any, xAxisData: any[], seriesData: any[]): void {

    const sensor1 = 'SNTEM0001';
    const sensor2 = 'SNTEM0002';
    const sensor3 = 'SNTEM0003';
    const sensor4 = 'SNTEM0004';
    const sensor5 = 'SNTEM0005';
    const serise1 = [];
    const serise2 = [];
    const serise3 = [];
    const serise4 = [];
    const serise5 = [];
    seriesData.forEach((t1: any) => {
          if (t1.sid === sensor1) {
            serise1.push(t1.temperature);
          }
          if (t1.sid === sensor2) {
            serise2.push(t1.temperature);
          }
          if (t1.sid === sensor3) {
            serise3.push(t1.temperature);
          }
          if (t1.sid === sensor4) {
            serise4.push(t1.temperature);
          }
          if (t1.sid === sensor5) {
            serise5.push(t1.temperature);
          }
    });
    const myChart = echarts.init(document.getElementById(elementId));
    const option = {
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
          {
          name: sensor1,
          type: 'line',
          smooth: true,
          color: '#DC8243',
          data: serise1
        },
        {
          name: sensor2,
          type: 'line',
          smooth: true,
          color: '#4E72BE',
          data: serise2
        },
        {
          name: sensor3,
          type: 'line',
          smooth: true,
          color: '#9ACD32',
          data: serise3
        },
        {
          name: sensor4,
          type: 'line',
          smooth: true,
          color: '#FF00FF',
          data: serise4
        },
        {
          name: sensor5,
          type: 'line',
          smooth: true,
          color: '#696969',
          data: serise5
        }
      ]
    };
    myChart.setOption(option);
  }

  drawGraphHum(elementId: any, legendData: any, xAxisData: any[], seriesData: any[]): void {
    const sensor1 = 'SNTEM0001';
    const sensor2 = 'SNTEM0002';
    const sensor3 = 'SNTEM0003';
    const sensor4 = 'SNTEM0004';
    const sensor5 = 'SNTEM0005';
    const serise1 = [];
    const serise2 = [];
    const serise3 = [];
    const serise4 = [];
    const serise5 = [];
    seriesData.forEach((t1: any) => {
      // if (t.length > 1) {
        // t.forEach(t1 => {
          if (t1.sid === sensor1) {
            serise1.push(t1.humidity);
          }
          if (t1.sid === sensor2) {
            serise2.push(t1.humidity);
          }
          if (t1.sid === sensor3) {
            serise3.push(t1.humidity);
          }
          if (t1.sid === sensor4) {
            serise4.push(t1.humidity);
          }
          if (t1.sid === sensor5) {
            serise5.push(t1.humidity);
          }
        // });
      // } else {
      //   if (t[0].sid === sensor1) {
      //     serise1.push(t[0].humidity);
      //   }
      //   if (t[0].sid === sensor2) {
      //     serise2.push(t[0].humidity);
      //   }
      //   if (t[0].sid === sensor3) {
      //     serise3.push(t[0].humidity);
      //   }
      //   if (t[0].sid === sensor4) {
      //     serise4.push(t[0].humidity);
      //   }
      //   if (t[0].sid === sensor5) {
      //     serise5.push(t[0].humidity);
      //   }
      // }
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
        {
        name: sensor1,
        type: 'line',
        color: '#DC8243',
        data: serise1
      },
      {
        name: sensor2,
        type: 'line',
        color: '#4E72BE',
        data: serise2
      },
      {
        name: sensor3,
        type: 'line',
        color: '#9ACD32',
        data: serise3
      },
      {
        name: sensor4,
        type: 'line',
        color: '#FF00FF',
        data: serise4
      },
      {
        name: sensor5,
        type: 'line',
        color: '#696969',
        data: serise5
      }
    ]
    };
    myChart.setOption(option);
  }
}
