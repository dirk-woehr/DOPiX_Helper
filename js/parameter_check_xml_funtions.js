const collectParameters = (paramElements, parameters) => {
  for (let elem of paramElements) {
    const parameter = elem.getAttribute("refid");
    parameters[parameter] = {
      inParam: true,
      inText: false,
      logic: {} 
    }
  }
}

/**
 * Extracts variables text body
 * adds them to parameters collection
 * and marks them as used, if already collected
 * @param { string } logicString - The logic string
 */

const extractParametersFromText = (textcontent, parameters) => {
  const matches = textcontent.match(/&[A-Z0-9_]*\./g);
  if(matches && matches.length) {
    matches.forEach((match) => {
      const param = match.replace("&", "").replace(".", "");
      if(parameters[param] !== undefined) {
        parameters[param].inText = true;
      } else {
        parameters[param] = {
          inParam: false,
          inText: true,
          logic: {} 
        }
      }
    });
  }
}

/**
 * Goes through all logic strings of a logic element
 * @param { string } elementName - name of the logic element
 * @param { Object } logicElement - logic string
 * @param { Object } parameters - logic string
*/

const extractParametersFromLogicElement = (
  executionContext,
  logicElement,
  parameters
) => {
  const logicTypes = ["basiclogic", "extendedlogic"];
  logicTypes.forEach((logicTypeString) => {

    const logicType = logicElement.getElementsByTagName(logicTypeString)[0];

    if(logicType !== undefined) {
      const logicSubTypes = ["condition", "action"];
      logicSubTypes.forEach((logicSubTypeString) => {
        const logicSubTypeElements = Array.from(
          logicType.getElementsByTagName(logicSubTypeString)
        );
        logicSubTypeElements.forEach((logicSubTypeElement, index) => {
          const logicString = logicSubTypeElement.getAttribute("value");
          if(logicString && logicString.length > 0) {
            collectParametersFromLogic(
              executionContext + " | " + logicTypeString + " | " + logicSubTypeString + " | " + index,
              logicString,
              parameters
            );
          };
        });
      });
    }
  });
}

/**
 * Collects variables from logic string
 * adds them to parameters collection
 * and marks them as used, if already collected
 * @param { string } pathToLogicString - path to the logic string
 * @param { string } logicString - logic string
 * @param { Object } parameters - logic string
*/

const collectParametersFromLogic = (
  pathToLogicString,
  logicString,
  parameters
) => {
  const matches = logicString.match(/&[A-Z0-9_]*/g);
  if(matches && matches.length) {
    matches.forEach((match) => {
      const param = match.replace("&", "");
      if(parameters[param] !== undefined) {
        if(parameters[param].logic[pathToLogicString] === undefined) {
          parameters[param].logic[pathToLogicString] = logicString;
        }
      } else {
        parameters[param] = {
          inParam: false,
          inText: true,
          logic: {}
        }
      }
    });
  }
}

const createResultTable = (parameters, table, clearTable, objectId) => {
  const colspan = 4;
  if(clearTable) {
    table.innerHTML = "";
  }

  const trObjectId = document.createElement("tr");
  const thObjectId = document.createElement("th");
  thObjectId.innerHTML = objectId;
  thObjectId.setAttribute("colspan", colspan);
  thObjectId.classList.add("columnHeadMain");
  trObjectId.appendChild(thObjectId);
  table.appendChild(trObjectId);

  
  const parameterNames = Object.keys(parameters);
  
  if(parameterNames.length > 0) {    
    const headRow = document.createElement("tr");
    const thVar = document.createElement("th");
    thVar.innerHTML = "Variable";
    thVar.classList.add("columnHead");
    headRow.appendChild(thVar);
    const thPar = document.createElement("th");
    thPar.innerHTML = "Parameter Gesetzt";
    thPar.classList.add("columnHead");
    headRow.appendChild(thPar);
    const thTxt = document.createElement("th");
    thTxt.innerHTML = "In Text verwendet";
    thTxt.classList.add("columnHead");
    headRow.appendChild(thTxt);
    const thLog = document.createElement("th");
    thLog.innerHTML = "Logik-Elemente";
    thLog.classList.add("columnHead");
    headRow.appendChild(thLog);
    table.appendChild(headRow);
  } else {
    const trNoLogic = document.createElement("tr");
    const thNoLogic = document.createElement("th");
    thNoLogic.innerHTML = "Keine Logik vorhanden";
    thNoLogic.classList.add("emptyLogik");
    thNoLogic.setAttribute("colspan", colspan);
    trNoLogic.appendChild(thNoLogic);
    table.appendChild(trNoLogic);
    return;

  }

  let isEven = false;

  parameterNames.forEach((parameter) => {
    const isUsedInText = parameters[parameter].inText;
    const logic = parameters[parameter].logic;
    const logicKeys = Object.keys(logic);
    const isUsed = isUsedInText || logicKeys.length > 0;
    const isSet = parameters[parameter].inParam;
    
    
    // create row
    const tr = document.createElement("tr");
    if(isEven) {
      tr.classList.add("even");
    }
    isEven = !isEven;

    // create var cell
    const tdVar = document.createElement("td");
    const spanVar = document.createElement("span");
    const cssClass = isUsed && isSet ? "correct" : "incorrect";
    spanVar.innerHTML = parameter;
    spanVar.classList.add(cssClass);
    tdVar.appendChild(spanVar);
    tr.appendChild(tdVar);
    
    // create param cell
    const tdPar = document.createElement("td");
    tdPar.innerHTML = isSet ? "☑" : "☐";
    tr.appendChild(tdPar);
    
    // create param cell
    const tdTxt = document.createElement("td");
    tdTxt.innerHTML = isUsedInText ? "☑" : "☐";
    tr.appendChild(tdTxt);
    
    // create param cell
    const tdLog = document.createElement("td");
    tdLog.classList.add("tdLog");
    tdLog.addEventListener("click", () => {
      const divLogs = tdLog.getElementsByTagName("div");
      if(divLogs.length === 0) return;
      divLogs[0].classList.toggle("hide");
    });
    const spanLog = document.createElement("span");
    spanLog.innerHTML = Object.keys(logic).length;
    tdLog.appendChild(spanLog);
    if(Object.keys(logic).length > 0) {
      const divLog = document.createElement("div");
      divLog.classList.add("divLog", "hide");
      logicKeys.forEach((logicKey) => {
        const preLog = document.createElement("pre");
        preLog.innerHTML = logicKey + "\n" + logic[logicKey];
        divLog.appendChild(preLog);
      });
      tdLog.appendChild(divLog);
    }
    
    tr.appendChild(tdLog);

    // append row
    table.appendChild(tr);
  });


}