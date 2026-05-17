chrome.commands.onCommand.addListener((command) => {
  if (command !== "toggle-zap") return;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || tab.id == null) return;
    chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_ZAP" }, () => {
      void chrome.runtime.lastError;
    });
  });
});
