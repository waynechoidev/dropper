const container = document.getElementById("container");

const searchForm = document.getElementById("searchForm");

const urlInput = document.getElementById("urlInput");
const cameraButton = document.getElementById("cameraButton");

const imageFile = document.getElementById("imageFile");

const imageUrlHeader = document.getElementById("imageUrlHeader");
const imageFileHeader = document.getElementById("imageFileHeader");
const imageUrlLoader = document.getElementById("imageUrlLoader");
const imageUrlLoaderForm = document.getElementById("imageUrlLoaderForm");
const imageUrlInput = document.getElementById("imageUrlInput");

const imageFileLoader = document.getElementById("imageFileLoader");
const imageFileInput = document.getElementById("imageFileInput");

const imageFileClose = document.getElementById("imageFileClose");

const result = document.getElementById("result");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const circle = document.getElementById("circle");
const color = document.getElementById("color");
const currentColor = document.getElementById("currentColor");
const hex = document.getElementById("hex");
const rgb = document.getElementById("rgb");
const hexCopy = document.getElementById("hexCopy");
const rgbCopy = document.getElementById("rgbCopy");
const resultClose = document.getElementById("resultClose");

function alert(txt, error) {
  const alert = document.createElement("div");
  alert.innerHTML = txt;
  alert.classList.add("alert");
  if (error) {
    alert.style.background = "#fe3a3a";
  }
  document.body.appendChild(alert);
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

// Image load
function drawImage(src) {
  const img = new Image();
  img.crossOrigin = "";
  img.setAttribute("src", src);
  img.onerror = () => {
    alert(
      "An error has occurred! Please check your url or try again later.",
      true
    );
    img.setAttribute("src", "img/error.png");
  };
  img.addEventListener("load", () => {
    const canvasWidth = result.offsetWidth - 40;
    canvas.setAttribute("width", canvasWidth);
    canvas.setAttribute("height", (canvasWidth / img.width) * img.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
  });
}
// Get Screenshot
async function getScreenshot(url) {
  await fetch(`https://apiwayne.herokuapp.com/screenshot?url=${url}`)
    .then((res) => {
      if (res.status >= 400) {
        throw new Error();
      } else {
        return res;
      }
    })
    .then((res) =>
      res.blob().then((res) => {
        drawImage(window.URL.createObjectURL(res));
      })
    )
    .catch(() => {
      drawImage("img/error.png");
      alert(
        "An error has occurred! Please check your url or try again later.",
        true
      );
    });
}
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let url;
  if (urlInput.value === "") {
    url = urlInput.placeholder;
  } else {
    url = urlInput.value;
  }
  container.classList.add("hide");
  result.classList.remove("hide");
  getScreenshot(url);
});

cameraButton.addEventListener("click", (e) => {
  e.preventDefault();
  imageFile.classList.remove("hide");
});

// Get Image
imageFileClose.addEventListener("click", (e) => {
  e.preventDefault();
  imageFile.classList.add("hide");
});
imageUrlHeader.addEventListener("click", (e) => {
  e.preventDefault();
  imageUrlHeader.classList.remove("white-bg");
  imageUrlHeader.classList.add("grey-bg");
  imageFileHeader.classList.remove("grey-bg");
  imageFileHeader.classList.add("white-bg");
  imageUrlLoader.classList.remove("hide");
  imageFileLoader.classList.add("hide");
});
imageFileHeader.addEventListener("click", (e) => {
  e.preventDefault();
  imageFileHeader.classList.remove("white-bg");
  imageFileHeader.classList.add("grey-bg");
  imageUrlHeader.classList.remove("grey-bg");
  imageUrlHeader.classList.add("white-bg");
  imageFileLoader.classList.remove("hide");
  imageUrlLoader.classList.add("hide");
});
resultClose.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.reload();
  // container.classList.remove("hide");
  // result.classList.add("hide");
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Image from URL
imageUrlLoaderForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (imageUrlInput.value === "") {
    alert(
      "An error has occurred! Please check your url or try again later.",
      true
    );
  } else {
    container.classList.add("hide");
    result.classList.remove("hide");
    drawImage(imageUrlInput.value);
  }
});

// Image from Local FIle
imageFileInput.addEventListener("change", function () {
  if (this.files[0].type.indexOf("image") < 0) {
    alert("An error has occurred! Please check your file.", true);
  } else {
    container.classList.add("hide");
    result.classList.remove("hide");
    drawImage(window.URL.createObjectURL(this.files[0]));
  }
});

function getHexCode(imgData) {
  const rgbToHex = (r, g, b) => ((r << 16) | (g << 8) | b).toString(16);
  return (
    "#" + ("000000" + rgbToHex(imgData[0], imgData[1], imgData[2])).slice(-6)
  );
}
canvas.addEventListener("mousemove", (e) => {
  const imgData = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
  const hexCode = getHexCode(imgData);

  if (
    !/Android|webOS|iPhone|iPad|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    circle.style.backgroundColor = hexCode;
    circle.style.left = e.pageX + "px";
    circle.style.top = e.pageY + "px";
  }
  currentColor.style.backgroundColor = hexCode;
});
canvas.addEventListener("click", (e) => {
  const imgData = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
  const hexCode = getHexCode(imgData);
  const rgbCode = `(${imgData[0]},${imgData[1]},${imgData[2]})`;
  color.style.backgroundColor = hexCode;
  hex.innerText = hexCode;
  rgb.innerText = rgbCode;
});
canvas.addEventListener("mouseout", () => {
  circle.style.backgroundColor = "transparent";
});

function clipboard(txt) {
  navigator.clipboard.writeText(txt);
  alert(`Copied the text: ${txt}`);
}
hexCopy.addEventListener("click", () => {
  clipboard(hex.innerText);
});
rgbCopy.addEventListener("click", () => {
  clipboard(rgb.innerText);
});
