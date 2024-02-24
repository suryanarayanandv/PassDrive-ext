const {getCompatibleInputs, injectData, getEmailandPassword} = require('../utils');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "clicked_browser_action") {
        let inputs = document.querySelectorAll("input");
        let compatibleInputs = getCompatibleInputs(inputs);
        let data = getEmailandPassword();

        if (compatibleInputs[0] !== "" || compatibleInputs[1] !== "") {
            injectData(compatibleInputs, data);
        }
    }
});