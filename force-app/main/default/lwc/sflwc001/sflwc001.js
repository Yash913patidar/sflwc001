import { LightningElement, track } from 'lwc';

export default class Sflwc001 extends LightningElement {
	@track displayValue = '0';
	firstOperand = null;
	operator = null;
	waitingForSecond = false;
	@track isDarkMode = false;

	handleButtonClick(event) {
		const value = event.target.dataset.value;
		if (!value) return;
		if (value === 'C') {
			this.clearAll();
			return;
		}
		if (value === '%') {
			this.inputPercent();
			return;
		}
		if (value === 'neg') {
			this.toggleSign();
			return;
		}
		if (value === '+' || value === '-' || value === '*' || value === '/') {
			this.handleOperator(value);
			return;
		}
		if (value === '=') {
			this.performEquals();
			return;
		}
		if (value === '.') {
			this.inputDecimal();
			return;
		}
		this.inputDigit(value);
	}

	inputDigit(digit) {
		if (this.waitingForSecond) {
			this.displayValue = digit;
			this.waitingForSecond = false;
		} else {
			this.displayValue = this.displayValue === '0' ? digit : this.displayValue + digit;
		}
	}

	inputDecimal() {
		if (this.waitingForSecond) {
			this.displayValue = '0.';
			this.waitingForSecond = false;
			return;
		}
		if (!this.displayValue.includes('.')) {
			this.displayValue += '.';
		}
	}

	inputPercent() {
		if (this.displayValue === 'Error') return;
		const value = parseFloat(this.displayValue);
		this.displayValue = String(value / 100);
	}

	toggleSign() {
		if (this.displayValue === 'Error') return;
		if (this.displayValue.startsWith('-')) {
			this.displayValue = this.displayValue.slice(1);
		} else if (this.displayValue !== '0') {
			this.displayValue = '-' + this.displayValue;
		}
	}

	handleOperator(nextOperator) {
		const inputValue = parseFloat(this.displayValue);
		if (this.operator && this.waitingForSecond) {
			this.operator = nextOperator;
			return;
		}
		if (this.firstOperand == null) {
			this.firstOperand = inputValue;
		} else if (this.operator) {
			const result = this.calculate(this.firstOperand, inputValue, this.operator);
			this.displayValue = String(result);
			this.firstOperand = result;
		}
		this.waitingForSecond = true;
		this.operator = nextOperator;
	}

	performEquals() {
		const inputValue = parseFloat(this.displayValue);
		if (this.operator == null || this.firstOperand == null) {
			return;
		}
		const result = this.calculate(this.firstOperand, inputValue, this.operator);
		this.displayValue = String(result);
		this.firstOperand = null;
		this.operator = null;
		this.waitingForSecond = false;
	}

	calculate(a, b, operator) {
		if (operator === '+') return a + b;
		if (operator === '-') return a - b;
		if (operator === '*') return a * b;
		if (operator === '/') return b === 0 ? 'Error' : a / b;
		return b;
	}

	clearAll() {
		this.displayValue = '0';
		this.firstOperand = null;
		this.operator = null;
		this.waitingForSecond = false;
	}

	toggleDarkMode() {
		this.isDarkMode = !this.isDarkMode;
	}

	get calculatorClass() {
		return this.isDarkMode ? 'calculator dark-mode' : 'calculator';
	}
}