const { SUCCESS } = require("./consts");
const { getDomainAndSubdomain } = require("./utils");

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  let response = {
    username: "",
    password: "",
  };

  let requestType = String(message).split('_')[0];
  // parse message
  if (requestType === "POST") {
    if (String(message).includes("_url")) {
      let URL = String(message).split(":")[1];
      let domain_sub = getDomainAndSubdomain(URL);
  
      let port = chrome.runtime.connectNative("com.passdrive-service");
      let data = {
        type: 'GET_domain',
        data: JSON.stringify(domain_sub)
      }
      port.postMessage(JSON.stringify(data));
  
      port.onMessage.addListener(function (msg) {
        let DATA = JSON.parse(msg);
        if (DATA.status === SUCCESS) {
          response.username = DATA.data.username;
          response.password = DATA.data.password;
        }
      });
  
      sendResponse(JSON.stringify(response));
    }
  
    if (String(message).includes("_new")) {
      let temp = String(message).split(":");
      let URL = temp[1];
      let domain_sub = getDomainAndSubdomain(URL);

      let userPass = {
        domain: domain_sub.domain,
        subdomain: domain_sub.subdomain,
        username: temp[2],
        password: temp[3]
      }

      let port = chrome.runtime.connectNative("com.passdrive-service");
      let DATA = {
        type: 'POST_domain',
        data: JSON.stringify(userPass)
      }
      port.postMessage(JSON.stringify(DATA));
    }
  }

  else if (requestType === "PUT") {
    if ( String(message).includes("_login") ) {
      let temp = String(message).split(":");
      let master = temp[1];
      let port = chrome.runtime.connectNative("com.passdrive-service");
      let DATA = {
        type: 'POST_login',
        data: JSON.stringify({ master })
      }
      port.postMessage(JSON.stringify(DATA));
    }

    else if ( String(message).includes("_domain") ) {
      let temp = String(message).split(":");
      let domain_sub = getDomainAndSubdomain(temp[1]);
      let data = {
        domain: domain_sub.domain,
        subdomain: domain_sub.subdomain,
        username: temp[2],
        password: temp[3]
      }

      let port = chrome.runtime.connectNative("com.passdrive-service");
      let DATA = {
        type: 'POST_domain',
        data: JSON.stringify(data)
      }
      port.postMessage(JSON.stringify(DATA));
    }
  }

});
