browser.browserSettings.colorManagement.useNativeSRGB.get({}).then(result1 => {
  let useNativeSRGB = result1.value;
  browser.browserSettings.colorManagement.useWebRenderCompositor.get({}).then(result2 => {
    let useWebRenderCompositor = result2.value;
    browser.runtime.sendMessage({data: "getSettings"}, response => {
      // We compare the preference against the value when we were first loaded
      // to decide what message to show.
      if (useNativeSRGB == response.useNativeSRGB &&
        useWebRenderCompositor == response.useWebRenderCompositor) {
        if (useNativeSRGB || useWebRenderCompositor) {
          document.getElementById("message").textContent = "Color pass-through is disabled.";
          document.getElementById("button").textContent = "Click here to enable color pass-through";
          document.getElementById("button").nativeColorManaged = true;
        } else {
          document.getElementById("message").textContent = "Color pass-through is enabled.";
          document.getElementById("button").textContent = "Click here to disable color pass-through";
          document.getElementById("button").nativeColorManaged = false;
        }
      } else {
        document.getElementById("button").hidden = true;
        document.getElementById("message").textContent = "Restart Firefox for your change to take effect.";
      }
    });
  });
});

document.getElementById("button").addEventListener("click", event => {
  browser.browserSettings.colorManagement.useNativeSRGB.set({value: !event.target.nativeColorManaged});
  browser.browserSettings.colorManagement.useWebRenderCompositor.set({value: !event.target.nativeColorManaged});
  chrome.storage.local.set({"extended_color_management_state": event.target.nativeColorManaged ? "enabling" : "disabling"});
  browser.browserAction.setIcon({path: event.target.nativeColorManaged ? "managed_disabled.png" : "unmanaged_disabled.png"});
  browser.browserAction.setTitle({title: "Restart Firefox"});
  document.getElementById("button").hidden = true;
  document.getElementById("message").textContent = "Restart Firefox for your change to take effect.";
  browser.notifications.create('', {  title: 'Extended Color Management',  message: 'Firefox must be restarted for your change to take effect.', type: 'basic'});

});
