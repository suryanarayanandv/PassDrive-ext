const { getDomainAndSubdomain } = require("./utils");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // parse message
  if (String(message).includes("parent_url")) {
    let URL = String(message).split(":")[1];
    let domain_sub = getDomainAndSubdomain(URL);

    // TODO: native app comms
    // post domain_sub
    // .... ref: notes

    sendResponse("");
  }
});
