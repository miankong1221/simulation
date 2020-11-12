import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnvConst } from 'src/app/common/const/env-const';
import { CommonDtoEntity } from 'src/app/common/entity/common.dto.entity';
import { JsonTypeMapper } from 'src/app/common/utils/json-type.mapper';
import { StringUtils } from 'src/app/common/utils/string.util';
import { SensorEntity } from '../entity/sensor.entity';
import { WarehouseEntity, WarehouseGraphData } from '../entity/warehouse.entity';
import { ZoneEntity, ZoneLocation } from '../entity/zone.entity';


@Injectable({
    providedIn: 'root'
})
export class MonitoringService {

    warehouseEvent = new BehaviorSubject([]);

    zoneLocationEvent = new BehaviorSubject([]);

    zoneListEvent = new BehaviorSubject([]);

    sensorListEvent = new BehaviorSubject([]);

    sensorHistoryEvent = new BehaviorSubject([]);

    sensorGraphDataEvent = new BehaviorSubject([]);

    sensorRealTimeDataEvent = new BehaviorSubject([]);

    warehouseGraphDataEvent = new BehaviorSubject([]);

    warehouseGraphRealTimeDataEvent = new BehaviorSubject([]);

    zoneGraphDataEvent = new BehaviorSubject([]);

    zoneGraphRealTimeDataEvent = new BehaviorSubject([]);

    constructor(
        private http: HttpClient
    ) {
    }

    getAllWarehouseEvent(): Observable<WarehouseEntity[]> {
        return this.warehouseEvent.asObservable();
    }

    getZoneLocationEvent(): Observable<ZoneLocation[]> {
        return this.zoneLocationEvent.asObservable();
    }

    getZoneListEvent(): Observable<ZoneEntity[]> {
        return this.zoneListEvent.asObservable();
    }

    getSensorListEvent(): Observable<SensorEntity[]> {
        return this.sensorListEvent.asObservable();
    }

    getSensorHistoryEvent(): Observable<any[]> {
        return this.sensorHistoryEvent.asObservable();
    }

    getSensorGraphDataEvent(): Observable<any[]> {
        return this.sensorGraphDataEvent.asObservable();
    }

    getSensorRealTimeDataEvent(): Observable<any[]> {
        return this.sensorRealTimeDataEvent.asObservable();
    }

    getWarehouseGraphDataEvent(): Observable<any[]> {
        return this.warehouseGraphDataEvent.asObservable();
    }

    getWarehouseRealTimeDataEvent(): Observable<any[]> {
        return this.warehouseGraphRealTimeDataEvent.asObservable();
    }

    getZoneGraphDataEvent(): Observable<any[]> {
        return this.zoneGraphDataEvent.asObservable();
    }

    getZoneRealTimeDataEvent(): Observable<any[]> {
        return this.zoneGraphRealTimeDataEvent.asObservable();
    }

    getAllWarehouse(): void {
        // call local json
        // const url = 'assets/json/monitoring/allWarehouses.json';
        const url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/monitor/warehouses';
        this.http.get(url).subscribe(
            // request success
            (data: any) => {
                const result = JsonTypeMapper.parse(WarehouseEntity, data.data) as WarehouseEntity[];
                this.warehouseEvent.next(result);
            },
            // request failure
            (data: any) => {
                console.log(data);
            }
        );
    }

    getZoneLocation(whId: any): void {
        const url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/monitor/warehouses/' + whId + '/zones/positions';
        this.http.get(url).subscribe((data: []) => {
            // const result =  JsonTypeMapper.parse(CommonDtoEntity, data);
            // this.zoneLocationEvent.next(result.data);
        });
    }

    getZoneList(whId: any): void {
        // call local json
        // const url = 'assets/json/monitoring/zoneList.json';
        const url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/monitor/warehouses/' + whId + '/zones';
        this.http.get(url).subscribe(
            // request success
            (data: any) => {
                const result = JsonTypeMapper.parse(ZoneEntity, data.data) as ZoneEntity[];
                this.zoneListEvent.next(result);
            },
            // request failure
            (data: any) => {
                console.log(data);
            }
        );
        // this.http.get(url).subscribe((data: []) => {
        // const result =  JsonTypeMapper.parse(CommonDtoEntity, data);
        // this.zoneListEvent.next(result.data);
        // });
    }

    getSensorList(whId: any, zoneId: any): void {
        // call local json
        // const url = 'assets/json/monitoring/sensorList.json';
        const url = EnvConst.DevExtentionConst.API_ROOT +
            '/wms-extension/api/v1/equipment/monitor/warehouses/' + whId + '/zones/' + zoneId + '/sensors';
        this.http.get(url).subscribe(
            // request success
            (data: any) => {
                const result = JsonTypeMapper.parse(SensorEntity, data.data) as SensorEntity[];
                result.forEach(temp => {
                    if (!StringUtils.isEmpty(temp.tem_value_min)) {
                        temp.settingTemp = temp.tem_value_min + '°C ~' + temp.tem_value_max + '°C';
                    }
                    if (!StringUtils.isEmpty(temp.hum_value_min)) {
                        temp.settingHumidity = temp.hum_value_min + '% ~ ' + temp.hum_value_max + '%';
                    }
                });
                this.sensorListEvent.next(result);
            },
            // request failure
            (data: any) => {
                console.log(data);
            }
        );
        // this.http.get(url).subscribe((data: []) => {
        //     const result = JsonTypeMapper.parse(CommonDtoEntity, data);
        // const result = JsonTypeMapper.parse(SensorEntity, data) as SensorEntity[];
        // result.data.forEach(temp => {
        //     temp.settingTemp = temp.tem_value_min + '°C ~' + temp.tem_value_max + '°C';
        //     temp.settingHumidity = temp.hum_value_min + '% ~ ' + temp.hum_value_max + '%';
        //   });
        // this.sensorListEvent.next(result);
        // });
    }

    getSenesorHistory(sensorId: string): void {
        const url = EnvConst.DevExtentionConst.API_ROOT +
            '/wms-extension/api/v1/equipment/monitor/sensors/' + sensorId + '/history';
        this.http.get(url).subscribe((data: []) => {
            this.sensorHistoryEvent.next(data);
        });
    }

    getSensorGraphData(sensorId: any, start: any, end: any): void {
        const url = EnvConst.DevExtentionConst.API_ROOT +
            '/wms-extension/api/v1/equipment/monitor/sensors/' + sensorId + '/data/start/' + start + '/end/' + end;
        this.http.get(url).subscribe(
            (data: any) => {
                // const result = JsonTypeMapper.parse(WarehouseGraphData, data.data) as WarehouseGraphData[];
                this.sensorGraphDataEvent.next(data.data);
            },
            // request failure
            (data: any) => {
                console.log(data);
            });
    }

    getRealTimeData(sensorId: any): void {
        // const url = 'assets/json/monitoring/sensorGraph.json';
        const url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/monitor/sensors/' + sensorId + '/data/realtime';
        this.http.get(url).subscribe(
            (data: any) => {
                // const result = JsonTypeMapper.parse(WarehouseGraphData, data.data) as WarehouseGraphData[];
                this.sensorRealTimeDataEvent.next(data.data);
            },
            // request failure
            (data: any) => {
                console.log(data);
            });
    }

    getWarehouseGraphData(whId: any): void {
        // get today
        const start = StringUtils.getToday();
        const end = StringUtils.getCurrentTime();
        const url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/monitor/warehouses/' + whId + '/zones/data/start/' + start + '/end/' + end;
        this.http.get(url).subscribe(
            // request success
            (data: any) => {
                // const result = JsonTypeMapper.parse(WarehouseGraphData, data.data) as WarehouseGraphData[];
                this.warehouseGraphDataEvent.next(data.data);
            },
            // request failure
            (data: any) => {
                console.log(data);
            });
        //     (data: []) => {
        //     this.warehouseGraphDataEvent.next(data);
        // });
    }

    getWarehouseGraphRealTimeData(whId: any): void {
        const url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/monitor/warehouses/' + whId + '/zones/data/realtime';
        this.http.get(url).subscribe(
            // request success
            (data: any) => {
                // const result = JsonTypeMapper.parse(WarehouseGraphData, data.data) as WarehouseGraphData[];
                this.warehouseGraphRealTimeDataEvent.next(data.data);
            },
            // request failure
            (data: any) => {
                console.log(data);
            });
    }

    getZoneGraphData(whId: any, zoneId: any): void {
        const start = StringUtils.getToday();
        const end = StringUtils.getCurrentTime();
        const url = EnvConst.DevExtentionConst.API_ROOT +
        '/wms-extension/api/v1/equipment/monitor/warehouses/' + whId + '/zones/' + zoneId + '/sensors/data/start/' + start + '/end/' + end;
        this.http.get(url).subscribe((data: []) => {
            this.zoneGraphDataEvent.next(data);
        });
    }

    getZoneGraphRealTimeData(whId: any, zoneId: any): void {
        const url = EnvConst.DevExtentionConst.API_ROOT +
            '/wms-extension/api/v1/equipment/monitor/warehouses/' + whId + '/zones/' + zoneId + '/sensors/data/realtime';
        this.http.get(url).subscribe((data: []) => {
            this.zoneGraphRealTimeDataEvent.next(data);
        });
    }
}
