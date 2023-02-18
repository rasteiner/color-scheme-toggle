chrome.runtime.onMessage.addListener(async (request, sender) => {
  if(sender.tab) {
    if(request.cmd === "toggle-color-scheme") {
      chrome.debugger.getTargets(async (targets) => {
        const target = targets.find(target => target.tabId === sender.tab.id);
                
        if(!target.attached) {
          await chrome.debugger.attach({tabId: sender.tab.id}, "1.3");
        }

        await chrome.debugger.sendCommand({tabId: sender.tab.id}, "Emulation.setEmulatedMedia", { features: [
          { name: "prefers-color-scheme", value: request.scheme }
        ]});
      });
    }
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      chrome.runtime.sendMessage({cmd: "toggle-color-scheme", scheme: isDark ? "light" : "dark"});
    }
  });
});
