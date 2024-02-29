const urlInput = document.getElementById("urlInput");
const sizeInput = document.getElementById("sizeInput");
const sizeLabel = document.getElementById("sizeLabel");
const errorCorrectionLevel = document.getElementById("errorCorrectionLevel");
const generateBtn = document.getElementById("generateBtn");
const qrcodeContainer = document.getElementById("qrcode-container");
const sizeValue = document.getElementById("sizeValue");

sizeInput.addEventListener("input", () => {
  sizeValue.value = sizeInput.value;
});

sizeValue.addEventListener("input", () => {
  sizeInput.value = sizeValue.value;
});

generateBtn.addEventListener("click", () => {
  qrcodeContainer.innerHTML = ""; // Clear the container
  const url = urlInput.value;
  const size = parseInt(sizeInput.value) || 256;
  const ecLevel = errorCorrectionLevel.value;

  if (url !== "") {
    // Generate QR Code (SVG)
    const { qrSvg, qr } = generateSvgQRCode(url, size, size, ecLevel);

    // Create SVG element
    const svgElement = new DOMParser().parseFromString(
      qrSvg,
      "image/svg+xml"
    ).documentElement;
    svgElement.classList.add("mx-auto"); // Center-align the QR code
    qrcodeContainer.appendChild(svgElement);

    // Create a div to wrap the download buttons
    const downloadBtnWrapper = document.createElement("div");
    downloadBtnWrapper.classList.add(
      "flex",
      "justify-center",
      "space-x-4",
      "mt-4"
    );
    qrcodeContainer.appendChild(downloadBtnWrapper);

    // Generate QR Code (PNG)
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src =
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(qrSvg)));
    img.onload = () => {
      const padding = 4 * (size / qr.getModuleCount()); // Calculate padding based on the module size
      const paddedSize = size + 2 * padding; // Add padding to both sides of the QR code

      // Resize the canvas to include the padding
      canvas.width = paddedSize;
      canvas.height = paddedSize;

      // Fill the canvas with white color
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, paddedSize, paddedSize);

      // Draw the QR code image onto the canvas with padding
      ctx.drawImage(img, padding, padding, size, size);

      // Download PNG Button
      const downloadPngBtn = document.createElement("a");
      downloadPngBtn.innerText = "Download PNG";
      downloadPngBtn.href = canvas.toDataURL("image/png");
      downloadPngBtn.download = "qrcode.png";
      downloadPngBtn.classList.add(
        "bg-blue-500",
        "hover:bg-blue-700",
        "text-white",
        "font-bold",
        "py-2",
        "px-4",
        "rounded",
        "focus:outline-none",
        "focus:shadow-outline"
      );
      downloadBtnWrapper.appendChild(downloadPngBtn); // Append the button to the wrapper
    };

    // Download SVG Button
    const downloadSvgBtn = document.createElement("a");
    downloadSvgBtn.innerText = "Download SVG";
    downloadSvgBtn.href =
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(qrSvg)));
    downloadSvgBtn.download = "qrcode.svg";
    downloadSvgBtn.classList.add(
      "bg-blue-500",
      "hover:bg-blue-700",
      "text-white",
      "font-bold",
      "py-2",
      "px-4",
      "rounded",
      "focus:outline-none",
      "focus:shadow-outline"
    );
    downloadBtnWrapper.appendChild(downloadSvgBtn); // Append the button to the wrapper
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

  return { qrSvg: svgWithSize, qr };
}
