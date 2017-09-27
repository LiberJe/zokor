module VORLON {
    export class QrcodeDashboard extends DashboardPlugin {

        //Do any setup you need, call super to configure
        //the plugin with html and css for the dashboard
        constructor() {
            //     name   ,  html for dash   css for dash
            super("qrcode", "control.html", "control.css");
            this._ready = true;
            console.log('Started');
        }

        //Return unique id for your plugin
        public getID(): string {
            return "QRCODE";
        }

        // This code will run on the dashboard //////////////////////

        // Start dashboard code
        // uses _insertHtmlContentAsync to insert the control.html content
        // into the dashboard
        private _txtUrlOrigin: String = ''
        private _txtUrlNa: String = ''
        private _qrcodeUrlOrigin: String = ''
        private _qrcodeUrlNa: String = ''
        private _inputFieldOrigin: HTMLTextAreaElement
        private _inputFieldNa: HTMLTextAreaElement
        private _outputDivOrigin: HTMLElement
        private _outputDivNa: HTMLElement

        public startDashboardSide(div: HTMLDivElement = null): void {
            this._insertHtmlContentAsync(div, (filledDiv) => {
                this._inputFieldOrigin = <HTMLTextAreaElement>filledDiv.querySelector('#txt-origin');
                this._inputFieldNa = <HTMLTextAreaElement>filledDiv.querySelector('#txt-na');
                this._outputDivOrigin = <HTMLElement>filledDiv.querySelector('#qrcode-origin');
                this._outputDivNa = <HTMLElement>filledDiv.querySelector('#qrcode-na');

                $.ajax({
                    url: 'http://127.0.0.1:8050/qrcode',
                    async: false
                }).then(devinfo => {
                    devinfo = JSON.parse(devinfo)

                    this._txtUrlOrigin = devinfo.origin
                    this._txtUrlNa = devinfo.na
                    this._qrcodeUrlOrigin = `https://s.waimai.baidu.com/xin/open.html#${this._txtUrlOrigin}`
                    this._qrcodeUrlNa = 'https://s.waimai.baidu.com/xin/open.html#' + this._txtUrlNa.replace(/^(bdwm:\/\/native\?pageName=webview&url)/, 'bdwm://native?pageName=webview&url=https%3A%2F%2Fs.waimai.baidu.com%2Fxin%2Fopen.html%23')
    
                    $('#txt-origin').val(this._txtUrlOrigin)
                    $('#txt-na').val(this._txtUrlNa)
                    $('#qrcode-origin').qrcode({ width: 200, height: 200, text: this._qrcodeUrlOrigin })
                    $('#qrcode-na').qrcode({ width: 200, height: 200, text: this._qrcodeUrlNa })
    
                    // Send message to client when user types and hits return
                    $('#qrcode-origin').bind('input propertychange', () => {
                        $('#qrcode-origin')[0].removeChild($('#qrcode-origin')[0].childNodes[0])
                        this._qrcodeUrlOrigin = 'https://s.waimai.baidu.com/xin/open.html#' + $("#txt-origin").val()
                        $('#qrcode-origin').qrcode({ width: 200, height: 200, text: this._qrcodeUrlOrigin })
                    })
                    $('#qrcode-na').bind('input propertychange', () => {
                        $('#qrcode-na')[0].removeChild($('#qrcode-na')[0].childNodes[0])
                        this._qrcodeUrlNa = 'https://s.waimai.baidu.com/xin/open.html#' + $("#txt-na").val().replace(/^(bdwm:\/\/native\?pageName=webview&url)/, 'bdwm://native?pageName=webview&url=https%3A%2F%2Fs.waimai.baidu.com%2Fxin%2Fopen.html%23')
                        $('#qrcode-na').qrcode({ width: 200, height: 200, text: this._qrcodeUrlNa })
                    })
                })
            })
        }

        // When we get a message from the client, just show it
        public onRealtimeMessageReceivedFromClientSide(receivedObject: any): void {
            // var message = document.createElement('p');
            // message.textContent = receivedObject.message;
            // this._outputDiv.appendChild(message);
            console.log(receivedObject.message)
        }
    }

    //Register the plugin with vorlon core
    Core.RegisterDashboardPlugin(new QrcodeDashboard());
}
