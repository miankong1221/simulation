import 'reflect-metadata';

export class ObjectUtils {
    public static isPrimitive(target: any): boolean {
        if (typeof target === 'string' || typeof target === 'number' ||
            typeof target === 'boolean') {
            return true;
        }
        return (target instanceof String || target === String ||
            target instanceof Number || target === Number ||
            target instanceof Boolean || target === Boolean);
    }

    public static isFunction(target: any): boolean {
        return target instanceof Function;
    }

    public static isArray(target: any): boolean {
        return target === Array || Array.isArray(target) || target instanceof Array;
    }

    public static getClass(target: any, propertyName: string): any {
        return Reflect.getMetadata('design:type', target, propertyName);
    }

    public static clone(target: any): any {
        if (target == null) {
            return null;
        }
        const cloneObject = new (target.constructor as any)();
        for (const attr in target) {
            cloneObject[attr] = (typeof target[attr] === 'object') ? this.clone(target[attr]) : target[attr];
        }
        return cloneObject;
    }

    public static isEquals(a: any, b: any): boolean {

        const isArray = Array.isArray;
        const keyList = Object.keys;
        const hasProp = Object.prototype.hasOwnProperty;

        if (a === b) { return true; }

        if (a && b && typeof a === 'object' && typeof b === 'object') {
            const arrA = isArray(a);
            const arrB = isArray(b);
            let i;
            let length;
            let key;

            if (arrA && arrB) {
                length = a.length;
                if (length !== b.length) { return false; }
                for (i = length; i-- !== 0;) {
                    if (!ObjectUtils.isEquals(a[i], b[i])) { return false; }
                }
                return true;
            }

            if (arrA !== arrB) { return false; }

            const dateA = a instanceof Date;
            const dateB = b instanceof Date;
            if (dateA !== dateB) { return false; }
            if (dateA && dateB) { return a.getTime() === b.getTime(); }

            const regexpA = a instanceof RegExp;
            const regexpB = b instanceof RegExp;
            if (regexpA !== regexpB) { return false; }
            if (regexpA && regexpB) { return a.toString() === b.toString(); }

            const keys = keyList(a);
            length = keys.length;

            if (length !== keyList(b).length) {
                return false;
            }

            for (i = length; i-- !== 0;) {
                if (!hasProp.call(b, keys[i])) { return false; }
            }

            for (i = length; i-- !== 0;) {
                key = keys[i];
                if (!ObjectUtils.isEquals(a[key], b[key])) { return false; }
            }

            return true;
        }

        return a !== a && b !== b;
    }
}
