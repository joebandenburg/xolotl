chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('contacts.html', {
    'id': 'MyWindowID',
    innerBounds: {
      width: 500,
      height: 600,
      minWidth: 500,
      minHeight: 600
    }//,
//    frame: "none"
  });
});
