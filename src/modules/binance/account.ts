import { GenericAccount, IaccountOptions } from "../../core/account";
import { BigNumber } from "bignumber.js";
import binance from "node-binance-api";

export class BinanceAccount extends GenericAccount {
    public client;
    public defaultGasPriceInGwei: number = 30;

    private isLoggedIn: boolean = false;

    constructor(accountOptions: IaccountOptions) {
        super(accountOptions);

        this.client =  new binance().options({
            APIKEY: accountOptions.apiKey,
            APISECRET: accountOptions.apiSecret,
            useServerTime: accountOptions.useServerTime,
            test: accountOptions.sandbox,
        });
    }

    public withdraw(
        assetSymbol: string,
        address: string,
        amount: BigNumber,
        addressTag?: string,
        actionName?: string,
    ): Promise <number> {

        addressTag = addressTag || "1";
        actionName = actionName || 'API Withdraw';

        return new Promise((resolve, reject) => {
            try {
                this.client.withdraw(
                    assetSymbol,
                    address,
                    amount.toString(),
                    addressTag,
                    ((error, response) => {
                        // crappy API returning everything in response..
                        if (response.success === false) {
                            reject(response.msg);
                        } else {
                            resolve(response.msg);
                        }
                    }),
                    actionName,
                );
            } catch (error) {
                throw new Error("call:" + error);
            }
        });
    }

    public transferToSubAccount(
        assetSymbol: string,
        amount: BigNumber,
    ): Promise <number> {

        return new Promise((resolve, reject) => {
            try {
                this.client.mgTransferMainToMargin(
                    assetSymbol,
                    amount.toString(),
                    ((error, response) => {
                        if (response) {
                            resolve(response);
                        }
                    }),
                );
            } catch (error) {
                throw new Error("call:" + error);
            }
        });
    }

    public transferFromSubAccount(
        assetSymbol: string,
        amount: BigNumber,
    ): Promise <number> {

        return new Promise((resolve, reject) => {
            try {
                this.client.mgTransferMarginToMain(
                    assetSymbol,
                    amount.toString(),
                    ((error, response) => {
                        if (response) {
                            resolve(response);
                        }
                    }),
                );
            } catch (error) {
                throw new Error("call:" + error);
            }
        });
    }

}
