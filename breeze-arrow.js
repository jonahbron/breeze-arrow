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
            this.name = 'arrowAdapter';
        }
        ArrowAdapter.prototype.initialize = function () {
            // do something
        };
        ArrowAdapter.prototype.fetchMetadata = function () {
            return Q.resolve();
        };
        return ArrowAdapter;
    })(breeze.AbstractDataServiceAdapter);
    breeze.config.registerAdapter('dataService', ArrowAdapter);
})(BreezeArrow || (BreezeArrow = {}));
