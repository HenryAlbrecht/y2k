import { useState } from 'react';
import { Window } from './Window';

export const CalculatorWindow = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const currentValue = firstOperand || 0;
      const newValue = calculate(currentValue, inputValue, operator);
      setDisplay(String(newValue));
      setFirstOperand(newValue);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (first: number, second: number, op: string) => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '*': return first * second;
      case '/': return first / second;
      default: return second;
    }
  };

  const btnStyle = {
    width: '35px',
    height: '35px',
    margin: '2px',
    fontFamily: 'Courier New, monospace',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
    background: '#e0e0e0',
    border: '2px outset #fff',
  };

  const opBtnStyle = {
    ...btnStyle,
    color: 'red',
  };

  return (
    <Window
      id="calculator"
      title="Calc.exe"
      icon="🧮"
      defaultPosition={{ x: 300, y: 200 }}
      defaultSize={{ width: 200, height: 280 }}
      style={{ minWidth: '200px', minHeight: '280px' }}
    >
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: '100%',
          background: '#fff',
          border: '2px inset #fff',
          textAlign: 'right',
          padding: '5px',
          marginBottom: '10px',
          fontFamily: 'monospace',
          fontSize: '18px',
          height: '34px',
          overflow: 'hidden'
        }}>
          {display}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }}>
          <button style={{ ...btnStyle, color: 'red', gridColumn: 'span 4', width: '95%' }} onClick={clear}>C</button>

          <button style={btnStyle} onClick={() => inputDigit('7')}>7</button>
          <button style={btnStyle} onClick={() => inputDigit('8')}>8</button>
          <button style={btnStyle} onClick={() => inputDigit('9')}>9</button>
          <button style={opBtnStyle} onClick={() => performOperation('/')}>/</button>

          <button style={btnStyle} onClick={() => inputDigit('4')}>4</button>
          <button style={btnStyle} onClick={() => inputDigit('5')}>5</button>
          <button style={btnStyle} onClick={() => inputDigit('6')}>6</button>
          <button style={opBtnStyle} onClick={() => performOperation('*')}>*</button>

          <button style={btnStyle} onClick={() => inputDigit('1')}>1</button>
          <button style={btnStyle} onClick={() => inputDigit('2')}>2</button>
          <button style={btnStyle} onClick={() => inputDigit('3')}>3</button>
          <button style={opBtnStyle} onClick={() => performOperation('-')}>-</button>

          <button style={btnStyle} onClick={() => inputDigit('0')}>0</button>
          <button style={btnStyle} onClick={inputDot}>.</button>
          <button style={opBtnStyle} onClick={() => performOperation('=')}>=</button>
          <button style={opBtnStyle} onClick={() => performOperation('+')}>+</button>
        </div>
      </div>
    </Window>
  );
};
