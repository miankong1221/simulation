import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnvConst } from 'src/app/common/const/env-const';
import { JsonTypeMapper } from 'src/app/common/utils/json-type.mapper';
import { WarehouseEntity, ZoneProfileEntity } from '../entity/zone-profile-entity';

@Injectable({
    providedIn: 'root'
})
export class ZoneProfileService {

    whEvent = new BehaviorSubject(WarehouseEntity[0]);

    zoneEvent = new BehaviorSubject([]);

    constructor(
        private http: HttpClient
    ) {
    }

    getWhEvent(): Observable<WarehouseEntity[]> {
        return this.whEvent.asObservable();
    }

    getWarehouseList(): void {
        // call local json
        // const url = 'assets/json/zone-profile/warehouses.json';
        // call API
        const url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/warehouses';
        this.http.get(url).subscribe(
            // request success
            (data: any) => {
                const result = JsonTypeMapper.parse(WarehouseEntity, data.data) as WarehouseEntity[];
                this.whEvent.next(result);
            },
            // request failure
            (data: any) => {
                console.log(data);
            }
        );
    }

    getZoneListByWhEvent(): Observable<any[]> {
        return this.zoneEvent.asObservable();
    }

    getZoneListByWarehouse(whId: any, page?: any): void {
        // call local json
        // const url = 'assets/json/zone-profile/warehouses-zone.json';
        // call API
        const url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/warehouses/' + whId + '/zones/profiles/pages/';
        this.http.get(url).subscribe(
            // request success
            (data: any) => {
                const result = JsonTypeMapper.parse(ZoneProfileEntity, data.data) as ZoneProfileEntity[];
                this.zoneEvent.next(result);
            },
            // request failure
            (data: any) => {
                console.log(data);
            }
        );
        // this.http.get(url).subscribe((data: []) => {
        //     this.zoneEvent.next(data);
        // });
    }

    sendPosition(req: any): void{
        const url = EnvConst.DevExtentionConst.API_ROOT + '/wms-extension/api/v1/equipment/zones/positions';
        this.http.post(url, req).subscribe(() => {
          console.log('success');
        });
    }

    // deletePosition(whId: any, zoneId: any){
    //     let url = EnvConst.DevConst.API_ROOT + 'wms-extension/api/v1/equipment/warehouses/' + whId + '/zones/' + zoneId + '/positions';
    //     this.http.delete(url).subscribe(() => {
    //         console.log('success')
    //       })
    // }
}
