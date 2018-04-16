const electron = require('electron');

module.exports = function (dispID) {
  var displays = electron.screen.getAllDisplays();
  var externalDisplay = null;

  displays.forEach((disp, i) => {
    displays[i].name = `Display ${i + 1}`
  })

  if (!dispID) return displays;

  displays.forEach((disp, i) => {
    if (dispID === disp.id) {
      externalDisplay = disp;
    }
  })

  if (!externalDisplay) return null;

  return [externalDisplay];
}
