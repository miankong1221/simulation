import { JsonProperty } from 'src/app/common/utils/json-type.mapper';

@JsonProperty({ clazz: WarehouseSimDto })
export class WarehouseSimDto {

    public wh_id: string;
    public name: string;

    constructor() {
        this.wh_id = undefined;
        this.name = undefined;
    }
}


export class SensorSimSynDto {
    public sid: string;
    public name: string;
    public whId: string;
    public category: string;
    public sampleIntervalSec: string;
    public valueRangeTempMin: string;
    public valueRangeTempMax: string;
    public valueRangeHumdMin: string;
    public valueRangeHumdMax: string;
    public sampleRangeTempMin: string;
    public sampleRangeTempMax: string;
    public sampleRangeHumdMin: string;
    public sampleRangeHumdMax: string;
    public exceptionSampleRangeTempMin: string;
    public exceptionSampleRangeTempMax: string;
    public exceptionSampleRangeHumdMin: string;
    public exceptionSampleRangeHumdMax: string;
    constructor() {
        this.sid = undefined;
        this.name = undefined;
        this.category = undefined;
        this.sampleIntervalSec = undefined;
        this.valueRangeTempMin = undefined;
        this.valueRangeTempMax = undefined;
        this.valueRangeHumdMin = undefined;
        this.valueRangeHumdMax = undefined;
        this.sampleRangeTempMin = undefined;
        this.sampleRangeTempMax = undefined;
        this.sampleRangeHumdMin = undefined;
        this.sampleRangeHumdMax = undefined;
        this.exceptionSampleRangeTempMin = undefined;
        this.exceptionSampleRangeTempMax = undefined;
        this.exceptionSampleRangeHumdMin = undefined;
        this.exceptionSampleRangeHumdMax = undefined;

    }
}


