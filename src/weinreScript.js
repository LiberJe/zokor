window.onload = () => {
  // qrcode inject
  let room = document.createElement('div');

  let left = document.createElement('div');
  left.style.cssFloat = 'left';
  left.style.width = '400px';
  let titleL = document.createElement('h1');
  titleL.innerText = '原始链接';
  let textL = document.createElement('textarea');
  textL.id = 'textL'
  textL.style.width = '400px';
  textL.style.height = '90px';
  textL.style.marginBottom = '20px'
  textL.value = '{{dataUrl}}';
  let qrcodeL = document.createElement('div');
  qrcodeL.id = 'qrcodeL'

  left.appendChild(titleL)
  left.appendChild(textL)
  left.appendChild(qrcodeL)

  let right = document.createElement('div');
  right.style.cssFloat = 'left';
  right.style.width = '400px';
  right.style.marginLeft = '20px';
  let titleR = document.createElement('h1');
  titleR.innerText = 'NA链接';
  let textR = document.createElement('textarea');
  textR.id = 'textR'
  textR.style.width = '400px';
  textR.style.height = '90px';
  textR.style.marginBottom = '20px'
  textR.value = '{{naUrl}}';
  let qrcodeR = document.createElement('div');
  qrcodeR.id = 'qrcodeR'

  right.appendChild(titleR)
  right.appendChild(textR)
  right.appendChild(qrcodeR)

  room.appendChild(left)
  room.appendChild(right)

  let targetNode = document.querySelector('.weinreServerProperties');
  let pNode = targetNode.parentNode;
  pNode.appendChild(room)
  pNode.removeChild(pNode.childNodes[0])
  pNode.removeChild(pNode.childNodes[1])
  pNode.removeChild(pNode.childNodes[1])
  pNode.removeChild(pNode.childNodes[1])

  let qrcodeInitTxtL = 'https://s.waimai.baidu.com/xin/open.html#' + textL.value
  let qrcodeInitTxtR = textR.value.replace(/^(bdwm:\/\/native\?pageName=webview&url)/, 'bdwm://native?pageName=webview&url=https%3A%2F%2Fs.waimai.baidu.com%2Fxin%2Fopen.html%23')

  jQuery('#qrcodeL').qrcode({width: 200, height: 200, text: qrcodeInitTxtL})
  jQuery('#qrcodeR').qrcode({width: 200, height: 200, text: qrcodeInitTxtR})

  jQuery('#textL').bind('input propertychange', () => {  
    jQuery('#qrcodeL')[0].removeChild(jQuery('#qrcodeL')[0].childNodes[0])
    let qrcodeTxtL = 'https://s.waimai.baidu.com/xin/open.html#' + jQuery("#textL").val()
    console.log(qrcodeL)
    jQuery('#qrcodeL').qrcode({width: 200, height: 200, text: qrcodeTxtL})
  })

  jQuery('#textR').bind('input propertychange', () => {  
    jQuery('#qrcodeR')[0].removeChild(jQuery('#qrcodeR')[0].childNodes[0])
    let qrcodeTxtR = jQuery("#textR").val().replace(/^(bdwm:\/\/native\?pageName=webview&url)/, 'bdwm://native?pageName=webview&url=https%3A%2F%2Fs.waimai.baidu.com%2Fxin%2Fopen.html%23')
    console.log(qrcodeR)
    jQuery('#qrcodeR').qrcode({width: 200, height: 200, text: qrcodeTxtR})
  })

  // toolbar style optimization
  $('#toolbar').css({
    'height': '24px',
    'border-bottom': '1px solid #cccccc',
    'background-image': 'none',
    'background-color': '#f3f3f3'
  });
  $('#main').css({
    'top': '24px'
  });
  $('.toolbar-icon').remove()

  // footbar
  // $('.status-bar').css({
  //   'background-image': 'none',
  //   'background-color': '#f3f3f3'
  // });

  // append button
  $('#toolbar .console').after("<button class='toolbar-item toggleable mock' style='display:inline-block'><div class='toolbar-label'>Mock</div></button>");
  $('#toolbar .console').after("<button class='toolbar-item toggleable wm-offline' style='display:inline-block'><div class='toolbar-label'>WM-Offline</div></button>");

  // bind toolbar clickevent
  ['remote', 'elements', 'resources', 'network', 'timeline', 'console', 'wm-offline', 'mock'].map((item, index) => {
    $(`#toolbar .${item}`).click(() => {
      if (item !== 'console') {
        $('#main').css({
          'bottom': '0px'
        })
      } else {
        $('#main').css({
          'bottom': '614px'
        })
      }
      $('.toolbar-item').removeClass('toggled-on');
      $('.panel').removeClass('visible');
      $(`#toolbar .${item}`).addClass('toggled-on');
      $(`#main-panels .${item}`).addClass('visible');
    })
  });

  // append panel
  $('#main-panels').append("<div class='panel wm-offline'><b>Coming soon</b></div>")
  $('#main-panels').append("<div class='panel mock'><b>Coming soon</b></div>")
}
