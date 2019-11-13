import { assert } from "chai";
import mocha from "mocha";

import { Manager, Modules } from "../../src/index";
import { GenericAccount } from "../../src/core/account";

describe("Core", async () => {

    describe("Manager", async () => {
        describe("getAccounts()", async () => {
            it("should throw if no module is specified", async () => {
                const manager: Manager = new Manager();
                assert.throws(() => {
                    // @ts-ignore: we're testing for this scenario
                    manager.getAccounts();
                }, /^getAccounts: Module "undefined" does not have an implementation. Make sure it\'s indexed in the class store.$/);
            });

            it("should return an empty array if specified module exists but has no accounts", async () => {
                const manager: Manager = new Manager();
                const result = manager.getAccounts( Modules.BINANCE );
                const expected: any = [];
                assert.equal( result.toString(), expected.toString(), "Returded value did not match");
            });

        });

        describe("getAccountsMap()", async () => {
            const manager: Manager = new Manager();
            const Map = manager.getAccountsMap();
            it("should return a Map Object", async () => {
                assert.equal( Map.constructor.name, "Map", "Returded value did not match");
            });

        });

        describe("getClassMapper()", async () => {
            const manager: Manager = new Manager();
            const Object = manager.getClassMapper();
            it("should return a DynamicClassMapper Object", async () => {
                assert.equal( Object.constructor.name, "DynamicClass", "Returded value did not match");
            });

        });

        it("importAccount should index the new account", async () => {
            const manager: Manager = new Manager();
            const accountOptions = {
                apiKey: "key",
                apiSecret: "secret",
                useServerTime: true,
                sandbox: true,
            };
            const DynamicClassName = GenericAccount.getImplementedClassName( Modules[Modules.BINANCE] );
            const account: GenericAccount = manager.getClassMapper().getInstance( DynamicClassName, accountOptions );
            manager.importAccount( Modules.BINANCE, account );
            assert.equal( manager.getAccounts(Modules.BINANCE).length, 1, "Should have 1 accounts");
        });

    });
});
