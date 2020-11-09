export class SensorEntity {
    whId: string;
    zoneId: string;
    sensor_id: string;
    sensor_name: string;
    settingTemp: string;
    settingHumidity: string;
    cur_temp_value: string;
    cur_hum_value: string;
    tem_value_min: string;
    tem_value_max: string;
    hum_value_min: string;
    hum_value_max: string;
    date: string;
    constructor() {
        this.whId = undefined;
        this.zoneId = undefined;
        this.sensor_id = undefined;
        this.sensor_name = undefined;
        this.settingTemp = undefined;
        this.settingHumidity = undefined;
        this.cur_temp_value = undefined;
        this.cur_hum_value = undefined;
        this.tem_value_min = undefined;
        this.tem_value_max = undefined;
        this.hum_value_min = undefined;
        this.hum_value_max = undefined;
        this.date = undefined;
    }
}

export class SensorHistory {
    sensorId: any;
    value: any;
    detail: any;
    date: any;
    constructor(){
        this.sensorId = undefined;
        this.value = undefined;
        this.detail = undefined;
        this.date = undefined;
    }
}


export class SensorDetailGraphData {
    sensorId: any;
    date: any;
    type: any;
    temp: any;
    humidity: any;
    constructor(){
        this.sensorId = undefined;
        this.date = undefined;
        this.type = undefined;
        this.temp = undefined;
        this.humidity = undefined;
    }
}