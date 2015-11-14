'use strict';

class CanvasSlider {

    constructor(...options) {
        this.configureSlider(...options);
        this.imageModel = {};
        this.canvas;

        this.interactionsMap = {
            touch: {
                on: () => {
                    this.canvas.addEventListener('touchstart', this.handleInteraction, false);
                    this.canvas.addEventListener('touchmove', this.handleInteraction, false);
                },
                off: () => {
                    this.canvas.removeEventListener('touchstart');
                    this.canvas.removeEventListener('touchmove');
                }
            },

            mouse: {
                on: () => {
                    this.canvas.addEventListener('mousedown', this.handleInteraction, false);
                    this.canvas.addEventListener('mouseover', this.handleInteraction, false);
                },
                off: () => {
                    this.canvas.removeEventListener('mousedown');
                    this.canvas.removeEventListener('mouseover');
                }
            }
        }
    }

    configureSlider(options) {
        this.setDirection(options.direction);
        this.fetchData(options.data);
        this.setDimensions(options.dimensions);
    }

    buildSlider(images) {
        let context = this.canvas.getContext('2d'),
            imageModel = this.imageModel;
        console.log(images);
        Object.keys(images).map((image, index) => {
            imageModel[index] = new Image();
            imageModel[index].onload = () => { context.drawImage(imageModel[index], (this.canvas.width - imageModel[index].width) / 2, 0) };
            imageModel[index].src = images[image].url;
        });

        this.addInteractions();
    }

    addInteractions() {
        this.interactionsMap.touch.on();
        this.interactionsMap.mouse.on();
    }

    removeInteractions() {
        this.interactionsMap.touch.off();
        this.interactionsMap.mouse.off();
    }

    setDimensions(dimensions) {
        this.canvas = document.querySelector('.js-slider');
        let canvas = this.canvas;
        if (dimensions) {
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;
        } else {
            canvas.width = document.body.clientWidth;
            canvas.height = document.body.clientHeight;
        }
    }

    fetchData(remoteSource) {
        if (remoteSource) {
            fetch(remoteSource)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    this.serializeImages(data.DCdogs);
                })
                .catch((e) => {
                    console.error("Unfortunately your remote source failed", e);
                });

        } else {
            return false;
        }
    }

    handleInteraction(ev) {
        console.log(ev);
    }

    setDirection(direction) {
        switch (direction) {
            case 'horizontal':
                this.direction = direction;
                break;

            case 'vertical':
            default:
                this.direction = direction !== undefined ? direction: 'vertical';
                break;
        }
    }

    serializeImages(images) {
        if (images) {
            let imgs = {};
            Object.keys(images).map((image) => {
                imgs[image] = images[image];
            });
            this.buildSlider(imgs);

        } else {
            return false;
        }
    }
}

// dummy data
document.addEventListener('DOMContentLoaded', function() {
    var dcDogs = new CanvasSlider({
        direction: 'horizontal',
        data: '/data/dcdogs.json',
        dimensions: {
            width: '640',
            height: '300'
        }
    });
});

