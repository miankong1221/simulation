import { JsonProperty } from 'src/app/common/utils/json-type.mapper';

@JsonProperty({ clazz: ZoneProfileEntity })
export class ZoneProfileEntity {

    @JsonProperty('wh_id')
    public whId: string;
    @JsonProperty('zone')
    public zoneId: string;
    @JsonProperty('algorithm')
    public statisticType: string;
    @JsonProperty('x')
    public positionX: any;
    @JsonProperty('y')
    public positionY: any;
    public isDraw: boolean;
    public isReset: boolean;

    constructor(){
        this.whId = undefined;
        this.zoneId = undefined;
        this.statisticType = undefined;
        this.positionX = undefined;
        this.positionY = undefined;
        this.isDraw = false;
        this.isReset = false;
    }

}

export class WarehouseEntity {
    wh_id: any;
    name: any;
    constructor(){
        this.wh_id = undefined;
        this.name = undefined;
    }
}
