'use strict';

class CanvasSlider {

    constructor (...options) {
        this.options = Object.keys(...options);
    }

    createSlider() {

    }

};

var test = new CanvasSlider({
    poop: 'shit',
    data: [],

});

console.log(test.options);