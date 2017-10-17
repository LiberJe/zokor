var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var QrcodeClient = (function (_super) {
        __extends(QrcodeClient, _super);
        function QrcodeClient() {
            _super.call(this, "Qrcode"); // Name
            this._ready = true; // No need to wait
            console.log('Started');
        }
        //Return unique id for your plugin
        QrcodeClient.prototype.getID = function () {
            return "QRCODE";
        };
        QrcodeClient.prototype.refresh = function () {
            //override this method with cleanup work that needs to happen
            //as the user switches between clients on the dashboard
            //we don't really need to do anything in this sample
        };
        // This code will run on the client //////////////////////
        // Start the clientside code
        QrcodeClient.prototype.startClientSide = function () {
            //don't actually need to do anything at startup
        };
        // Handle messages from the dashboard, on the client
        QrcodeClient.prototype.onRealtimeMessageReceivedFromDashboardSide = function (receivedObject) {
            console.log('Got message from qrcode plugin', receivedObject.message);
            //The dashboard will send us an object like { message: 'hello' }
            //Let's just return it, reversed
            var data = {
                message: receivedObject.message.split("").reverse().join("")
            };
            this.sendToDashboard(data);
        };
        return QrcodeClient;
    }(VORLON.ClientPlugin));
    VORLON.QrcodeClient = QrcodeClient;
    //Register the plugin with vorlon core
    VORLON.Core.RegisterClientPlugin(new QrcodeClient());
})(VORLON || (VORLON = {}));
