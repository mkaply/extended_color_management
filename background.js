let managedIcon = {
  16: "managed_16.png",
  32: "managed_32.png",
  64: "managed_64.png"
}
let unmanagedIcon = {
  16: "unmanaged_16.png",
  32: "unmanaged_32.png",
  64: "unmanaged_64.png"
}

let useNativeSRGB;
let useWebRenderCompositor;

function updateIcon() {
  browser.browserSettings.colorManagement.useNativeSRGB.get({}).then(result1 => {
    useNativeSRGB = result1.value;
    browser.browserSettings.colorManagement.useWebRenderCompositor.get({}).then(result2 => {
      useWebRenderCompositor = result2.value;
      if (useNativeSRGB || useWebRenderCompositor) {
        browser.browserAction.setIcon({path: managedIcon});
        browser.browserAction.setTitle({title: "Color pass-through is disabled."});
        chrome.storage.local.set({"extended_color_management_state": "disabled"});
      } else {
        browser.browserAction.setIcon({path: unmanagedIcon});
        browser.browserAction.setTitle({title: "Color pass-through is enabled."});
        chrome.storage.local.set({"extended_color_management_state": "enabled"});
      }
    });
  });
}
// We only update the icon at startup since the browser needs to be restarted for changes to take effect.
updateIcon();

browser.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    sendResponse({useNativeSRGB, useWebRenderCompositor});
  }
);