/**
 * 
 * @param {Array(HTMLInputElement)} inputs 
 * @returns array of compatible inputs
 */

function getCompatibleInputs(inputs) {
  let compatibleInputs = ["", ""];
  inputs.forEach((element) => {
    if (
      (element instanceof HTMLInputElement &&
        (element.type === "text" || element.type === "email")) ||
      element.type === "password"
    ) {
      if (element.outerHTML.toLowerCase().includes("email")) {
        compatibleInputs[0] = element;
      } else if (element.outerHTML.toLowerCase().includes("password")) {
        compatibleInputs[1] = element;
      }
    }
  });

  return compatibleInputs;
}

/**
 * 
 * @param {Array(HTMLInputElement)} compatibleInputs 
 * @param {object} data 
 * @returns 
 */
function injectData(compatibleInputs, data) {
  if (inputs[0] !== "") {
    inputs[0].value = data.email;
  }
  if (inputs[1] !== "") {
    inputs[1].value = data.password;
  }

  return inputs;
}

function getEmailandPassword() {
  let result = {email: "", password: ""};

  // TODO
  
  return result;
}

module.exports = {getCompatibleInputs, injectData, getEmailandPassword}