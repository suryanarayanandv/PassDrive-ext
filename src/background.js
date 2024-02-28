const { getDomainAndSubdomain } = require("./utils");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  let response = {
    username: "",
    password: "",
  };

  // parse message
  if (String(message).includes("parent_url")) {
    let URL = String(message).split(":")[1];
    let domain_sub = getDomainAndSubdomain(URL);

    // TODO: native impl test + register
    let port = chrome.runtime.connectNative("com.passdrive-service");
    let data = {
      type: 'GET',
      data: JSON.stringify(domain_sub)
    }
    port.postMessage(JSON.stringify(data));

    port.onMessage.addListener(function (msg) {
      let data = JSON.parse(msg);
      response.username = data.username;
      response.password = data.password;
    });

    sendResponse(JSON.stringify(response));
  }
});
