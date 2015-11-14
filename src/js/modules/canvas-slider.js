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
                    this.canvas.addEventListener('mousemove', this.handleInteraction, false);
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

            Object.keys(images).forEach((image, index) => {

                let
                    offsetLeft = this.canvas.width * index,
                    imgWidth = images[image].width,
                    imgHeight = images[image].height,

                    HorizontalAspectRatio = this.canvas.width / imgWidth,
                    verticalAspectRatio =  this.canvas.height / imgHeight,

                    aspectRatio = Math.min ( HorizontalAspectRatio, verticalAspectRatio ),

                    middleX = ( this.canvas.width - imgWidth * aspectRatio ) / 2,
                    middleY = ( this.canvas.height - imgHeight * aspectRatio ) / 2;

                imageModel[index] = new Image();
                imageModel[index].onload = () => {
                    context.drawImage(imageModel[index], middleX + (offsetLeft), middleY, imgWidth * aspectRatio, imgHeight * aspectRatio);
                };

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
                    this.buildSlider(data.DCdogs);
                })
                .catch((e) => {
                    console.error("Unfortunately your remote source failed", e);
                });

        } else {
            return false;
        }
    }

    handleInteraction(ev) {
        console.log(ev.target)
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

