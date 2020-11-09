export class ZoneEntity {
    whId: any;
    zone_name: any;
    isExpand: boolean;
    sensor_cnt: any;
    notification_cnt: any;
    cur_zone_temp: any;
    time: any;
    data: any;
    cur_zone_hum: any;
    constructor() {
        this.whId = undefined;
        this.zone_name = undefined;
        this.isExpand = false;
        this.data = undefined;
        this.sensor_cnt = undefined;
        this.notification_cnt = undefined;
        this.time = undefined;
        this.cur_zone_temp = undefined;
        this.cur_zone_hum = undefined;
    }
}


export class ZoneLocation {
    public wh_id: string;
    public zone: string;
    public x: number;
    public y: number;
    constructor() {
        this.wh_id = undefined;
        this.zone = undefined;
        this.x = 0;
        this.y = 0;
    }
}

export class ZoneGraphData {
    time: any;
    sensorDataModels: SensorDataModels[];
  array: any;
    constructor(){
        this.time = undefined;
        this.sensorDataModels = [];
    }

}

export class SensorDataModels {
    sid: any;
    sampleTime: any;
    temperature: any;
    humidity: any;
    hasTemp: boolean;
    hasHumi: boolean;
    constructor(){
        this.sid = undefined;
        this.sampleTime = undefined;
        this.temperature = undefined;
        this.humidity = undefined;
        this.hasTemp = false;
        this.hasHumi = false
    }
}
