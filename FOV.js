let factor = 2;

Array.prototype.shift = new Proxy(Array.prototype.shift, {
    apply(shift, array, args) {
        if (array[0] === 'u') {
            array[4] = array[4] * 2;
        };
        return shift.apply(array, args);
    }
});
