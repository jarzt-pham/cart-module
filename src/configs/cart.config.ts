const { CURRENCY } = process.env;

export const CartConfig = Object.freeze({
    CURRENCY: CURRENCY || 'USD',
});
