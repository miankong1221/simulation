export class ZoneProfileEntity {

    whId: any;
    zoneId: any;
    statisticType: any;
    positionX: any;
    positionY: any;
    isDraw: boolean;
    isReset: boolean;

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