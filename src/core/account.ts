import { BigNumber } from "bignumber.js";

export interface IaccountOptions {
    apiKey?: string;
    apiSecret?: string;
    useServerTime?: boolean;
    sandbox: boolean;
}

export abstract class GenericAccount {

    public static getImplementedClassName(name: string) {
        name = name.toLowerCase();
        return name.charAt(0).toUpperCase() + name.slice(1) + "Account";
    }

    public apiKey: string = "";
    public apiSecret: string = "";
    public useServerTime: boolean = false;
    public sandbox: boolean = false;

    constructor(accountOptions: IaccountOptions) {
        this.apiKey = accountOptions.apiKey;
        this.apiSecret = accountOptions.apiSecret;
        this.useServerTime = accountOptions.useServerTime;
        this.sandbox = accountOptions.sandbox;
    }

    public abstract withdraw( assetSymbol: string, address: string, amount: BigNumber, addressTag?: string, actionName?: string): Promise <number>;
    public abstract transferToSubAccount( assetSymbol: string, amount: BigNumber): Promise <number>;
    public abstract transferToSubAccount( assetSymbol: string, amount: BigNumber): Promise <number>;
}
