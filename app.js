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
    const quoteLayer = document.body.appendChild(
      document.createElement("canvas")
    );
    const dimLayer = document.body.appendChild(
      document.createElement("canvas")
    );
    const imagesLayer = document.body.appendChild(
      document.createElement("canvas")
    );

    layers.push(imagesLayer, dimLayer, quoteLayer);

    layers.map((layer, index) => {
      layer.width = settings.sideSize;
      layer.height = settings.sideSize;
      layer.style.zIndex = index;
      layer.style.position = "absolute";
    });

    drawDimLayer(dimLayer.getContext("2d"));
    drawQuote(dimLayer.getContext("2d"));
  }

  function drawQuote(ctx) {
    const fontSize = 24;
    ctx.fillStyle = "#fff";
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";

    getQuote().then(quote => wrapQuote(ctx, settings.sideSize, quote));
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
        resolve(xhr.responseText);
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

  return {
    init: init
  };
})();

collageGenerator.init();
