const { SUCCESS } = require("../consts");
const {
  getCompatibleInputs,
  injectData,
  getEmailandPassword,
  getAllInputs,
  modifyInputsInBody,
  getAllButtons,
  getCompatibleButton
} = require("../utils");

async function sendActiveUrltoExt() {
  let data = {
    username: "",
    password: "",
  }
  let URL = document.URL;

  // Post it to the extention to fetch user and password
  // for the required domain and sub
  chrome.runtime.sendMessage("POST_url:" + URL, (response) => {
    if (response !== null) {
      let res = JSON.parse(response);
      data.username = res.username;
      data.password = res.password;
    }
  });

  return data;
}

// entry point
{
  let inputs = getCompatibleInputs(getAllInputs());
  
  let DATA = null;
  sendActiveUrltoExt().then((res) => {
    DATA = JSON.parse(res);
  })

  if ( DATA.username === '' && DATA.password === '' ) {
    let URL = document.URL;
    let submitButton = getCompatibleButton(getAllButtons());

    if ( submitButton && submitButton instanceof HTMLButtonElement ) {
      // set detected to false = stop loop src:popup.js and get saveIgnore model
      chrome.storage.sync.set({ "detected": false });

      // save
      submitButton.addEventListener('click', async (event) => {
        let inputsArray = [inputs[0].value.toString(), inputs[1].value.toString()]
        let status = "default";
        
        while ( status === "default" ) {
          // wait for the user to select save or ignore
          let temp = await chrome.storage.sync.get("save");
          status = temp.save;
        }

        if ( status === true ) {
          chrome.runtime.sendMessage("POST_new:" + URL + ":" + inputsArray[0] + ":" + inputsArray[1], (response) => {
            if (response.status === SUCCESS) {
              console.log("saved");
            } else {
              console.log("failed to save");
            }
          });
        }
      });
    }
  } else {
    let modifiedInputs = injectData(inputs, DATA);

    chrome.storage.sync.set({ "detected": true });
    let accept = "default";

    while ( accept === "default" ) {
      let temp = chrome.storage.sync.get("accept");
      accept = temp.accept;
    }

    // accept ignore model
    if (accept) {
      modifyInputsInBody(modifiedInputs);
    }
  }
}
