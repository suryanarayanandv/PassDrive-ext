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

/**
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
  if (compatibleInputs[0] != "") compatibleInputs[0].value = data.email;

  if (compatibleInputs[1] != "") compatibleInputs[1].value = data.password;

  return inputs;
}


module.exports = { getCompatibleInputs, injectData, getDomainAndSubdomain, getAllInputs, modifyInputsInBody };