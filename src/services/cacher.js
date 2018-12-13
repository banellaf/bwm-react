import camelCase from 'camel-case';

let instance = null;

export class Cacher {
    cache = {};

    constructor(){
        if (!instance){
            instance = this;
        }
        return instance;
    }

    cacheValue(key, value){
        this.cache[camelCase(key)] = value;
    }

    getCachedValue(key){
        return this.cache[camelCase(key)];
    }

    isValueCached(key){
        this.getCachedValue(camelCase(key));
    }
}