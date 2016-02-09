var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BreezeArrow;
(function (BreezeArrow) {
    var Q = window.Q;
    var breeze = window.breeze;
    var ArrowAdapter = (function (_super) {
        __extends(ArrowAdapter, _super);
        function ArrowAdapter() {
            _super.call(this);
            this.name = 'arrowAdapter';
            this.hasServerMetadata = false;
        }
        ArrowAdapter.prototype.initialize = function () {
            this.xhr = breeze.config.getAdapterInstance('ajax');
        };
        ArrowAdapter.prototype.fetchMetadata = function () {
            return Q.when();
        };
        ArrowAdapter.prototype._prepareSaveBundle = function (saveContext, saveBundle) {
            return {};
        };
        ArrowAdapter.prototype._prepareSaveResult = function (saveContext, data) {
            return {};
        };
        return ArrowAdapter;
    })(breeze.AbstractDataServiceAdapter);
    breeze.config.registerAdapter('dataService', ArrowAdapter);
})(BreezeArrow || (BreezeArrow = {}));
var BreezeArrow;
(function (BreezeArrow) {
    var breeze = window.breeze;
    var _ = window._;
    var UriBuilderArrowAdapter = (function () {
        function UriBuilderArrowAdapter() {
            this.name = 'arrow';
        }
        UriBuilderArrowAdapter.prototype.initialize = function () { };
        UriBuilderArrowAdapter.prototype.buildUri = function (entityQuery, metadataStore) {
            // force entityType validation;
            var entityType = entityQuery._getFromEntityType(metadataStore, false) ||
                new breeze.EntityType(metadataStore);
            var where = entityQuery.wherePredicate.visit({ entityType: entityType }, fragmentVisitor);
            var url = entityQuery.resourceName + '/query?';
            url += 'where=' + encodeURIComponent(JSON.stringify(where));
            if (entityQuery.skipCount) {
                url += '&skip=' + entityQuery.skipCount;
            }
            if (entityQuery.takeCount) {
                url += '&limit=' + entityQuery.takeCount;
            }
            return url;
        };
        return UriBuilderArrowAdapter;
    })();
    var fragmentVisitor = {
        binaryPredicate: function (context) {
            var condition = {};
            var expr1Value = this.expr1.visit(context);
            var expr2Value = this.expr2.visit(context);
            switch (this.op.key) {
                case 'eq':
                    condition[expr1Value] = expr2Value;
                    break;
                case 'lt':
                    condition[expr1Value] = { $lt: expr2Value };
                    break;
                case 'le':
                    condition[expr1Value] = { $lte: expr2Value };
                    break;
                case 'gt':
                    condition[expr1Value] = { $gt: expr2Value };
                    break;
                case 'ge':
                    condition[expr1Value] = { $gte: expr2Value };
                    break;
                case 'ne':
                    condition[expr1Value] = { $ne: expr2Value };
                    break;
                case 'in':
                    condition[expr1Value] = { $in: expr2Value };
                    break;
            }
            return condition;
        },
        andOrPredicate: function (context) {
            var predicates = this.preds.map(function (predicate) {
                return predicate.visit(context);
            });
            if (this.op.key === 'and') {
                return _.merge.apply(_, predicates);
            }
            else if (this.op.key === 'or') {
                return { $or: predicates };
            }
        },
        propExpr: function (context) {
            var entityType = context.entityType;
            return entityType ? entityType.clientPropertyPathToServer(this.propertyPath, '.') : this.propertyPath;
        },
        litExpr: function (context) {
            return this.value;
        }
    };
    breeze.config.registerAdapter('uriBuilder', UriBuilderArrowAdapter);
})(BreezeArrow || (BreezeArrow = {}));
