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
     * @param {object} options
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
     * @param {string} element
     */
    setCanvas(element) {
        this.canvas = document.querySelector(element);
        this.context = this.canvas.getContext('2d');
    }

    /**
     * Builds slider with relayed info then binds events when complete
     * @param {object} images remote data
     */
    buildSlider(images) {
        let imageModel = this.imageModel,
            imgs = Object.keys(images),
            canvas = this.canvas;

            this.maxScrollHorizontal = canvas.width * imgs.length;
            this.maxScrollVertical = canvas.height * imgs.length;

            imgs.forEach((image, index) => {
                let
                    offsetLeft = canvas.width * index,
                    imgWidth = images[image].width,
                    imgHeight = images[image].height,

                    HorizontalAspectRatio = canvas.width / imgWidth,
                    verticalAspectRatio =  canvas.height / imgHeight,

                    aspectRatio = Math.min ( HorizontalAspectRatio, verticalAspectRatio ),

                    middleX = ( canvas.width - imgWidth * aspectRatio ) / 2,
                    middleY = ( canvas.height - imgHeight * aspectRatio ) / 2;

                imageModel[index] = new Image();
                imageModel[index].addEventListener('load', () => {
                    if ( canvas.width >  imgWidth ) {
                    //TODO: fix offset for next image inline
                    this.context.drawImage(imageModel[index], canvas.width / 2 - imgWidth / 2, canvas.height / 2 - imgWidth / 2, imgWidth, imgHeight);
                    } else {
                        this.context.drawImage(imageModel[index], middleX + (offsetLeft), middleY, imgWidth * aspectRatio, imgHeight * aspectRatio);
                    }
                });
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
     * @param {object} dimensions
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
     * @param {string} remoteSource location url
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
     * @param {string} direction
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
