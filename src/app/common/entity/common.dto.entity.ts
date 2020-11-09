import { JsonProperty } from '../utils/json-type.mapper';

@JsonProperty({ clazz: CommonDtoEntity })
export class CommonDtoEntity<T> {

    public data: T;

    public code: string;

    public message: string;

    constructor() {
        this.data = undefined;
        this.code = undefined;
        this.message = undefined;
    }

}
