const collageGenerator = (function() {
  const settings = {
    intersectionPoint: {
      x: null,
      y: null
    },
    sideSize: null
  };

  function init(sideSize = 500, x = sideSize / 2, y = sideSize / 2) {
    settings.intersectionPoint.x = x;
    settings.intersectionPoint.y = y;
    settings.sideSize = sideSize;
  }

  return {
    init: init
  };
})();

collageGenerator.init();
