import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './style.css'

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          curOperand: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === '0' && state.curOperand === '0') return state;
      if (payload.digit === '.' && state.curOperand.includes('.')) return state;
      return {
        ...state,
        curOperand: `${state.curOperand || ""}${payload.digit}`
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.curOperand == null && state.prevOperand == null) {
        return state;
      }
      if (state.curOperand == null) {
        return {
          ...state,
          operation: payload.operation
        };
      }
      if (state.prevOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: state.curOperand,
          curOperand: null
        };
      }
      return {
        ...state,
        prevOperand: evaluate(state),
        curOperand: null,
        operation: payload.operation
      }
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          curOperand: null
        };
      }
      if (state.curOperand == null) return state;
      if (state.curOperand.length === 1) {
        return {
          ...state,
          curOperand: null
        };
      }
      return {
        ...state,
        curOperand: state.curOperand.slice(0, -1)
      };
    case ACTIONS.EVALUATE:
      if (state.operation == null || state.curOperand == null || state.prevOperand == null) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        prevOperand: null,
        curOperand: evaluate(state),
        operation: null
      };
  }
}

function evaluate({ curOperand, prevOperand, operation }) {
  const prev = parseFloat(prevOperand);
  const cur = parseFloat(curOperand);
  if (isNaN(prev) || isNaN(cur)) return '';
  let computation = '';
  switch (operation) {
    case '+':
      computation = prev + cur;
      break;
    case '-':
      computation = prev - cur;
      break;
    case '*':
      computation = prev * cur;
      break;
    case '÷':
      computation = prev / cur;
      break;
    default:
      break;
  }

  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split('.');
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ curOperand, prevOperand, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className='calculator-grid'>
      <div className='output'>
        <div className='previous-operand'>{formatOperand(prevOperand)} {operation}</div>
        <div className='current-operand'>{formatOperand(curOperand)}</div>
      </div>
      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation='÷' dispatch={dispatch} />
      <DigitButton digit='1' dispatch={dispatch} />
      <DigitButton digit='2' dispatch={dispatch} />
      <DigitButton digit='3' dispatch={dispatch} />
      <OperationButton operation='*' dispatch={dispatch} />
      <DigitButton digit='4' dispatch={dispatch} />
      <DigitButton digit='5' dispatch={dispatch} />
      <DigitButton digit='6' dispatch={dispatch} />
      <OperationButton operation='-' dispatch={dispatch} />
      <DigitButton digit='7' dispatch={dispatch} />
      <DigitButton digit='8' dispatch={dispatch} />
      <DigitButton digit='9' dispatch={dispatch} />
      <OperationButton operation='+' dispatch={dispatch} />
      <DigitButton digit='0' dispatch={dispatch} />
      <DigitButton digit='.' dispatch={dispatch} />
      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
