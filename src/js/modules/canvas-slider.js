'use strict';

const CanvasSlider = class {

    /**
     * New slider gets created with given props
     * @param options
     * @type Object
     */
    constructor(...options) {
        this.relayConfig(...options);
        this.touch = ('ontouchstart' in window);
        this.imageModel = {};
        this.interactionsMap = {
            touch: {
                on: () => {
                    this.canvas.addEventListener('touchstart', this.handleInteraction.bind(this));
                },

                off: () => {
                    this.canvas.removeEventListener('touchmove', this.handleDrag);
                }
            },

            mouse: {
                on: () => {
                    this.canvas.addEventListener('mouseleave', this.handleInteraction.bind(this));
                    this.canvas.addEventListener('mouseup', this.handleInteraction.bind(this));
                    this.canvas.addEventListener('mousedown', this.handleInteraction.bind(this));
                },

                off: () => {
                    this.canvas.removeEventListener('mouseleave', this.handleInteraction.bind(this));
                    this.canvas.removeEventListener('mouseup', this.handleInteraction.bind(this));
                    this.canvas.removeEventListener('mousemove', this.handleDrag);
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
        this.context = this.canvas.getContext('2d');
    }

    /**
     * Builds slider with relayed info
     * then binds events when complete
     * @param images remote data {object}
     */
    buildSlider(images) {
        let imageModel = this.imageModel,
            imgs = Object.keys(images);
            this.maxScrollWidth = this.canvas.width * imgs.length;
            this.maxScrollHeight = this.canvas.height * imgs.length;

            imgs.forEach((image, index) => {
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
                    this.context.drawImage(imageModel[index], middleX + (offsetLeft), middleY, imgWidth * aspectRatio, imgHeight * aspectRatio);
                };
                imageModel[index].src = images[image].url;
            });

        this.addInteractions();
    }

    /**
     * adds drag interactions for both touch and mouse
     */
    addInteractions() {
        this.interactionsMap.touch.on();
        this.interactionsMap.mouse.on();
    }

    /**
     * Removes drag interactions for both touch and mouse
     */
    removeInteractions() {
        this.interactionsMap.touch.off();
        this.interactionsMap.mouse.off();
    }

    /**
     * Sets given dimensions given from user or is fullscreen by default
     * @param dimensions
     * @type Object
     */
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

    /**
     * Fetches remote images for usage
     * @param remoteSource location url
     * @type String
     */
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
            console.info('Setup some local images');
        }
    }

    handleDrag(ev) {
        if (this.touch) {
            console.log('touch', ev);
        } else {
            console.log('mouse', ev);
        }
    }

    /**
     * Handles all slider interactions
     * @param event
     * @type Object
     */
    handleInteraction(ev) {
        if (ev.type === 'mousedown') {
            this.canvas.addEventListener('mousemove', this.handleDrag);
        } else if (ev.type === 'touchstart') {
            this.canvas.addEventListener('touchmove', this.handleDrag);
        } else {
            this.removeInteractions();
        }
    }

    /**
     * Sets slider direction for the user
     * @param direction
     * @type String
     */
    setDirection(direction) {
        switch (direction) {
            case 'vertical':
                this.direction = direction !== undefined ? direction: 'vertical';
                break;

            case 'horizontal':
            default:
                this.direction = direction;
                break;
        }
    }
}
