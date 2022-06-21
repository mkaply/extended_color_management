chrome.storage.local.get(["extended_color_management_state"], function(data) {
  window.wrappedJSObject.extended_color_management_state = data.extended_color_management_state; 
});

