chrome.app.runtime.onLaunched.addListener(function() {
  chrome.system.display.getInfo(function(info) {
    var width = info[0].workArea.width;
    var height = info[0].workArea.height;

    chrome.app.window.create('index.html', {
      "id": "dark-souls-map-viewer",
      "bounds": {
        width: width,
        height: height
      }
    });
  });
});