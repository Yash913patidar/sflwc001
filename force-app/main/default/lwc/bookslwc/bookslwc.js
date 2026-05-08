import { LightningElement, api } from 'lwc';

export default class Bookslwc extends LightningElement {
    books = [];
    _value;

    @api
    get value() {
        return this._value;
    }

    set value(value) {
        console.log('FULL VALUE RECEIVED:', JSON.stringify(value, null, 2));
        this._value = value;
        this.processData();
    }

    processData() {
        try {
            console.log('PROCESSING VALUE:', JSON.stringify(this._value));

            const data = Array.isArray(this._value) ? this._value[0] : this._value;

            // ✅ FIX: Directly using bookOptions (no wrapper)
            if (data && Array.isArray(data.bookOptions) && data.bookOptions.length > 0) {

                this.books = data.bookOptions.map(record => {

                    const rating = record.rating || 0;
                    const fullStars = Math.floor(rating);
                    const halfStar = rating - fullStars >= 0.5;
                    const stars = [];

                    // ⭐ Full stars
                    for (let i = 0; i < fullStars; i++) {
                        stars.push({
                            key: `${record.name}-star-${i}`,
                            icon: 'utility:favorite'
                        });
                    }

                    // ⭐ Half star
                    if (halfStar) {
                        stars.push({
                            key: `${record.name}-half`,
                            icon: 'utility:favorite_half'
                        });
                    }

                    // ⭐ Empty stars
                    while (stars.length < 5) {
                        stars.push({
                            key: `${record.name}-empty-${stars.length}`,
                            icon: 'utility:favorite_outline'
                        });
                    }

                    return {
                        name: record.name || 'No Name',
                        author: record.author || 'Unknown',
                        year: record.year ? record.year : 'N/A',
                        rating: record.rating || 0,
                        quantity: record.quantity || 0,
                        isBestSeller: record.bestSeller === true,
                        stars
                    };
                });

            } else {
                console.warn('NO DATA FOUND OR EMPTY LIST');
                this.books = [];
            }

        } catch (error) {
            console.error('Error processing data:', JSON.stringify(error));
            this.books = [];
        }
    }

    handleBuyNow(event) {
        const bookName = event.currentTarget.dataset.title;
        console.log('Buy Now clicked for:', bookName);
    }
}