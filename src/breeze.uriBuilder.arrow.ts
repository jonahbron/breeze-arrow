
module BreezeArrow {
    var breeze: Breeze = window.breeze;
    var _ = window._;


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

            if (entityQuery.skipCount) {
                url += '&skip=' + entityQuery.skipCount;
            }

            if (entityQuery.takeCount) {
                url += '&limit=' + entityQuery.takeCount;
            }

            return url;
        }
    }

    var fragmentVisitor: any = {
        binaryPredicate: function (context: any) {
            var condition: any = {};
            var expr1Value: any = this.expr1.visit(context);
            var expr2Value: any = this.expr2.visit(context);
            switch (this.op.key) {
                case 'eq':
                    condition[expr1Value] = expr2Value;
                    break;
                case 'lt':
                    condition[expr1Value] = {$lt: expr2Value};
                    break;
                case 'le':
                    condition[expr1Value] = {$lte: expr2Value};
                    break;
                case 'gt':
                    condition[expr1Value] = {$gt: expr2Value};
                    break;
                case 'ge':
                    condition[expr1Value] = {$gte: expr2Value};
                    break;
                case 'ne':
                    condition[expr1Value] = {$ne: expr2Value};
                    break;
                case 'in':
                    condition[expr1Value] = {$in: expr2Value};
                    break;
            }
            return condition;
        },
        andOrPredicate: function(context: any) {
            var predicates: Array<any> = this.preds.map(function(predicate: any) {
                return predicate.visit(context);
            });
            if (this.op.key === 'and') {
                return _.merge.apply(_, predicates);
            } else if (this.op.key === 'or') {
                return {$or: predicates};
            }
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
