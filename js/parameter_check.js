document.addEventListener("DOMContentLoaded", function() {
  const btnCheck = document.getElementById('btnCheck');
  const parameterList = document.getElementById('parameterList');
  const rtfContent = document.getElementById('rtfContent');
  const logicContent = document.getElementById('logicContent');
  const result = document.getElementById('result');

  const runCheck = () => {
    const parameterListContent = parameterList.value;
    const parameters = parameterListContent.split("\n");
    
    result.innerHTML = "";

    console.table(parameters);
    parameters.forEach(parameter => {
      const resultParam = document.createElement("p");
      resultParam.innerHTML = parameter;

      if(testParameter(parameter)) {
        resultParam.classList.add('exists');
      } else {
        resultParam.classList.add('missing');
      }

      result.appendChild(resultParam);
    });
  }

  const testParameter = (parameter) => {

    const rtfValue = rtfContent.value;
    const logicValue = logicContent.value;
    if(rtfValue.search(parameter) > -1) return true;
    if(logicValue.search(parameter) > -1) return true;
    return false;
  }

  btnCheck.addEventListener("click", () => {
    runCheck();
  });
});