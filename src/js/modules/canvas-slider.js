'use strict';

class CanvasSlider {

    constructor(...options) {
        this.relayConfig(...options);
        this.imageModel = {};
        this.distance = 0;
        this.lastRepaint = 0;
        this.interactionsMap = {
            touch: {
                on: () => {
                    this.canvas.addEventListener('touchstart', this.handleInteraction, false);
                    this.canvas.addEventListener('touchmove', this.handleInteraction, false);
                    this.canvas.addEventListener('touchend', this.handleInteraction, false);
                },

                off: () => {
                    this.canvas.removeEventListener('touchmove', this.handleInteraction, false);
                    this.canvas.removeEventListener('touchend', this.handleInteraction, false);
                }
            },

            mouse: {
                on: () => {
                    this.canvas.addEventListener('mouseleave', this.handleInteraction.bind(this), false);
                    this.canvas.addEventListener('mouseup', this.handleInteraction.bind(this), false);
                    this.canvas.addEventListener('mousedown', this.handleInteraction.bind(this), false);
                },

                off: () => {
                    this.canvas.removeEventListener('mouseleave', this.handleInteraction.bind(this), false);
                    this.canvas.removeEventListener('mouseup', this.handleInteraction.bind(this), false);
                }
            }
        };
    }


    /**
     * configuration relay
     * @param options
     * @type Object
     */
    relayConfig(options) {
        this.setCanvas(options.element);
        this.setDirection(options.direction);
        this.fetchData(options.data);
        this.setDimensions(options.dimensions);
        this.speed = options.speed || 100;
    }

    /**
     * @Set element
     * @param element
     * @type String
     */
    setCanvas(element) {
        this.canvas = document.querySelector(element);
    }

    /**
     * Builds slider with chosen configurations and binds events when complete
     * @param images remote data
     * @type Object
     */
    buildSlider(images) {
        let context = this.canvas.getContext('2d'),
            imageModel = this.imageModel;
            //this.canvasWidth = this.canvas.width * Object.keys(images).length;

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
        console.log(this.canvas);
    }

    onDragEnd() {
        this.removeInteractions();
        clearInterval(this.renderer);
    }

    handleInteraction(ev) {
        let dragStart = this.onDragStart.bind(this);

        if (ev.type === 'mousedown') {
            this.canvas.addEventListener(window, 'mousemove', dragStart);
            this.render();
        } else {
            this.canvas.removeEventListener(window, 'mousemove', dragStart);
            this.onDragEnd();
        }
    }

    render(time) {
        this.renderer = setInterval(() => {
            console.log('world running!');
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
