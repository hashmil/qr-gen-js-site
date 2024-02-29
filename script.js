const urlInput = document.getElementById("urlInput");
const sizeInput = document.getElementById("sizeInput");
const errorCorrectionLevel = document.getElementById("errorCorrectionLevel");
const generateBtn = document.getElementById("generateBtn");
const qrcodeContainer = document.getElementById("qrcode-container");

generateBtn.addEventListener("click", () => {
  qrcodeContainer.innerHTML = ""; // Clear the container
  const url = urlInput.value;
  const size = parseInt(sizeInput.value) || 256;
  const ecLevel = errorCorrectionLevel.value;

  if (url !== "") {
    // Generate QR Code (Image)
    const qrcodeImg = new QRCode(qrcodeContainer, {
      text: url,
      width: size,
      height: size,
    });

    // Download PNG Button
    qrcodeImg._oDrawing._elImage.onload = () => {
      const downloadPngBtn = document.createElement("a");
      downloadPngBtn.innerText = "Download PNG";
      downloadPngBtn.href = qrcodeImg._oDrawing._elImage.src;
      downloadPngBtn.download = "qrcode.png";
      qrcodeContainer.appendChild(downloadPngBtn);
    };

    // Generate QR Code (SVG)
    const qrSvg = generateSvgQRCode(url, size, size, ecLevel);

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
  return qr.createSvgTag({
    scalable: true,
    width: width,
    height: height,
  });
}
