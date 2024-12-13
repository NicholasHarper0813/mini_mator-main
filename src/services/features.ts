export function share(title: string, url: string, file: File)
{
  const basicShare = {
    url,
    title,
  };
  
  const fullShare = {
    ...basicShare,
    files: [file],
  };
  
  if (!(navigator as any).canShare) 
  {
    window.alert(`The sharing feature isn't available in your browser`);
  } 
  
  else if ((navigator as any).canShare(fullShare)) 
  {
    navigator.share(fullShare);
  } 
  
  else if ((navigator as any).canShare(basicShare)) 
  {
    navigator.share(basicShare);
  } 
  
  else 
  {
    window.alert(`The sharing feature isn't available in your browser`);
  }
}

export function buildPNG(svg: SVGElement): Promise<File>
{
  const canvas = document.createElement('canvas');
  canvas.width = parseInt(svg.getAttribute('width') || '0', 10);
  canvas.height = parseInt(svg.getAttribute('height') || '0', 10);

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
  const url = window.URL.createObjectURL(blob);

  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  
  return new Promise((res, rej) => {
    const baseimage = new Image();
    baseimage.style.background = '#fff';
    baseimage.onload = function() {
      ctx.drawImage(baseimage,1,1, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const file = new File([blob as Blob], 'minimator.png', { type: 'image/png' });
        res(file);
      });
    }
    
    baseimage.onerror = rej;
    baseimage.src = url;
  });
}

let downloadAnchor = document.createElement('a');
document.body.appendChild(downloadAnchor);
downloadAnchor.style.display = 'none';

export function downloader(svgContent: BlobPart, fileName: string)
{
  let blob = new Blob([svgContent], { type: 'octet/stream' }),
    url = window.URL.createObjectURL(blob);
    downloadAnchor.href = url;
    downloadAnchor.download = fileName;
    downloadAnchor.click();
    window.setTimeout(function () {
      window.URL.revokeObjectURL(url);
    }, 10);
}

export function securityCheck() 
{
  if (window.top !== window.self) 
  {
    setInterval(() => {
      if (window.top?.document?.body) {
        const rotate = Math.cos(Date.now() / 1000) * 45;
        window.top.document.body.style.transform = `rotate(${rotate}deg)`;
        window.document.body.style.transform = `rotate(${-rotate}deg)`;
      }
    }, 50);
    window.document.body.innerHTML = `<iframe
      src="https://giphy.com/embed/Ju7l5y9osyymQ" 
      width="100%" 
      height="100%" 
      frameBorder="0"
      style="position:fixed;z-index:9999;"
      allowFullScreen
    ></iframe>`;
  }
}
