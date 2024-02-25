const {
  getCompatibleInputs,
  injectData,
  getEmailandPassword,
  getAllInputs,
  modifyInputsInBody,
} = require("../utils");

function sendActiveUrltoExt() {
  let data = {
    username: "",
    password: "",
  };
  let URL = document.URL;

  // Post it to the extention to fetch user and password
  // for the required domain and sub
  chrome.runtime.sendMessage("parent_url:" + URL, (response) => {
    if (response !== null) {
      let res = Object(response);
      data.username = res.username;
      data.password = res.password;
    }
  });

  return data;
}

// entry point
{
  const DATA = sendActiveUrltoExt();
  let inputs = getCompatibleInputs(getAllInputs());

  let modifiedInputs = injectData(inputs, DATA);

  // reset modified inputs
  modifyInputsInBody(modifiedInputs);
}

// TODO: actual retrieval of email and password