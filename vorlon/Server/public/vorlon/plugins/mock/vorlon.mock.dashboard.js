var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var MockDashboard = (function (_super) {
        __extends(MockDashboard, _super);
        //Do any setup you need, call super to configure
        //the plugin with html and css for the dashboard
        function MockDashboard() {
            //     name   ,  html for dash   css for dash
            _super.call(this, "mock", "control.html", "control.css");
            this._ready = true;
            console.log('Started');
        }
        //Return unique id for your plugin
        MockDashboard.prototype.getID = function () {
            return "MOCK";
        };
        // This code will run on the dashboard //////////////////////
        // Start dashboard code
        // uses _insertHtmlContentAsync to insert the control.html content
        // into the dashboard
        MockDashboard.prototype.startDashboardSide = function (div) {
            if (div === void 0) { div = null; }
            this._insertHtmlContentAsync(div, function (filledDiv) {
            });
        };
        // When we get a message from the client, just show it
        MockDashboard.prototype.onRealtimeMessageReceivedFromClientSide = function (receivedObject) {
            // var message = document.createElement('p');
            // message.textContent = receivedObject.message;
            // this._outputDiv.appendChild(message);
            console.log(receivedObject.message);
        };
        return MockDashboard;
    }(VORLON.DashboardPlugin));
    VORLON.MockDashboard = MockDashboard;
    //Register the plugin with vorlon core
    VORLON.Core.RegisterDashboardPlugin(new MockDashboard());
})(VORLON || (VORLON = {}));
