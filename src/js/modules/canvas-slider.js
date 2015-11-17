'use strict';

class CanvasSlider {

    /**
     * New slider gets created with given props
     * @param options
     * @type Object
     */
    constructor(...options) {
        this.startX = 0;
        this.startY = 0;
        this.touch = ('ontouchstart' in window);
        this.imageModel = {};
        this.setCoors = this.setCoors.bind(this);
        this.images;
        this.interactionsMap = {
            hybrid: () => this.canvas.addEventListener('selectstart', (e) => { e.preventDefault()}),
            touch: {
                on: () => {
                    this.canvas.addEventListener('touchstart', this.handleInteraction.bind(this));
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
    renderSlider(images, coors) {
        let imageModel = this.imageModel,
            imgs = Object.keys(images);

            imgs.forEach((image, index) => {
                imageModel[index] = new Image();
                imageModel[index].addEventListener('load', () =>  this.drawImages(imageModel[index], index) );
                imageModel[index].src = images[image].url;
            });

        this.addInteractions();
    }

    /**
     * Indirection for building images
     * @param {object} image
     * @param {number} current index converted image to canvas
     */
    drawImages(image, index) {
        let
            canvas = this.canvas,
            offsetLeft = canvas.width * index,
            imgWidth = image.width,
            imgHeight = image.height,

            HorizontalAspectRatio = canvas.width / imgWidth,
            verticalAspectRatio =  canvas.height / imgHeight,

            aspectRatio = Math.min ( HorizontalAspectRatio, verticalAspectRatio ),

            middleX = ( canvas.width - imgWidth * aspectRatio ) / 2,
            middleY = ( canvas.height - imgHeight * aspectRatio ) / 2;

        if ( canvas.width >  imgWidth ) {
            this.context.drawImage(image, canvas.width / 2 - imgWidth / 2, canvas.height / 2 - imgWidth / 2, imgWidth, imgHeight);
        } else {
            this.context.drawImage(image, middleX + (offsetLeft), middleY, imgWidth * aspectRatio, imgHeight * aspectRatio);
        }
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

        this.containerWidth = this.getImagesAmount() * canvas.width;
        this.containerHeight = this.getImagesAmount() * canvas.height;
    }

    /**
     * Get total images to be loaded
     * @param amount
     * @returns {number}
     */
    getImagesAmount(amount) {
        return amount;
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
                    this.images = data;
                    this.renderSlider(this.images);
                    this.getImagesAmount();
                })
                .catch((e) => {
                    console.error("Unfortunately your remote source failed", e);
                });

        } else {
            console.info('Setup some local images');
        }
    }

    /**
     *
     */
    setCoors(ev) {
        let bbox = this.canvas.getBoundingClientRect(),
            coors = {
                x: ev.clientX - bbox.left * (this.canvas.width / bbox.width),
                y: ev.clientY - bbox.top * (this.canvas.height / bbox.height)
            };
        console.log(coors);
    };

    /**
     * Handles all slider interactions
     * @param event
     * @type Object
     */
    handleInteraction(ev) {
        let
            eT = ev.type;

        if (eT === 'mousedown' || eT === 'touchstart') {
            this.canvas.addEventListener('touchstart', this.setCoors);
            this.canvas.addEventListener('mousemove', this.setCoors);
        } else {
            this.canvas.removeEventListener('touchstart', this.setCoors);
            this.canvas.removeEventListener('mousemove', this.setCoors);
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

//var img = new Image();
//img.src = 'http://cssdeck.com/uploads/media/items/4/4OIJyak.png';
//(function renderGame() {
//    window.requestAnimationFrame(renderGame);
//
//    ctx.clearRect(0, 0, W, H);
//
//    ctx.fillStyle = '#333';
//    ctx.fillRect(0, 0, 500, 400);
//
//    ctx.drawImage(img, vx, 50);
//    ctx.drawImage(img, img.width-Math.abs(vx), 50);
//
//    if (Math.abs(vx) > img.width) {
//        vx = 0;
//    }
//
//    vx -= 2;
//}());
