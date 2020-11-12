import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { EnvConst } from 'src/app/common/const/env-const';
import { JsonTypeMapper } from 'src/app/common/utils/json-type.mapper';
import { SensorDetail, WarehouseMaster } from '../entity/masterDataEntity';


@Injectable({
    providedIn: 'root'
})
export class MasterDataMappingService {

    warehouseEvent = new BehaviorSubject([]);

    sensorEvent = new BehaviorSubject([]);

    constructor(
        private http: HttpClient
    ) {
    }

    getWarehouseEvent(): Observable<WarehouseMaster[]> {
        return this.warehouseEvent.asObservable();
    }

    getSenesorEvent(): Observable<SensorDetail[]> {
        return this.sensorEvent.asObservable();
    }

    getWarehouse(): void {
        // const url = 'assets/json/monitoring/allWarehouses.json';
        const url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/master/warehouses/zones';
        this.http.get(url).subscribe(
            // request success
            (data: any) => {
                const result = JsonTypeMapper.parse(WarehouseMaster, data.data) as WarehouseMaster[];
                this.warehouseEvent.next(result);
            },
            // request failure
            (data: any) => {
                console.log(data);
            }
        );
    }

    getSensorList(whId: string, curZone: string): void {
        // call sensor api
        const url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/master/warehouses/' + whId + '/zone/' + curZone + '/sensors';
        this.http.get(url).subscribe(
            // request success
            (data: any) => {
                const result = JsonTypeMapper.parse(SensorDetail, data.data) as SensorDetail[];
                this.sensorEvent.next(result);
            },
            // request failure
            (data: any) => {
                console.log(data);
            }
        );
    }
}
