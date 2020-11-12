import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnvConst } from 'src/app/common/const/env-const';
import { CommonDtoEntity } from 'src/app/common/entity/common.dto.entity';
import { JsonTypeMapper } from 'src/app/common/utils/json-type.mapper';
import { SensorSimSynDto, WarehouseSimDto } from '../entity/warehouse.entity';


@Injectable({
    providedIn: 'root'
})
export class SensorMasterDataService {

    warehouseEvent = new BehaviorSubject([]);
    sensorEvent = new BehaviorSubject([]);

    constructor(
        private http: HttpClient
    ) {
    }

    getAllWarehouseEvent(): Observable<WarehouseSimDto[]> {
        return this.warehouseEvent.asObservable();
    }
    getSensorByWarehouseEvent(): Observable<any[]> {
        return this.sensorEvent.asObservable();
    }

    getAllWarehouse(): void {
        // call local json
        // const url = 'assets/json/monitoring/allWarehouses.json';
        const url = EnvConst.DevSimulationConst.API_ROOT + '/simulation/api/v1/temperature/warehouses';
        this.http.get(url).subscribe(
            // request success
            (data: any) => {
                const result = JsonTypeMapper.parse(WarehouseSimDto, data.data) as WarehouseSimDto[];
                this.warehouseEvent.next(result);
            },
            // request failure
            (data: any) => {
                console.log(data);
            }
        );
    }

    getSensorByWarehouse(whId: string): void {
        // call local json
        // const url = 'assets/json/monitoring/allWarehouses.json';
        const url = EnvConst.DevSimulationConst.API_ROOT + '/simulation/api/v1/temperature/warehouses/' + whId + '/sensors/';
        this.http.get(url).subscribe((data: any) => {
            this.sensorEvent.next(data.data);
        });
    }

    addSensor(request: any): void {
        const url = EnvConst.DevSimulationConst.API_ROOT + '/simulation/api/v1/temperature/sensors';
        try {
            this.http.post(url, request).subscribe(
            (data: any) => {
                console.log('--------------' + data);
            },
            (data: any) => {
                console.log('--------------' + data);
            });
        } catch (error) {
            alert(error);
        }
        // this.http.post(url, request).subscribe((data: any) => {
        //     console.log('success');
        // });

    }

    deleteSensor(sensorId: string): void {
        const url = EnvConst.DevSimulationConst.API_ROOT + '/simulation/api/v1/temperature/sensors/' + sensorId;
        this.http.delete(url).subscribe((data: any) => {
            console.log('success');
        });
    }

}
