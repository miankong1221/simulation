import { JsonProperty } from 'src/app/common/utils/json-type.mapper';

@JsonProperty({ clazz: WarehouseEntity })
export class WarehouseEntity {

    public wh_id: string;
    public wh_name: string;
    public zone_cnt: string;
    public sensor_cnt: string;
    public notification_cnt: string;
    public isExpand: boolean;
    public isMapExpand: boolean;
    public isListExpand: boolean;
    public isDiagramExpand: boolean;
    constructor() {
        this.wh_id = undefined;
        this.wh_name = undefined
        this.zone_cnt = undefined;
        this.sensor_cnt = undefined;
        this.notification_cnt = undefined;
        this.isExpand = false;
        this.isMapExpand = false;
        this.isListExpand = false;
        this.isDiagramExpand = false;
    }
}

export class WarehouseGraphData {
    time: any;
    zoneDataDto: ZoneDataDto[]
    constructor(){
        this.time = undefined;
        this.zoneDataDto = [];
    }
}


export class ZoneDataDto {
    whId: any;
    zone: any;
    time: any;
    temValue: any;
    humValue: any;
    constructor(){
        this.whId = undefined;
        this.zone = undefined;
        this.time = undefined;
        this.temValue = undefined;
        this.humValue = undefined;
    }
}

