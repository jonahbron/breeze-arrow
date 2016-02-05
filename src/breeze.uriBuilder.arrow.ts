
module BreezeArrow {
    var breeze: Breeze = window.breeze;


    class UriBuilderArrowAdapter {
        name: string;

        constructor() {
            this.name = 'arrow';
        }

        initialize() {}

        buildUri(entityQuery: any, metadataStore: any) {
            // force entityType validation;
            var entityType = entityQuery._getFromEntityType(metadataStore, false) ||
                             new breeze.EntityType(metadataStore);

            var where = entityQuery.wherePredicate.visit({entityType: entityType}, fragmentVisitor);

            var url: string = entityQuery.resourceName + '/query?';

            url += 'where=' + encodeURIComponent(JSON.stringify(where));

            return url;
        }
    }

    var fragmentVisitor: any = {
        binaryPredicate: function (context: any) {
            var condition: any = {};

            var expr1Value: string = this.expr1.visit(context);
            var expr2Value: string = this.expr2.visit(context);

            if (this.op.key === 'eq') {
                condition[expr1Value] = expr2Value;
            }
            return condition;
        },
        propExpr: function(context: any) {
            var entityType = context.entityType;
            return entityType ? entityType.clientPropertyPathToServer(this.propertyPath, '.') : this.propertyPath;
        },
        litExpr: function (context: any) {
            return this.value;
        }
    }

    breeze.config.registerAdapter('uriBuilder', UriBuilderArrowAdapter);

}
