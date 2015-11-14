const CanvasSlider = (function(factory, w, d){

    'use strict';


    let

    createSlider = (...options) => {

        console.log(...options);

    };

    return {
      create: createSlider
    }

})(this, window, document);

CanvasSlider.create();

//module.exports = {
//  create: CanvasSlider.create
//};

