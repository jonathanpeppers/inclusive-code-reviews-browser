// Use globalThis.messaging.sendMessage()
// in place of any chrome.runtime.sendMessage() calls

var port;

function initialize() {
    port = chrome.runtime.connect({name: "inclusive-code-reviews"});
    port.onMessage.addListener(function(message) {
        console.log(message);
    });
}

function sendMessage(message) {
    if (!port) initialize();
    try {
        port.postMessage(message);
    } catch (e) {
        console.log(e);

        // If we fail here, try initializing again
        initialize();
        port.postMessage(message);
    }
}

// For use inside the extension (which isn't using webpack)
// The best I came up with for now is to add these functions to globalThis.
// https://developer.mozilla.org/en-US/docs/Glossary/Global_object
globalThis.messaging = {
    sendMessage: sendMessage,
};
