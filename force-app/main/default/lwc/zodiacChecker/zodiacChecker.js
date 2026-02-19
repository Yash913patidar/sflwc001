import { LightningElement, track } from 'lwc';

export default class ZodiacChecker extends LightningElement {
    @track name = '';
    @track birthDate = '';
    @track zodiacInfo = { sign: '', trait: '' };
    @track resultMessage = '';

    zodiacSigns = [
        { sign: 'Aries', trait: 'Courageous', start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
        { sign: 'Taurus', trait: 'Reliable', start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
        { sign: 'Gemini', trait: 'Adaptable', start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
        { sign: 'Cancer', trait: 'Emotional', start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
        { sign: 'Leo', trait: 'Creative', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
        { sign: 'Virgo', trait: 'Analytical', start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
        { sign: 'Libra', trait: 'Diplomatic', start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
        { sign: 'Scorpio', trait: 'Resourceful', start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
        { sign: 'Sagittarius', trait: 'Optimistic', start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
        { sign: 'Capricorn', trait: 'Responsible', start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
        { sign: 'Aquarius', trait: 'Progressive', start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
        { sign: 'Pisces', trait: 'Compassionate', start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
    ];

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleDateChange(event) {
        this.birthDate = event.target.value;
    }

    handleSubmit() {
        this.calculateZodiacSign();
        if (this.zodiacInfo.sign && this.name) {
            this.resultMessage = `${this.name}, your zodiac sign is ${this.zodiacInfo.sign}. Your trait is ${this.zodiacInfo.trait}`;
        } else {
            this.resultMessage = '';
        }
    }

    calculateZodiacSign() {
        if (!this.birthDate) {
            this.zodiacInfo = { sign: '', trait: '' };
            return;
        }

        const date = new Date(this.birthDate);
        const month = date.getMonth() + 1; // getMonth() returns 0-11
        const day = date.getDate();

        this.zodiacInfo = { sign: '', trait: '' };
        for (const { sign, trait, start, end } of this.zodiacSigns) {
            if ((month === start.month && day >= start.day) || (month === end.month && day <= end.day)) {
                this.zodiacInfo = { sign, trait };
                break;
            }
        }
        if (!this.zodiacInfo.sign) {
            this.zodiacInfo = { sign: 'Invalid Date', trait: '' };
        }
    }
}