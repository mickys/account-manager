import { AvailableClasses as Binance } from "./modules/binance/class.index";

const ClassStore: any = [];

export default class DynamicClass {
    constructor() {
        this.collectClasses(Binance);
    }

    public collectClasses( object: any ) {
        for ( const name in object ) {
            if ( object[name] ) {
                ClassStore[name] = object[name];
            }
        }
    }

    public getInstance(className: string, opts?: any) {
        if (ClassStore[className] === undefined || ClassStore[className] === null) {
            throw new Error(`Class type of \'${className}\' is not in the store`);
        }
        return new ClassStore[className](opts);
    }
}
