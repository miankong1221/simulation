import 'reflect-metadata';

import { ObjectUtils } from '../utils/object.utils';

export interface PropertyMetadata<T> {
    name?: string;
    clazz?: new () => T;
}

export function JsonProperty<T>(metadata?: PropertyMetadata<T> | string): any {
    let name: any;
    let clazz: any;
    if (metadata instanceof String || typeof metadata === 'string') {
        name = metadata;
    } else {
        const metadataObj = metadata as PropertyMetadata<T>;
        name = metadataObj.name;
        clazz = metadataObj.clazz;
    }
    return Reflect.metadata('jsonProperty', {
        name: name,
        clazz: clazz
    });
}

export class JsonTypeMapper {
    public static getJsonProperty<T>(target: any, propertyName: string): PropertyMetadata<T> {
        return Reflect.getMetadata('jsonProperty', target, propertyName);
    }

    public static parse<T>(clazz: new () => T, jsonObject: any) {
        if (jsonObject == null) {
            return null;
        }

        if (ObjectUtils.isArray(jsonObject)) {
            return jsonObject.map((item: any) => JsonTypeMapper.parse(clazz, item));
        }

        const obj: any = new clazz();
        Object.keys(obj).forEach((key) => {
            const propMetadata = JsonTypeMapper.getJsonProperty(obj, key);
            if (propMetadata) {
                const propName = propMetadata.name || key;
                const t = jsonObject[propName];
                const propValue = jsonObject[propName] || {};
                const propType = ObjectUtils.getClass(obj, key);
                if (ObjectUtils.isPrimitive(propType) || propMetadata.clazz === undefined) {
                    obj[key] = propValue;

                } else if (ObjectUtils.isArray(propType)) {
                    obj[key] = propValue.map((item: any) => {
                        if (!ObjectUtils.isPrimitive(item)) {
                            JsonTypeMapper.parse(propMetadata.clazz, item);
                        }
                    });
                } else {
                    obj[key] = JsonTypeMapper.parse(propType, propValue);
                }

            } else {
                if (jsonObject && jsonObject[key] !== undefined) {
                    obj[key] = jsonObject[key];
                }
            }
        });
        return obj;
    }
}
