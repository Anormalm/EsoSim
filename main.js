
window.bfExamples = {
  hello: `++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.`,
  echo: `,[.,]`,
  count: `+++++[>++++++++++<-]>[.<]`
};

function runBrainfuck(code, input = "", onStateUpdate = null) {
    const tape = new Uint8Array(300);
    let ptr = 0;
    let ip = 0;
    let inputPtr = 0;
    const output = [];

    const loopStack = [];
    const loopMap = {};

    for (let i = 0; i < code.length; i++) {
        if (code[i] === "[") loopStack.push(i);
        if (code[i] === "]") {
            const start = loopStack.pop();
            loopMap[start] = i;
            loopMap[i] = start;
        }
    }
    while (ip < code.length) {
        const cmd = code[ip];
        switch (cmd) {
            case ">": ptr++; break;
            case "<": ptr--; break;
            case "+": tape[ptr]++; break;
            case "-": tape[ptr]--; break;
            case ".": output.push(String.fromCharCode(tape[ptr])); break;
            case ",": tape[ptr] = input.charCodeAt(inputPtr++) || 0; break;
            case "[": if (tape[ptr] === 0) ip = loopMap[ip]; break;
            case "]": if (tape[ptr] !== 0) ip = loopMap[ip]; break;
        }
        if (onStateUpdate) {
            onStateUpdate([...tape], ptr);
        }
        ip++;

    }

    return output.join("");
}

function runLOLCode(code) {
  const lines = code.split('\n').map(line => line.trim());
  const vars = {};
  let output = "";

  for (let line of lines) {
    if (line.startsWith("I HAS A")) {
      const parts = line.split(" ");
      const name = parts[3];
      const value = parseInt(parts[5]) || 0;
      vars[name] = value;
    }

    if (line.startsWith("VISIBLE")) {
      const parts = line.split(" ");
      const name = parts[1];
      output += (vars[name] !== undefined ? vars[name] : name) + "\n";
    }
  }

  return output;
}


function runForth(code) {
  const tokens = code.trim().split(/\s+/);
  const stack = [];
  let output = "";

  for (let tok of tokens) {
    if (!isNaN(tok)) {
      stack.push(Number(tok));
    } else if (tok === "+") {
      const b = stack.pop(), a = stack.pop();
      stack.push(a + b);
    } else if (tok === "-") {
      const b = stack.pop(), a = stack.pop();
      stack.push(a - b);
    } else if (tok === "*") {
      const b = stack.pop(), a = stack.pop();
      stack.push(a * b);
    } else if (tok === "/") {
      const b = stack.pop(), a = stack.pop();
      stack.push(Math.floor(a / b));
    } else if (tok === ".") {
      output += stack.pop() + "\n";
    } else if (tok === "DUP") {
      stack.push(stack[stack.length - 1]);
    } else if (tok === "SWAP") {
      const a = stack.pop(), b = stack.pop();
      stack.push(a, b);
    } else if (tok === "DROP") {
      stack.pop();
    } else {
      output += `[ERR: unknown word "${tok}"]\n`;
    }
  }

  return output;
}


