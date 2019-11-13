import { assert } from "chai";
import mocha from "mocha";
import { BigNumber } from "bignumber.js";

// API Key:: srnDzub02E8pzq1bcqYlOnzykeUwzi0OQWFWtj21JMAok8ZDkLVD83Y9PtdmE6Yl
// Secret Key:: ZYtMgTv3nbHP25e0hYT1NlduJU5CTk4nCeGijrh1p2gI05iWbbHkM95L1zYSuKdb

import { Manager, Modules } from "../src/index";
import { GenericAccount } from "../src/core/account";

async function assertThrowsAsync(fn, regExp) {
    let f = () => {
        //
    };
    try {
      await fn();
    } catch (e) {
      f = () => { throw e; };
    } finally {
      assert.throws(f, regExp);
    }
  }
describe("Binance", async () => {

    const defaultManager: Manager = new Manager();
    const DynamicClassName = GenericAccount.getImplementedClassName( Modules[Modules.BINANCE] );
    const account: GenericAccount = defaultManager.getClassMapper().getInstance(
        DynamicClassName,
        {
            apiKey: "srnDzub02E8pzq1bcqYlOnzykeUwzi0OQWFWtj21JMAok8ZDkLVD83Y9PtdmE6Yl",
            apiSecret: "ZYtMgTv3nbHP25e0hYT1NlduJU5CTk4nCeGijrh1p2gI05iWbbHkM95L1zYSuKdb",
            useServerTime: true,
            sandbox: true,
        },
    );
    const module = Modules.BINANCE;
    defaultManager.importAccount( module, account );

    describe("import one Binance account", async () => {

        it("wallet should have 1 account", async () => {
            const getAccounts = defaultManager.getAccounts(module);
            assert.equal( getAccounts.length, 1, "getAccounts length does not match" );
        });

        it("should create first account with valid class", async () => {
            const getAccount = defaultManager.getAccounts(module)[0];
            const getIndex = defaultManager.accounts.get(module)[0];
            assert.equal( getAccount.constructor.name, DynamicClassName, "class does not match expected" );
            assert.equal( account, getAccount, "Accounts do not match" );
            assert.equal( account, getIndex, "Accounts do not match" );
        });

        it("should create first account with valid class", async () => {
            const getAccount = defaultManager.getAccounts(module)[0];
            const getIndex = defaultManager.accounts.get(module)[0];
            assert.equal( getAccount.constructor.name, DynamicClassName, "class does not match expected" );
            assert.equal( account, getAccount, "Accounts do not match" );
            assert.equal( account, getIndex, "Accounts do not match" );
        });

    });

    describe("withdraw()", async () => {

        it("should throw if account does not have specified currency", async () => {

            await assertThrowsAsync(async () => {
                await account.withdraw(
                    "ETH",                                              // assetSymbol: string,
                    "0x535ab96be208f115302facee73ae976e9174ac0b",       // address: string,
                    new BigNumber("1"),                                 // amount: BigNumber,
                    "1",                                                // addressTag?: string,
                    "Withdraw TEST",                                    // actionName?: string,
                );
            }, /^This user does not have this currency$/);

        });

        it("should throw if currency does not exist", async () => {

            await assertThrowsAsync(async () => {
                await account.withdraw(
                    "ETHZZZ",                                           // assetSymbol: string,
                    "0x535ab96be208f115302facee73ae976e9174ac0b",       // address: string,
                    new BigNumber("0"),                                 // amount: BigNumber,
                    "1",                                                // addressTag?: string,
                    "Withdraw TEST",                                    // actionName?: string,
                );
            }, /^Invalid operation$/);

        });

        it("should throw if address is not specified", async () => {

            await assertThrowsAsync(async () => {
                await account.withdraw(
                    "ETH",                                              // assetSymbol: string,
                    "",                                                 // address: string,
                    new BigNumber("0"),                                 // amount: BigNumber,
                    "1",                                                // addressTag?: string,
                    "Withdraw TEST",                                    // actionName?: string,
                );
            }, /^address is empty$/);

        });

        it("should throw if amount is 0", async () => {

            await assertThrowsAsync(async () => {
                await account.withdraw(
                    "ETH",                                              // assetSymbol: string,
                    "0x535ab96be208f115302facee73ae976e9174ac0b",       // address: string,
                    new BigNumber("0"),                                 // amount: BigNumber,
                    "1",                                                // addressTag?: string,
                    "Withdraw TEST",                                    // actionName?: string,
                );
            }, /^Cannot be less than the minimum picking quantity 0.02$/);

        });
    });
});
