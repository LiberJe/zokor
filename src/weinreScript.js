window.onload = () => {
  let title = document.createElement('h1');
  title.innerText = 'NA原始链接';
  let qrcode = document.createElement('img');
  qrcode.src='${dataUrl}';
  let targetNode = document.querySelector('.weinreServerProperties');
  targetNode.parentNode.appendChild(title)
  targetNode.parentNode.appendChild(qrcode)
}
