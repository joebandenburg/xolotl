chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    'id': 'MyWindowID',
    innerBounds: {
      width: 300,
      height: 500,
      minWidth: 300,
      minHeight: 500
    }//,
//    frame: "none"
  });
});
