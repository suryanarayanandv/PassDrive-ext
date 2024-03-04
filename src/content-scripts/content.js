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
      // save
      submitButton.addEventListener('click', (event) => {
        chrome.runtime.sendMessage("POST_new:" + URL + ":" + inputs[0].value.toString() + ":" + inputs[1].value.toString(), (response) => {
          if (response.status === SUCCESS) {
            console.log("saved");
          } else {
            console.log("failed to save");
          }
        });
      });
    }
  }
  
  let modifiedInputs = injectData(inputs, DATA);

  // reset modified inputs
  // TODO: accept / ignore model
  modifyInputsInBody(modifiedInputs);
}
