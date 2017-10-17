var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var MockClient = (function (_super) {
        __extends(MockClient, _super);
        function MockClient() {
            _super.call(this, "Mock"); // Name
            this._ready = true; // No need to wait
            console.log('Started');
        }
        //Return unique id for your plugin
        MockClient.prototype.getID = function () {
            return "MOCK";
        };
        MockClient.prototype.refresh = function () {
            //override this method with cleanup work that needs to happen
            //as the user switches between clients on the dashboard
            //we don't really need to do anything in this sample
        };
        // This code will run on the client //////////////////////
        // Start the clientside code
        MockClient.prototype.startClientSide = function () {
            //don't actually need to do anything at startup
        };
        // Handle messages from the dashboard, on the client
        MockClient.prototype.onRealtimeMessageReceivedFromDashboardSide = function (receivedObject) {
            console.log('Got message from qrcode plugin', receivedObject.message);
            //The dashboard will send us an object like { message: 'hello' }
            //Let's just return it, reversed
            var data = {
                message: receivedObject.message.split("").reverse().join("")
            };
            this.sendToDashboard(data);
        };
        return MockClient;
    }(VORLON.ClientPlugin));
    VORLON.MockClient = MockClient;
    //Register the plugin with vorlon core
    VORLON.Core.RegisterClientPlugin(new MockClient());
})(VORLON || (VORLON = {}));
