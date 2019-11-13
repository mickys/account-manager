import { GenericAccount } from "./account";
import { Modules } from "./modules";
import DynamicClassMapper from "../class.store";

export interface MangerExport {
    modules: any;
    accounts: {};
    version: string;
}

export default class Manager {

    /**
     * Instantiate manager using a serialised data
     * @param json
     * @returns Manager Instance
     */
    public static fromJson(json: string): Manager {
        const data: MangerExport = JSON.parse( json );

        const manager: Manager = new Manager();

        if (Array.isArray(data.modules)) {
            data.modules.map(module => manager.loadImplementation(module));
        }

        for ( const Type in data.modules ) {
            if (Modules[ data.modules[Type] ] ) {
                const currentModuleEnum = Modules[ Modules[Type] ];
                const currentModule = Modules[currentModuleEnum];
                const currentModuleAccounts = data.accounts[currentModuleEnum];
                const AccountClassTypeString = GenericAccount.getImplementedClassName( Modules[currentModule] );

                for ( let i = 0; i < currentModuleAccounts.length; i++) {

                    const account = currentModuleAccounts[i];

                    manager.importAccount(
                        currentModule,
                        manager.mapper.getInstance(
                            AccountClassTypeString,
                            {
                                apiKey: account.apiKey,
                                apiSecret: account.apiSecret,
                                useServerTime: account.useServerTime,
                                sandbox: account.sandbox,
                            },
                        ),
                    );

                }
            }
        }

        return manager;
    }

    public accounts: Map<Modules, GenericAccount[]> = new Map();
    private mapper: DynamicClassMapper;

    constructor() {
        this.mapper = new DynamicClassMapper();
    }

    /**
     * Gets class mapper
     * @returns class mapper
     */
    public getClassMapper(): DynamicClassMapper {
        return this.mapper;
    }

    /**
     * Gets accounts
     * @param module
     * @param [reference]
     * @returns accounts
     */
    public getAccounts(module: Modules, reference: boolean = true): GenericAccount[] {
        this.requireImplementation(module, "getAccounts");

        let Results = this.accounts.get(module);
        if (!Results) {
            Results = [];
            this.accounts.set(module, Results);
        }

        if (reference) {
            return Results;
        } else {
            const ReturnData = [];
            for ( const r in Results) {
                if (Results[r]) {
                    ReturnData.push( Results[r] );
                }
            }

            return ReturnData;
        }
    }

    /**
     * Gets accounts map
     * @returns accounts map
     */
    public getAccountsMap(): Map<Modules, GenericAccount[]> {
        return this.accounts;
    }

    /**
     * Imports account
     * @param account
     * @param module
     * @returns account
     */
    public importAccount(module: Modules, account: GenericAccount) {
        this.getAccounts(module).push( account ) ;
    }

    /**
     * Loads module implementation
     * @param moduleImplementation
     * @returns void
     */
    public loadImplementation(moduleImplementation: any) {
        this.mapper.collectClasses(moduleImplementation.AvailableClasses);
    }

    /**
     * Requires implementation
     * @param module
     * @param method
     * @returns true if implementation is found, otherwise false
     */
    public requireImplementation( module: Modules, method: string ): boolean {
        if (!Modules[module]) {
            throw new Error(method + ": Module \"" + module + "\" does not have an implementation. Make sure it's indexed in the class store.");
        }
        return true;
    }

    /**
     * Remove account
     * @param account
     * @param module
     * @returns void
     */
    public removeAccount(module: Modules, index: number) {
        this.requireImplementation(module, "getAccounts");
        const accounts = this.accounts.get(module);
        accounts.splice(index, 1);
    }

    /**
     * Serialises wallet and returns a json string
     * @returns json
     */
    public toJSON(): string {
        const data: MangerExport = {
            modules: [],
            accounts: {},
            version: "0.1",
        };

        for ( const Type in Modules ) {
            if (Modules[Type]) {
                const currentModuleEnum = Modules[ Modules[Type] ];
                data.modules.push( Modules[Type] );

                data.accounts[Type] = [];
                const accounts = this.getAccounts( currentModuleEnum, false );
                for ( let i = 0; i < accounts.length; i++) {
                    data.accounts[Type].push( accounts[i] );
                }
            }
        }
        return JSON.stringify(data);
    }
}
