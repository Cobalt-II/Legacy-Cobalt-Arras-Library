Array.prototype.shift = new Proxy(Array.prototype.shift, {
    apply(shift, array, args) {
        if (array[0] === 'u') {
            array[4] = array[4] * 1.5;
        };
        return shift.apply(array, args);
    }
});
