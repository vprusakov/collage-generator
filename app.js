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
    const quoteLayer = collage.appendChild(document.createElement("canvas"));
    const dimLayer = collage.appendChild(document.createElement("canvas"));
    const imagesLayer = collage.appendChild(document.createElement("canvas"));

    layers.map((layer, index) => {
      layer.width = settings.sideSize;
      layer.height = settings.sideSize;
      layer.style.zIndex = index;
      layer.style.position = "absolute";
    });
  }

  return {
    init: init
  };
})();

collageGenerator.init();
