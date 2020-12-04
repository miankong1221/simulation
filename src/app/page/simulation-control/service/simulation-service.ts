import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnvConst, WebApiUri } from 'src/app/common/const/env-const';
import { JsonTypeMapper } from 'src/app/common/utils/json-type.mapper';
import { WarehouseEntity } from '../entity/simulation-entity';

@Injectable({
    providedIn: 'root'
})
export class SimulationService {

    warehouseEvent = new BehaviorSubject([]);

    correctDataEvent = new BehaviorSubject([]);

    exceptionDataEvent = new BehaviorSubject([]);

    realTimeStartEvent = new BehaviorSubject([]);

    realTimeEndEvent = new BehaviorSubject([]);

    constructor(
        private http: HttpClient
    ) {
    }

    getAllWarehouseEvent(): Observable<WarehouseEntity[]> {
        return this.warehouseEvent.asObservable();
    }

    getAllWarehouse(): void {

        const url = EnvConst.DevSimulationConst.API_ROOT + WebApiUri.SIM_WAREHOUSES;
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

    generateCorrectData(whId: string, startTime: string, endTime: string): void {
        const req = {
            wh_id: whId,
            start: startTime,
            end: endTime
        };
        const url = EnvConst.DevSimulationConst.API_ROOT + '/simulation/api/v1/temperature/sensors/sim';
        this.http.post(url, req).subscribe((data: any) => {
            console.log('Success');
        });
    }

    generateExceptionData(whId: string, startTime: string, endTime: string): void {
        const req = {
            wh_id: whId,
            start: startTime,
            end: endTime
        };
        const url = EnvConst.DevSimulationConst.API_ROOT + '/simulation/api/v1/temperature/sensors/sim/exception';
        this.http.post(url, req).subscribe((data: any) => {
            console.log('Success');
        });
    }

    generateRealTimeStart(whId: string, intervalTime: string): void {
        const req = {
            wh_id: whId,
            interval: intervalTime,
        };
        const url = EnvConst.DevSimulationConst.API_ROOT + '/simulation/api/v1/temperature/warehouses/sim/start';
        this.http.post(url, req).subscribe((data: any) => {
            console.log('Success');
        });
    }

    generateRealTimeEnd(): void {
        const url = EnvConst.DevSimulationConst.API_ROOT + '/simulation/api/v1/temperature/warehouses/sim/stop';
        try {
            this.http.get(url).subscribe((data: any) => {
                console.log('Success');
            });
        } catch (error) {
            alert(error);
        }
        // this.http.get(url).subscribe((data: any) => {
        //     console.log('Success');
        // });
    }

}
