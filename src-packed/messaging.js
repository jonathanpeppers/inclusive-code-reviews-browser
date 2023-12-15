// Use globalThis.messaging.sendMessage()
// in place of any chrome.runtime.sendMessage() calls

var port;

function initialize() {
    console.log("Initializing port");
    port = chrome.runtime.connect({name: "inclusive-code-reviews"});
    port.onDisconnect.addListener(() => {
        if (chrome.runtime.lastError) {
            console.error("port disconnected:", chrome.runtime.lastError.message);
        } else {
            console.log("port disconnected: no error");
        }
        port = null;
    });
}

function sendMessage(message) {
    return new Promise((resolve, reject) => {
        try {
            if (!port) initialize();

            var onMessage = function(message) {
                if (chrome.runtime.lastError) {
                    console.error("error in onMessage:", chrome.runtime.lastError.message);
                }
                console.log("Message from background script: " + JSON.stringify(message));
                port.onMessage.removeListener(onMessage);
                resolve(message);
            };

            port.onMessage.addListener(onMessage);
            console.log("Sending message to background script: " + JSON.stringify(message));
            port.postMessage(message);
        } catch (e) {
            console.error(e);
            reject(e);
        }
    });
}

// For use inside the extension (which isn't using webpack)
// The best I came up with for now is to add these functions to globalThis.
// https://developer.mozilla.org/en-US/docs/Glossary/Global_object
globalThis.messaging = {
    sendMessage: sendMessage,
};