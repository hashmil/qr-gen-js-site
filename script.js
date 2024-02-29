const urlInput = document.getElementById("urlInput");
const sizeInput = document.getElementById("sizeInput");
const sizeLabel = document.getElementById("sizeLabel");
const errorCorrectionLevel = document.getElementById("errorCorrectionLevel");
const generateBtn = document.getElementById("generateBtn");
const qrcodeContainer = document.getElementById("qrcode-container");

generateBtn.addEventListener("click", () => {
  qrcodeContainer.innerHTML = ""; // Clear the container
  const url = urlInput.value;
  const size = parseInt(sizeInput.value) || 256;
  const ecLevel = errorCorrectionLevel.value;

  if (url !== "") {
    // Generate QR Code (SVG)
    const qrSvg = generateSvgQRCode(url, size, size, ecLevel);

    // Create SVG element
    const svgElement = new DOMParser().parseFromString(
      qrSvg,
      "image/svg+xml"
    ).documentElement;
    qrcodeContainer.appendChild(svgElement);

    // Generate QR Code (PNG)
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src =
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(qrSvg)));
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);

      // Download PNG Button
      const downloadPngBtn = document.createElement("a");
      downloadPngBtn.innerText = "Download PNG";
      downloadPngBtn.href = canvas.toDataURL("image/png");
      downloadPngBtn.download = "qrcode.png";
      qrcodeContainer.appendChild(downloadPngBtn);
    };

    // Download SVG Button
    const downloadSvgBtn = document.createElement("a");
    downloadSvgBtn.innerText = "Download SVG";
    downloadSvgBtn.href =
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(qrSvg)));
    downloadSvgBtn.download = "qrcode.svg";
    qrcodeContainer.appendChild(downloadSvgBtn);
  } else {
    alert("Please enter a URL");
  }
});

function generateSvgQRCode(content, width, height, errorCorrectionLevel) {
  const typeNumber = 0; // Auto-detect the best type number
  const qr = qrcode(typeNumber, errorCorrectionLevel);
  qr.addData(content);
  qr.make();

  const cellSize = Math.ceil(Math.min(width, height) / qr.getModuleCount());
  const adjustedWidth = cellSize * qr.getModuleCount();
  const adjustedHeight = cellSize * qr.getModuleCount();

  const svgTag = qr.createSvgTag({
    cellSize: cellSize,
    margin: 0,
  });

  const svgWithSize = svgTag
    .replace(/width="[\d.]+"/, `width="${adjustedWidth}"`)
    .replace(/height="[\d.]+"/, `height="${adjustedHeight}"`);

  return svgWithSize;
}
