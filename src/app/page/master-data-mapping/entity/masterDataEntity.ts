import { JsonProperty } from 'src/app/common/utils/json-type.mapper';

@JsonProperty({ clazz: SensorDetail })
export class SensorDetail {
    @JsonProperty('zone')
    zone: string;
    @JsonProperty('sensor_id')
    sensorId: string;
    @JsonProperty('sensor_name')
    sensorName: string;
    @JsonProperty('category')
    category: string;
    @JsonProperty('sample_interval_sec')
    sampleInterval: string;
    @JsonProperty('hum_value_min')
    minHumidity: string;
    @JsonProperty('hum_value_max')
    maxHumidity: string;
    @JsonProperty('tem_value_min')
    minTemp: string;
    @JsonProperty('tem_value_max')
    maxTemp: string;
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


@JsonProperty({ clazz: WarehouseMaster })
export class WarehouseMaster {
    @JsonProperty('wh_id')
    whId: string;
    @JsonProperty('wh_name')
    whName: string;
    @JsonProperty('zone_names')
    zoneNames: string[];
    constructor() {
        this.whId = undefined;
        this.whName = undefined;
        this.zoneNames = [];
    }
}








