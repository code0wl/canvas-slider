'use strict';

class CanvasSlider {

    /**
     * New slider gets created with given props
     * @param {object} options
     */
    constructor(...options) {
        this.imagesCollection = [];
        this.canvasPosition = {deltaX: 0, deltaY: 0};
        this.coors = {};
        this.touch = ('ontouchstart' in window);
        this.handleInteraction = this.handleInteraction.bind(this);
        this.setCoors = this.setCoors.bind(this);
        this.interactionsMap = {
            hybrid: () => this.canvas.addEventListener('selectstart', (e) => { e.preventDefault()}),
            touch: {
                on: () => {
                    this.canvas.addEventListener('touchstart', (this));
                }
            },
            mouse: {
                on: () => {
                    this.canvas.addEventListener('mouseleave', this.handleInteraction);
                    this.canvas.addEventListener('mouseup', this.handleInteraction);
                    this.canvas.addEventListener('mousedown', this.handleInteraction);
                },

                off: () => {
                    this.canvas.removeEventListener('mouseleave', this.handleInteraction);
                    this.canvas.removeEventListener('mouseup', this.handleInteraction);
                }
            }
        };
        this.relayConfig(...options);
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
        this.interactionsMap.hybrid();
    }

    /**
     * @Sets element class or ID
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
    prepareSlider(images, direction) {
            let imgs = Object.keys(images);

            imgs.forEach((image, index) => {
                images[index] = new Image;
                images[index].src = images[image].url;
                this.imagesCollection.push(images[index]);
            });

        this.imageCount(this.imagesCollection.length);
        this.addInteractions();

        // todo fix timeout with promise
        setTimeout(() => {
            this.updateSlider();
        }, 1000);
    }

    /**
     * Taking the collection length saving it in memory
     * @param number count
     * @returns {number}
     */
    imageCount(count) {
        return this.imageCount = count;
    }

    /**
     * Drawimages on canvas
     * @param {object} images
     */
    drawImages(images) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        images.forEach((image, index)=> {
            let
                offsetLeft = this.canvas.width * index,
                offsetTop = this.canvas.height * index,
                imgWidth = image.width,
                imgHeight = image.height,

                HorizontalAspectRatio = this.canvas.width / imgWidth,
                verticalAspectRatio =  this.canvas.height / imgHeight,

                aspectRatio = Math.min ( HorizontalAspectRatio, verticalAspectRatio ),

                middleX = ( this.canvas.width - imgWidth * aspectRatio ) / 2,
                middleY = ( this.canvas.height - imgHeight * aspectRatio ) / 2;

            if (this.direction === 'horizontal') {
                if ( this.canvas.width > imgWidth ) {
                    this.context.drawImage(image, this.canvas.width / 2 - imgWidth / 2 + this.canvasPosition.deltaX, this.canvas.height / 2 - imgHeight / 2, imgWidth, imgHeight);
                } else {
                    this.context.drawImage(image, middleX + (offsetLeft + this.canvasPosition.deltaX), middleY, imgWidth * aspectRatio, imgHeight * aspectRatio);
                }
            } else {
                if ( this.canvas.width > imgWidth ) {
                    this.context.drawImage(image, this.canvas.width / 2 - imgWidth / 2, this.canvas.height / 2 - imgHeight / 2 + this.canvasPosition.deltaY, imgWidth, imgHeight);
                } else {
                    this.context.drawImage(image, middleX, middleY + (offsetTop + this.canvasPosition.deltaY), imgWidth * aspectRatio, imgHeight * aspectRatio);
                }
            }

        });
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
     * adds drag interactions for both touch and mouse
     */
    addInteractions() {
        this.interactionsMap.touch.on();
        this.interactionsMap.mouse.on();
    }

    /**
     * Removes drag interactions for only the mouse
     * Touch is always listening
     */
    removeInteractions() {
        this.interactionsMap.mouse.off();
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
                    this.prepareSlider(data);
                })
                .catch((e) => {
                    console.error(e);
                });

        }
    }

    /**
     * Calcs difference between start and finish
     * @param {number} start
     * @param {number} finish
     * @returns {number}
     */
    calcDiff(start, finish) {
        return Math.abs(start - finish);
    }

    /**
     * Sets coordinates for the current scroll on the canvas
     * @param {object} ev object
     */
    setCoors(ev) {
        let bbox = this.canvas.getBoundingClientRect();

        this.coors.x = ev.clientX - bbox.left;
        this.coors.y = ev.clientY - bbox.top;

        this.canvasPosition.deltaX = (this.coors.x - this.coors.mouseX);
        this.canvasPosition.deltaY = (this.coors.y - this.coors.mouseY);

        this.updateSlider();
    };

    /**
     * Handles all slider interactions
     * @param ev {object} event
     */
    handleInteraction(ev) {
        let
            eT = ev.type,
            canvas = this.canvas,
            bbox = canvas.getBoundingClientRect();

        if (eT === 'mousedown' || eT === 'touchstart') {
            this.coors.mouseX = (ev.clientX - bbox.left) - this.canvasPosition.deltaX;
            this.coors.mouseY = (ev.clientY - bbox.top) - this.canvasPosition.deltaY;
            canvas.addEventListener('touchmove', this.setCoors);
            canvas.addEventListener('mousemove', this.setCoors);
        } else {
            canvas.removeEventListener('touchmove', this.setCoors);
            canvas.removeEventListener('mousemove', this.setCoors);
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

    /**
     * Life cycle controller which relays if the slider should be rendered at all
     */
    updateSlider() {
        this.drawImages(this.imagesCollection);
    }
}