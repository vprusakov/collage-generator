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

  function drawDimLayer(ctx) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(0, 0, settings.sideSize, settings.sideSize);
  }

  return {
    init: init
  };
})();

collageGenerator.init();
