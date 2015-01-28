chrome.app.runtime.onLaunched.addListener(function() {
    "use strict";

    chrome.app.window.create("index.html", {
        "id": "MyWindowID",
        innerBounds: {
            width: 300,
            height: 500,
            minWidth: 300,
            minHeight: 500
        }
//      frame: "none"
    });
});
