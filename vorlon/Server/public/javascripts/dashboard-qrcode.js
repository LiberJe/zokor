$(document).ready(() => {
  $.ajax({
    url: 'http://127.0.0.1:8050/qrcode',
    async: false
  }).then(data => {
    data = JSON.parse(data)

    let txtUrlOrigin = data.origin
    let txtUrlNa = data.na
    let qrcodeUrlOrigin = `https://s.waimai.baidu.com/xin/open.html#${txtUrlOrigin}`
    let qrcodeUrlNa = 'https://s.waimai.baidu.com/xin/open.html#' + txtUrlNa
  
    $('#dashboard-txt-origin').val(txtUrlOrigin)
    $('#dashboard-txt-na').val(txtUrlNa)
    $('#dashboard-qrcode-origin').qrcode({ width: 200, height: 200, text: qrcodeUrlOrigin })
    $('#dashboard-qrcode-na').qrcode({ width: 200, height: 200, text: qrcodeUrlNa })

    // Send message to client when user types and hits return
    $('#dashboard-txt-origin').bind('input propertychange', () => {
        $('#dashboard-qrcode-origin')[0].removeChild($('#dashboard-qrcode-origin')[0].childNodes[0])
        qrcodeUrlOrigin = 'https://s.waimai.baidu.com/xin/open.html#' + $("#dashboard-txt-origin").val()
        $('#dashboard-qrcode-origin').qrcode({ width: 200, height: 200, text: qrcodeUrlOrigin })
    })
    $('#dashboard-txt-na').bind('input propertychange', () => {
        $('#dashboard-qrcode-na')[0].removeChild($('#dashboard-qrcode-na')[0].childNodes[0])
        qrcodeUrlNa = 'https://s.waimai.baidu.com/xin/open.html#' + $("#dashboard-txt-na").val()
        $('#dashboard-qrcode-na').qrcode({ width: 200, height: 200, text: qrcodeUrlNa })
    })
  })
})