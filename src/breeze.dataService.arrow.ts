interface AbstractDataServiceAdapter {
    new(): AbstractDataServiceAdapter;
}

interface Breeze {
    AbstractDataServiceAdapter: AbstractDataServiceAdapter;
    config: any;
    EntityType: any;
}

interface Window {
    Q: any;
    breeze: Breeze;
    _: any;
}

module BreezeArrow {

    var Q: any = window.Q;
    var breeze: Breeze = window.breeze;

    class ArrowAdapter extends breeze.AbstractDataServiceAdapter {
        name: string;
        hasServerMetadata: boolean;
        xhr: any;

        constructor() {
            super();
            this.name = 'arrowAdapter';
            this.hasServerMetadata = false;
        }

        initialize() {
            this.xhr = breeze.config.getAdapterInstance('ajax');
        }

        fetchMetadata() {
            return Q.when();
        }

        _prepareSaveBundle(saveContext: Object, saveBundle: Object) {
            return {};
        }

        _prepareSaveResult(saveContext: Object, data: Object) {
            return {};
        }
    }

    breeze.config.registerAdapter('dataService', ArrowAdapter);

}
