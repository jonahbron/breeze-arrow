module BreezeArrow {
    interface Window {
        Q: function;
        breeze: object;
    }

    var Q: Function = window.Q;
    var breeze: Function = window.breeze;

    class ArrowAdapter extends breeze.AbstractDataServiceAdapter {
        name: string;

        constructor() {
            this.name = 'arrowAdapter';
        }

        initialize() {
            // do something
        }

        fetchMetadata() {
            return Q.resolve();
        }
    }

    breeze.config.registerAdapter('dataService', ArrowAdapter);
}
