interface AbstractDataServiceAdapter {
    new(): AbstractDataServiceAdapter;
}

interface Breeze {
    AbstractDataServiceAdapter: AbstractDataServiceAdapter;
    config: any;
}

interface Window {
    Q: Function;
    breeze: Breeze;
}

module BreezeArrow {

    var Q: Function = window.Q;
    var breeze: Breeze = window.breeze;

    class ArrowAdapter extends breeze.AbstractDataServiceAdapter {
        name: string;
        hasServerMetadata: boolean;

        constructor() {
            super();
            this.name = 'arrowAdapter';
            this.hasServerMetadata = false;
        }

        initialize() {
            // do something
        }

        fetchMetadata() {
            return Q();
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
