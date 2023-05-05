// send a message every 20 sec to service worker
setInterval(() => {
    console.log('sending CHECK_HEALTH');
    chrome.runtime.sendMessage({ command: "CHECK_HEALTH" });
}, 20000);