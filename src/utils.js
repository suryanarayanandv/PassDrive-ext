// Page utility
/**
 * @brief Fetch all the input elements
 * from document.body
 * parentElement = document.body
 * inputsArray = []
 */
function getAllInputs(parentElement, inputsArray) {
  var children = parentElement.children;
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    if (child.tagName === "INPUT") {
      inputsArray.push(child);
    }
    if (child.children.length > 0) {
      getAllInputs(child, inputsArray);
    }
  }
}

function getAllButtons(parentsElement, buttonsArray) {
  var children = parentsElement.children;
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    if ( (child.tagName === 'BUTTON') || (child.tagName === 'INPUT' && child.type === 'submit') ) {
      buttonsArray.push(child);
    }
    if (child.children.length > 0) {
      getAllButtons(child, buttonsArray);
    }
  }
}

/**
 * @param {Array(HTMLInputElement)} inputs
 * @returns array of compatible inputs
 */
function getCompatibleInputs(inputs) {
  let compatibleInputs = [new HTMLInputElement(), new HTMLInputElement()];
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
 * @param {Array(HTMLInputElement)} buttons
 * @returns HTMLButtonElement
 */
function getCompatibleButton(buttons) {
  const POSSIBLE_HINTS = ["launch", "submit", "next", "save", "login", "signin"]
  let button = null;
  buttons.forEach((element) => {
    if (element instanceof HTMLButtonElement) {
      POSSIBLE_HINTS.forEach((value) => {
        if ( String(element.outerHTML).toLowerCase().includes(value) ) {
          button = element;
        }
      });
    }
  });

  return button;
}

function getDomainAndSubdomain(url) {
  var urlObject = new URL(url);
  var hostname = urlObject.hostname;
  var domainParts = hostname.split('.');
  
  // If there are more than two parts (subdomain.domain.tld)
  if (domainParts.length > 2) {
      var subdomain = domainParts[0];
      var domain = domainParts.slice(1).join('.');
      return { 'subdomain': subdomain, 'domain': domain };
  } else {
      // If there is only one part (e.g., localhost)
      return { 'subdomain': '', 'domain': hostname };
  }
}

function modifyInputsInBody(inputArray) {
  inputArray.forEach(function(inputElement) {
      // Find input element in document.body by its id
      var matchingInput = document.querySelector('#' + inputElement.id);
      
      // If a matching input element is found, update its content
      if (matchingInput) {
          matchingInput.value = inputElement.value;
          // You can modify other properties as needed
      }
  });
}

// EXT utility
/**
 * @param {Array(HTMLInputElement)} compatibleInputs
 * @param {object} data
 * @returns
 */
function injectData(compatibleInputs, data) {
  if (data && compatibleInputs[0] != "") compatibleInputs[0].value = data.username;

  if (data && compatibleInputs[1] != "") compatibleInputs[1].value = data.password;

  return compatibleInputs;
}


module.exports = { getCompatibleInputs, injectData, getDomainAndSubdomain, getAllInputs, modifyInputsInBody };