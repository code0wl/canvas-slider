'use strict';

class CanvasSlider {

    /**
     * New slider gets created with given props
     * @param options
     * @type Object
     */
    constructor(...options) {
        this.startX = 0;
        this.imagesCollection = [];
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
    prepareSlider(images) {
            let imgs = Object.keys(images);

            imgs.forEach((image, index) => {
                images[index] = new Image();
                images[index].src = images[image].url;
                this.imagesCollection.push(images[index]);
            });
        this.drawImages(this.imagesCollection);
        this.addInteractions();
    }

    /**
     * Indirection for building images
     * @param {object} image
     * @param {number} current index converted image to canvas
     */
    drawImages(images) {

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        images.forEach((image, index)=> {

            let
                offsetLeft = this.canvas.width * index,
                imgWidth = image.width,
                imgHeight = image.height,

                HorizontalAspectRatio = this.canvas.width / imgWidth,
                verticalAspectRatio =  this.canvas.height / imgHeight,

                aspectRatio = Math.min ( HorizontalAspectRatio, verticalAspectRatio ),

                middleX = ( this.canvas.width - imgWidth * aspectRatio ) / 2,
                middleY = ( this.canvas.height - imgHeight * aspectRatio ) / 2;

            if ( this.canvas.width > imgWidth ) {
                this.context.drawImage(image, this.canvas.width / 2 - imgWidth / 2, this.canvas.height / 2 - imgWidth / 2, imgWidth, imgHeight);
            } else {
                this.context.drawImage(image, middleX + (offsetLeft) + this.startX , middleY, imgWidth * aspectRatio, imgHeight * aspectRatio);
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
     *
     */
    getImageCount() {
        this.imageCount = this.imagesCollection.length;
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
                    this.prepareSlider(this.images);
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
        let bbox = this.canvas.getBoundingClientRect();
        let coors;

        if ( this.touch ) {
            //todo get touch coordinates
            coors = {
                x: ev.clientX - bbox.left * (this.canvas.width / bbox.width),
                y: ev.clientY - bbox.top * (this.canvas.height / bbox.height)
            };
            console.log(coors);
        } else {
            coors = {
                x: ev.clientX - bbox.left * (this.canvas.width / bbox.width),
                y: ev.clientY - bbox.top * (this.canvas.height / bbox.height)
            };

            console.log(this.containerHeight)

            this.startX = coors.x;

            console.log(this.startX)
        }

        this.drawImages(this.imagesCollection);

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
            this.canvas.addEventListener('touchmove', this.setCoors);
            this.canvas.addEventListener('mousemove', this.setCoors);
        } else {
            this.canvas.removeEventListener('touchmove', this.setCoors);
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


/*


 // rAF
 window.requestAnimationFrame = function() {
 return window.requestAnimationFrame ||
 window.webkitRequestAnimationFrame ||
 window.mozRequestAnimationFrame ||
 window.msRequestAnimationFrame ||
 window.oRequestAnimationFrame ||
 function(f) {
 window.setTimeout(f,1e3/60);
 }
 }();

 var canvas = document.querySelector('canvas');
 var ctx = canvas.getContext('2d');

 var W = canvas.width;
 var H = canvas.height;

 // We want to move/slide/scroll the background
 // as the player moves or the game progresses

 // Velocity X
 var vx = 0;

 var img = new Image();
 img.src = 'http://cssdeck.com/uploads/media/items/4/4OIJyak.png';

 (function renderGame() {
 window.requestAnimationFrame(renderGame);

 ctx.clearRect(0, 0, W, H);

 ctx.fillStyle = '#333';
 ctx.fillRect(0, 0, 500, 400);

 ctx.drawImage(img, vx, 50);
 ctx.drawImage(img, img.width-Math.abs(vx), 50);

 if (Math.abs(vx) > img.width) {
 vx = 0;
 }

 vx -= 2;
 }());
 */