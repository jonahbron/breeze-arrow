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

        executeQuery(mappingContext: any) {
            var adapter: any = mappingContext.adapter = this;
            var deferred: any = Q.defer();
            var url: string = mappingContext.getUrl();

            var params: any = {
                type: 'GET',
                url: url,
                params: mappingContext.query.parameters,
                dataType: 'json',
                success: function (httpResponse: any) {
                    var data: any = httpResponse.data;
                    try {
                        var results = data[data.key];
                        if (results) {
                            deferred.resolve({results: results, httpResponse: httpResponse});
                        } else {
                            deferred.resolve({results: data, httpResponse: httpResponse});
                        }
                    } catch (error) {
                        deferred.reject(error);
                    }

                },
                error: deferred.reject.bind(deferred)
            };
            if (mappingContext.dataService.useJsonp) {
                params.dataType = 'jsonp';
                params.crossDomain = true;
            }
            this.xhr.ajax(params);
            return deferred.promise;
        }

        saveChanges(saveContext: any, saveBundle: any) {
            var adapter: any = saveContext.adapter = this;
            var deferred: any = Q.defer();
            saveBundle = adapter._prepareSaveBundle(saveContext, saveBundle);

            return Q.all(saveBundle.map(function (entity) {
                var bundle: string = JSON.stringify(saveBundle);

                var url: string = saveContext.dataService.qualifyUrl(saveContext.resourceName);
                console.log(url);

                this.xhr.ajax({
                    type: 'PUT',
                    url: url,
                    dataType: 'json',
                    contentType: 'application/json',
                    data: bundle,
                    success: function(httpResponse: any) {
                        httpResponse.saveContext = saveContext;
                        var data = httpResponse.data;
                        var saveResult = adapter._prepareSaveResult(saveContext, data);
                        saveResult.httpResponse = httpResponse;
                        deferred.resolve(saveResult);
                    },
                    error: function(httpResponse: any) {
                        httpResponse.saveContext = saveContext;
                        deferred.reject(httpResponse);
                    }
                });

                return deferred.promise;
            }));
        };

        _prepareSaveBundle(saveContext: Object, saveBundle: any) {
            return saveBundle.entities;
        }

        _prepareSaveResult(saveContext: Object, data: Object) {
            console.log('data', data);
            return {};
        }
    }

    breeze.config.registerAdapter('dataService', ArrowAdapter);

}
