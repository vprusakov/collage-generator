const collageGenerator = (function() {
  const settings = {
    intersectionPoint: {
      x: null,
      y: null
    },
    sideSize: null
  };

  const layers = [];

  function init(sideSize = 500, x = sideSize / 2, y = sideSize / 2) {
    settings.intersectionPoint.x = x;
    settings.intersectionPoint.y = y;
    settings.sideSize = sideSize;
    buildCollage();
  }

  function buildCollage() {
    const collage = document.body.appendChild(document.createElement("div"));
    collage.style.height = settings.sideSize + "px";

    const quoteLayer = collage.appendChild(document.createElement("canvas"));
    const dimLayer = collage.appendChild(document.createElement("canvas"));
    const imagesLayer = collage.appendChild(document.createElement("canvas"));

    layers.push(imagesLayer, dimLayer, quoteLayer);

    layers.map((layer, index) => {
      layer.width = settings.sideSize;
      layer.height = settings.sideSize;
      layer.style.zIndex = index;
      layer.style.position = "absolute";
    });

    drawDimLayer(dimLayer.getContext("2d"));
    drawQuote(dimLayer.getContext("2d"));
    drawImages(imagesLayer.getContext("2d")).then(() => appendDownloadButton());
  }

  function drawQuote(ctx) {
    const fontSize = 24;
    ctx.fillStyle = "#fff";
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";

    getQuote()
      .then(quote => wrapQuote(ctx, settings.sideSize, quote))
      .then(wrappedQuote =>
        getTextYPosition(settings.sideSize, wrappedQuote, fontSize)
      )
      .then(([wrappedQuote, quoteYPosition]) =>
        wrappedQuote.split("\n").reduce((acc, line) => {
          ctx.fillText(line, settings.sideSize / 2, acc);
          return acc + fontSize;
        }, quoteYPosition)
      );
  }

  function getQuote() {
    return new Promise(resolve => {
      let xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        `http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&${Math.floor(
          Math.random() * 1000
        )}`,
        true
      );
      xhr.onload = () => {
        const e = document.createElement("div");
        e.innerHTML = JSON.parse(xhr.response)[0].content;
        const responseText = e.childNodes[0].textContent;
        resolve(responseText);
      };
      xhr.send();
    });
  }

  function wrapQuote(ctx, maxWidth, text) {
    return new Promise(resolve => {
      const words = text.split(" ");

      const wrappedText = words.reduce(
        (acc, word) => {
          const extLine =
            acc.currLine === "" ? word : `${acc.currLine} ${word}`;
          const isOverflows = ctx.measureText(extLine).width > maxWidth;
          if (acc.currLine === "" && isOverflows) {
            acc.wrapped = `${acc.wrapped}\n${word}`;
          } else if (isOverflows) {
            acc.wrapped = `${acc.wrapped}\n${acc.currLine}`;
            acc.currLine = word;
          } else {
            acc.currLine = extLine;
          }
          return acc;
        },
        { wrapped: "", currLine: "" }
      );

      resolve(`${wrappedText.wrapped}\n${wrappedText.currLine}`.trim());
    });
  }

  function getTextYPosition(maxHeight, text, fontSize) {
    const textHeight = text.split("\n").length * fontSize;
    const textYPosition =
      textHeight > maxHeight ? 0 : maxHeight / 2 - textHeight / 2 + fontSize;
    return [text, textYPosition];
  }

  function drawDimLayer(ctx) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(0, 0, settings.sideSize, settings.sideSize);
  }

  function drawImages(ctx) {
    return new Promise(resolve => {
      const totalImages = 4;
      let totalImagesLoaded = 0;
      const isLastLoaded = () =>
        ++totalImagesLoaded === totalImages && resolve();

      const topLeftImage = new Image();
      topLeftImage.crossOrigin = "anonymous";
      const topLeftImageWidth = settings.intersectionPoint.x;
      const topLeftImageHeight = settings.intersectionPoint.y;
      topLeftImage.onload = () => {
        ctx.drawImage(
          topLeftImage,
          0,
          0,
          topLeftImageWidth,
          topLeftImageHeight
        );
        isLastLoaded();
      };
      topLeftImage.src = `https://source.unsplash.com/random/${topLeftImageWidth}x${topLeftImageHeight}/?sig=1`;

      const topRightImage = new Image();
      topRightImage.crossOrigin = "anonymous";
      const topRightImageWidth =
        settings.sideSize - settings.intersectionPoint.x;
      const topRightImageHeight = settings.intersectionPoint.y;
      topRightImage.onload = () => {
        ctx.drawImage(
          topRightImage,
          settings.intersectionPoint.x,
          0,
          topRightImageWidth,
          topRightImageHeight
        );
        isLastLoaded();
      };
      topRightImage.src = `https://source.unsplash.com/random/${topRightImageWidth}x${topRightImageHeight}/?sig=2`;

      const bottomLeftImage = new Image();
      bottomLeftImage.crossOrigin = "anonymous";
      const bottomLeftImageWidth = settings.intersectionPoint.x;
      const bottomLeftImageHeight =
        settings.sideSize - settings.intersectionPoint.y;
      bottomLeftImage.onload = () => {
        ctx.drawImage(
          bottomLeftImage,
          0,
          settings.intersectionPoint.y,
          bottomLeftImageWidth,
          bottomLeftImageHeight
        );
        isLastLoaded();
      };
      bottomLeftImage.src = `https://source.unsplash.com/random/${bottomLeftImageWidth}x${bottomLeftImageHeight}/?sig=3`;

      const bottomRightImage = new Image();
      bottomRightImage.crossOrigin = "anonymous";
      const bottomRightImageWidth =
        settings.sideSize - settings.intersectionPoint.x;
      const bottomRightImageHeight =
        settings.sideSize - settings.intersectionPoint.y;
      bottomRightImage.onload = () => {
        ctx.drawImage(
          bottomRightImage,
          settings.intersectionPoint.x,
          settings.intersectionPoint.y,
          bottomRightImageWidth,
          bottomRightImageHeight
        );
        isLastLoaded();
      };
      bottomRightImage.src = `https://source.unsplash.com/random/${bottomRightImageWidth}x${bottomRightImageHeight}/?sig=4`;
    });
  }

  function appendDownloadButton() {
    const button = document.body.appendChild(document.createElement("button"));
    button.textContent = "Download";
    button.style.marginTop = "20px";
    button.addEventListener("click", downloadCollage.bind(null, layers), false);
  }

  function downloadCollage(layers) {
    const resultLayer = document.createElement("canvas");
    resultLayer.width = settings.sideSize;
    resultLayer.height = settings.sideSize;
    const link = document.createElement("a");

    layers.reduce((acc, layer) => {
      acc.drawImage(layer, 0, 0);
      return acc;
    }, resultLayer.getContext("2d"));

    link.download = "collage";
    link.href = resultLayer.toDataURL("image/png");
    link.click();
  }

  return {
    init: init
  };
})();

collageGenerator.init();
