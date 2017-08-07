window.onload = () => {
  let title = document.createElement('h1');
  title.innerText = 'NA原始链接';
  let qrcode = document.createElement('img');
  qrcode.src='{{dataUrl}}';
  let targetNode = document.querySelector('.weinreServerProperties');
  let pNode = targetNode.parentNode;
  pNode.appendChild(title)
  pNode.appendChild(qrcode)
  pNode.removeChild(pNode.childNodes[0])
  pNode.removeChild(pNode.childNodes[1])
  pNode.removeChild(pNode.childNodes[1])
  pNode.removeChild(pNode.childNodes[1])
}
