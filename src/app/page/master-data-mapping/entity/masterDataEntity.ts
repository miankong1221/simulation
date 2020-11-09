export class SensorDetail {
    zone: any;
    sensorId: any;
    sensorName: any;
    category: any;
    sampleInterval: any;
    minHumidity: any;
    maxHumidity: any;
    minTemp: any;
    maxTemp: any;
    constructor() {
        this.zone = undefined;
        this.sensorId = undefined;
        this.sensorName = undefined;
        this.category = undefined;
        this.sampleInterval = undefined;
        this.minHumidity = undefined;
        this.maxHumidity = undefined;
        this.minTemp = undefined;
        this.maxTemp = undefined;
    }
}

export class WarehouseMaster {
    wh_id: any;
    wh_name: any;
    zone_names: any[];
    constructor() {
        this.wh_id = undefined;
        this.wh_name = undefined;
        this.zone_names = []
    }
}



