let expression = "";
let disp = document.body.getElementsByClassName('exp');
let ansDisp = document.body.getElementsByClassName('result');
let div = document.body.getElementsByClassName('button');
let divArrays = Array.from(div);
operators = {
    "+":1,
    "-":2,
    "*":3,
    "/":4,
}

function operate(a,b,operator) {
    if (operator === '+') return a+b;
    else if (operator === '-') return a-b;
    else if (operator === 'x') return a*b;
    else if (operator === '/') return a/b;
}
function preced(val) {
    switch (val) {
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
            return 2;
    }
    return -1;
}
function StringToExp(exp) {
    let num = [];
    let numIndex = 0;
    for (let i = 0; i < exp.length; i++) {
        let ch = exp[i];
        if ((Number(ch) + 1) && num[numIndex] != undefined){
         //(Number(ch) + 1) +1 is required since Number('0') will fail the condition 
            num[numIndex] += ch;
        }
        else if (ch == '.'){
            num[numIndex] += ch;
        }
        else if (!(Number(ch)+1) && num[numIndex] != undefined){
            num[++numIndex] = ch;
            numIndex++;
        }
        else {
            num[numIndex] = ch;
        }
    }
    return num;
}
function infixToPostfix (arr) {
    let output = [];
    let op = [];
    for (let i = 0; i < arr.length; i++) {
        let x = arr[i];
        if (Number(x)+1) output.push(x);
        else {
            while (op.length != 0 && preced(x) <= preced(op[op.length-1])) {
                output.push(op.pop());
            }
            op.push(x);
        }
    }
    while (op.length != 0) output.push(op.pop());
    return output;
}
function postfixEval (arr) {
    let stk = [];
    for (let i = 0; i < arr.length; i++) {
        let ch = arr[i];
        if (Number(ch)+1) stk.push(Number(ch));
        else {
            let val1 = stk.pop();
            let val2 = stk.pop();
            switch(ch)
            {
                case '+':
                    stk.push(val2+val1);
                    break;
                case '-':
                    stk.push(val2- val1);
                    break;    
                case '/':
                    stk.push(val2/val1);
                    break;     
                case '*':
                    stk.push(val2*val1);
                    break;
            }
        } 
    }
    return stk.pop();
}

function outputAnswer(exp) {
    let arr1 = StringToExp(exp);
    let arr2 = infixToPostfix(arr1);
    let answer = postfixEval(arr2);
    ansDisp[0].textContent = Math.round(answer * 1000)/1000;
}
function outputAnswerFinal(exp) {
    let arr1 = StringToExp(exp);
    let arr2 = infixToPostfix(arr1);
    let answer = postfixEval(arr2);
    ansDisp[0].textContent = "";
    disp[0].textContent = Math.round(answer * 1000)/1000;
    expression = answer;
}
function changeOp(exp) {
    let vall1 = exp[exp.length - 1];//last
    let vall2 = exp[exp.length - 2];//secLast
    if ((vall2==="/" && vall1==="-")||(vall2==="*" && vall1==="-")) return exp;
    let val1 = operators[exp[exp.length - 1]];//last
    let val2 = operators[exp[exp.length - 2]];//secLast
    if (val1 && val2) {
        if (expression.length == 2) {
            return '-';
        }
        let nw = exp[exp.length-1];
        console.log(nw);
        exp = exp.slice(0,exp.length-2);
        exp += nw;
        return exp;
    }
    return exp;
}
function common(val){
    if ((val === '+' || val === '*' || val === '/') && expression.length == 0) return;
    else if (val != "Backspace" && val != "Delete" && val != "Enter" && (disp[0].innerHTML).length < 25) {
        expression += val;
        expression = changeOp(expression);
        disp[0].textContent = expression;
        outputAnswer(expression);
    }
    else if (val == "Backspace" && val != "Delete") {
        disp[0].textContent = disp[0].textContent.slice(0,disp[0].textContent.length-1);
        expression = expression.slice(0,expression.length-1);
        outputAnswer(expression);
    }
    else if (val === "Enter" && val != "Delete") {
        outputAnswerFinal(expression);
    }
    else if (val === "Delete") {
        window.location.reload();
    }
}
window.addEventListener('keydown',(e)=>{
    const Key = document.querySelector(`div[data-key="${e.key}"]`);
    if (!Key) return;
    common(e.key);
    Key.classList.add('hit'); 
});

divArrays.forEach(div=>div.addEventListener('click',(e)=>{
    let val = e.target.attributes[0].nodeValue;
    common(val);
    const Key = document.querySelector(`div[data-key="${val}"]`);
    Key.classList.add('hit');
}));
function removeTransition(e) {
     if(e.propertyName != "transform") return;
     this.classList.remove('hit');
}
Array.from(div).forEach(key=>key.addEventListener('transitionend',removeTransition));