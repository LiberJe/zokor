var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var QrcodeDashboard = (function (_super) {
        __extends(QrcodeDashboard, _super);
        //Do any setup you need, call super to configure
        //the plugin with html and css for the dashboard
        function QrcodeDashboard() {
            //     name   ,  html for dash   css for dash
            _super.call(this, "qrcode", "control.html", "control.css");
            // This code will run on the dashboard //////////////////////
            // Start dashboard code
            // uses _insertHtmlContentAsync to insert the control.html content
            // into the dashboard
            this._txtUrlOrigin = '';
            this._txtUrlNa = '';
            this._qrcodeUrlOrigin = '';
            this._qrcodeUrlNa = '';
            this._ready = true;
            console.log('Started');
        }
        //Return unique id for your plugin
        QrcodeDashboard.prototype.getID = function () {
            return "QRCODE";
        };
        QrcodeDashboard.prototype.startDashboardSide = function (div) {
            var _this = this;
            if (div === void 0) { div = null; }
            this._insertHtmlContentAsync(div, function (filledDiv) {
                _this._inputFieldOrigin = filledDiv.querySelector('#txt-origin');
                _this._inputFieldNa = filledDiv.querySelector('#txt-na');
                _this._outputDivOrigin = filledDiv.querySelector('#qrcode-origin');
                _this._outputDivNa = filledDiv.querySelector('#qrcode-na');
                $.ajax({
                    url: 'http://127.0.0.1:8050/qrcode',
                    async: false
                }).then(function (devinfo) {
                    devinfo = JSON.parse(devinfo);
                    _this._txtUrlOrigin = devinfo.origin;
                    _this._txtUrlNa = devinfo.na;
                    _this._qrcodeUrlOrigin = "https://s.waimai.baidu.com/xin/open.html#" + _this._txtUrlOrigin;
                    _this._qrcodeUrlNa = 'https://s.waimai.baidu.com/xin/open.html#' + _this._txtUrlNa.replace(/^(bdwm:\/\/native\?pageName=webview&url)/, 'bdwm://native?pageName=webview&url=https%3A%2F%2Fs.waimai.baidu.com%2Fxin%2Fopen.html%23');
                    $('#txt-origin').val(_this._txtUrlOrigin);
                    $('#txt-na').val(_this._txtUrlNa);
                    $('#qrcode-origin').qrcode({ width: 200, height: 200, text: _this._qrcodeUrlOrigin });
                    $('#qrcode-na').qrcode({ width: 200, height: 200, text: _this._qrcodeUrlNa });
                    // Send message to client when user types and hits return
                    $('#qrcode-origin').bind('input propertychange', function () {
                        $('#qrcode-origin')[0].removeChild($('#qrcode-origin')[0].childNodes[0]);
                        _this._qrcodeUrlOrigin = 'https://s.waimai.baidu.com/xin/open.html#' + $("#txt-origin").val();
                        $('#qrcode-origin').qrcode({ width: 200, height: 200, text: _this._qrcodeUrlOrigin });
                    });
                    $('#qrcode-na').bind('input propertychange', function () {
                        $('#qrcode-na')[0].removeChild($('#qrcode-na')[0].childNodes[0]);
                        _this._qrcodeUrlNa = 'https://s.waimai.baidu.com/xin/open.html#' + $("#txt-na").val().replace(/^(bdwm:\/\/native\?pageName=webview&url)/, 'bdwm://native?pageName=webview&url=https%3A%2F%2Fs.waimai.baidu.com%2Fxin%2Fopen.html%23');
                        $('#qrcode-na').qrcode({ width: 200, height: 200, text: _this._qrcodeUrlNa });
                    });
                });
            });
        };
        // When we get a message from the client, just show it
        QrcodeDashboard.prototype.onRealtimeMessageReceivedFromClientSide = function (receivedObject) {
            // var message = document.createElement('p');
            // message.textContent = receivedObject.message;
            // this._outputDiv.appendChild(message);
            console.log(receivedObject.message);
        };
        return QrcodeDashboard;
    }(VORLON.DashboardPlugin));
    VORLON.QrcodeDashboard = QrcodeDashboard;
    //Register the plugin with vorlon core
    VORLON.Core.RegisterDashboardPlugin(new QrcodeDashboard());
})(VORLON || (VORLON = {}));
