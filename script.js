let expression = "";   
let justEvaluated = false; 
const resultEl    = document.getElementById("result");
const expressionEl = document.getElementById("expression");
function formatNumber(num) {
  if (!isFinite(num)) return "Error";
  let str = parseFloat(num.toPrecision(10)).toString();
  return str;
}
function isOperator(char) {
  return ["+", "-", "*", "/", "%"].includes(char);
}
function updateDisplay() {
  expressionEl.textContent = expression
    .replace(/\*/g, "×")
    .replace(/\//g, "÷");
  const len = resultEl.textContent.length;
  resultEl.classList.toggle("small", len > 12);
}
function appendToDisplay(value) {
  const last = expression.slice(-1);
  if (justEvaluated) {
    if (isOperator(value)) {
      justEvaluated = false;
    } else {
      expression = "";
      resultEl.textContent = "0";
      resultEl.classList.remove("error");
      justEvaluated = false;
    }
  }
  if (isOperator(value) && isOperator(last)) {
    expression = expression.slice(0, -1);
  }
  if (expression === "" && isOperator(value) && value !== "-") return;
  if (value === ".") {
    const parts = expression.split(/[\+\-\*\/\%]/);
    const currentSegment = parts[parts.length - 1];
    if (currentSegment.includes(".")) return;
    if (currentSegment === "") expression += "0"; 
  }
  expression += value;
  updateDisplay();
}
function calculate() {
  if (expression === "") return;
  const displayExpr = expression.replace(/\*/g, "×").replace(/\//g, "÷");
  try {
    if (/[^0-9+\-*/.%() ]/.test(expression)) throw new Error("Invalid");
    let evalStr = expression.replace(/(\d+\.?\d*)%/g, "($1/100)");
    let rawResult = Function('"use strict"; return (' + evalStr + ')')();
    if (!isFinite(rawResult)) throw new Error("Cannot divide by zero");
    const formatted = formatNumber(rawResult);
    expressionEl.textContent = displayExpr + " =";
    resultEl.textContent = formatted;
    resultEl.classList.remove("error", "small");
    if (formatted.length > 12) resultEl.classList.add("small");
    expression = formatted; 
    justEvaluated = true;
  } catch (e) {
    expressionEl.textContent = displayExpr;
    resultEl.textContent = e.message === "Cannot divide by zero"
      ? "Can't ÷ by 0"
      : "Error";
    resultEl.classList.add("error");
    expression = "";
    justEvaluated = false;
  }
}
function clearAll() {
  expression = "";
  justEvaluated = false;
  resultEl.textContent = "0";
  resultEl.classList.remove("error", "small");
  expressionEl.textContent = "";
}
function deleteLast() {
  if (justEvaluated) {
    clearAll();
    return;
  }
  expression = expression.slice(0, -1);
  if (expression === "") {
    resultEl.textContent = "0";
    expressionEl.textContent = "";
  } else {
    updateDisplay();
  }
}
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") appendToDisplay(e.key);
  else if (e.key === "+") appendToDisplay("+");
  else if (e.key === "-") appendToDisplay("-");
  else if (e.key === "*") appendToDisplay("*");
  else if (e.key === "/") { e.preventDefault(); appendToDisplay("/"); }
  else if (e.key === "%") appendToDisplay("%");
  else if (e.key === ".") appendToDisplay(".");
  else if (e.key === "Enter" || e.key === "=") calculate();
  else if (e.key === "Backspace") deleteLast();
  else if (e.key === "Escape") clearAll();
});
