'use strict';

class CanvasSlider {

    constructor(...options) {
        this.buildSlider(...options);
    }

    buildSlider(options) {
        console.log(options);
        this.setDirection(options.direction);
    }

    setDirection(direction) {
        switch (direction) {
            case 'horizontal':
                this.direction = direction;
                break;

            case 'vertical':
            default:
                this.direction = direction;
                break;
        }
    }
}

var amsterdamSlider = new CanvasSlider({
    direction: 'horizontal',
    data: []
});

console.log(amsterdamSlider);