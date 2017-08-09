window.onload = () => {
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
  titleR.innerText = 'NA原始链接';
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

  jQuery('#qrcodeL').qrcode({width: 200, height: 200, text: textL.value})
  jQuery('#qrcodeR').qrcode({width: 200, height: 200, text: textR.value})

  jQuery('#textL').bind('input propertychange', () => {  
    jQuery('#qrcodeL')[0].removeChild(jQuery('#qrcodeL')[0].childNodes[0])
    jQuery('#qrcodeL').qrcode({width: 200, height: 200, text: jQuery("#textL").val()})
  })

  jQuery('#textR').bind('input propertychange', () => {  
    jQuery('#qrcodeR')[0].removeChild(jQuery('#qrcodeR')[0].childNodes[0])
    jQuery('#qrcodeR').qrcode({width: 200, height: 200, text: jQuery("#textR").val()})
  })
  
}
