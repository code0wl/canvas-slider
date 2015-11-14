'use strict';

class CanvasSlider {

    constructor(...options) {
        this.configureSlider(...options);
        this.imageModel = {};
        this.canvas;
        this.canvasWidth;

        this.interactionsMap = {
            touch: {
                on: () => {
                    this.canvas.addEventListener('touchstart', this.handleInteraction, false);
                    this.canvas.addEventListener('touchmove', this.handleInteraction, false);
                }
            },

            mouse: {
                on: () => {
                    this.canvas.addEventListener('mouseleave', this.handleInteraction.bind(this), false);
                    this.canvas.addEventListener('mouseup', this.handleInteraction.bind(this), false);
                    this.canvas.addEventListener('mousedown', this.handleInteraction.bind(this), false);
                }
            }
        };

    }

    configureSlider(options) {
        this.setDirection(options.direction);
        this.fetchData(options.data);
        this.setDimensions(options.dimensions);
    }

    buildSlider(images) {
        let context = this.canvas.getContext('2d'),
            imageModel = this.imageModel;
            this.canvasWidth = this.canvas.width * Object.keys(images).length;

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

    onDragStart(ev) {
        //last piece of the puzzle to ensure the user can drag an image

    }

    onDragEnd() {
        clearInterval(this.renderer);
    }

    handleInteraction(ev) {
        if (ev.type === 'mousedown') {
            this.canvas.addEventListener('mousemove', this.onDragStart.bind(this));
            this.render();
        } else {
            this.canvas.removeEventListener('mousemove', this.onDragStart.bind(this));
            this.onDragEnd();
        }
    }

    render() {
        this.renderer = setInterval(() => {
            console.log('world running!')
        }, 30);
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
