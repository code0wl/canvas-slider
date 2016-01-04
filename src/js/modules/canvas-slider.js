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
            listeners: {
                on: () => {
                    if (this.touch) {
                        this.canvas.addEventListener('touchstart', this.handleInteraction);
                    } else {
                        this.canvas.addEventListener('mouseleave', this.handleInteraction);
                        this.canvas.addEventListener('mouseup', this.handleInteraction);
                        this.canvas.addEventListener('mousedown', this.handleInteraction);
                    }
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
    }

    /**
     * @Sets element class or ID
     * @param {string} element
     */
    setCanvas(element) {
        this.canvas = document.querySelector(element);
        this.context = this.canvas.getContext('2d');
        this.canvas.addEventListener('selectstart', (e) => {
            e.preventDefault()
        });
    }

    /**
     * Builds slider with relayed info then binds events when complete
     * @param {object} images remote data
     */
    prepareSlider(images) {
            let imgs = Object.keys(images);

            imgs.forEach((image, index) => {
                images[index] = new Image;
                images[index].src = images[image].url;
                this.imagesCollection.push(images[index]);
            });

        this.imageCount(this.imagesCollection.length);
        this.addInteractions();
        this.context.save();
        setTimeout(() => { this.updateSlider(); }, 1000);
    }

    /**
     * Taking the collection length saving it in memory
     * @param {number} count
     * @returns {number}
     */
    imageCount(count) {
        return this.imageCount = count;
    }

    /**
     * Calc image dimentions
     * fit images to canvas
     * Drawimages on canvas
     * @param {object} images
     */
    drawImages(images) {
        const
            cW = this.canvas.width,
            cH = this.canvas.height;

        this.context.clearRect(0, 0, cW, cH);
        images.forEach((image, index)=> {
            let
                offsetLeft = cW * index,
                offsetTop = cH * index,
                ctx = this.context,
                imgWidth = image.width,
                imgHeight = image.height,

                HorizontalAspectRatio = cW / imgWidth,
                verticalAspectRatio = cH / imgHeight,

                aspectRatio = Math.min ( HorizontalAspectRatio, verticalAspectRatio ),

                middleX = ( cW - imgWidth * aspectRatio ) / 2,
                middleY = ( cH - imgHeight * aspectRatio ) / 2;

            if (this.direction === 'horizontal') {
                if (cW > imgWidth) {
                    ctx.drawImage(image, cW / 2 - imgWidth / 2 + this.canvasPosition.deltaX, cH / 2 - imgHeight / 2, imgWidth, imgHeight);
                } else {
                    ctx.drawImage(image, middleX + (offsetLeft + this.canvasPosition.deltaX), middleY, imgWidth * aspectRatio, imgHeight * aspectRatio);
                }
            } else {
                if (cW > imgWidth) {
                    ctx.drawImage(image, cW / 2 - imgWidth / 2, cH / 2 - imgHeight / 2 + this.canvasPosition.deltaY, imgWidth, imgHeight);
                } else {
                    ctx.drawImage(image, middleX, middleY + (offsetTop + this.canvasPosition.deltaY), imgWidth * aspectRatio, imgHeight * aspectRatio);
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

    addInteractions() {
        this.interactionsMap.listeners.on();
    }

    removeInteractions() {
        this.interactionsMap.listeners.off();
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
     * Sets coordinates for the current scroll on the canvas
     * Calc if in deadzone to avoid overscrolling
     * @param {object} ev object
     */
    setCoors(ev) {
        let
            bbox = this.canvas.getBoundingClientRect(),
            eventObject = this.touch ? ev.touches[0] : ev,
            canvasPosition = this.canvasPosition,
            lastXPosition = (-this.canvas.width * (this.imageCount - 1)),
            lastYPosition = (-this.canvas.height * (this.imageCount - 1)),
            coors = this.coors;

        coors.x = eventObject.clientX - bbox.left;
        coors.y = eventObject.clientY - bbox.top;

        canvasPosition.deltaX = (coors.x - coors.clientX);
        canvasPosition.deltaY = (coors.y - coors.clientY);

        switch (this.direction) {
            case 'horizontal':
                if (canvasPosition.deltaX > 0) {
                    canvasPosition.deltaX = 0;
                } else if (canvasPosition.deltaX < lastXPosition ) {
                    canvasPosition.deltaX = lastXPosition;
                }
                break;
            case 'vertical':
            default:
                if (canvasPosition.deltaY > 0) {
                    canvasPosition.deltaY = 0;
                } else if (canvasPosition.deltaY < lastYPosition) {
                    canvasPosition.deltaY = lastYPosition;
                }
                break;
        }
        this.updateSlider();
    }

    /**
     * Handles all slider interactions
     * @param ev {object} event
     */
    handleInteraction(ev) {
        let
            eT = ev.type,
            coors = this.coors,
            eventObject = this.touch ? ev.touches[0] : ev,
            canvas = this.canvas, canvasPosition = this.canvasPosition,
            bbox = canvas.getBoundingClientRect();

        if (eT === 'mousedown' || eT === 'touchstart') {

            coors.clientX = (eventObject.clientX - bbox.left) - canvasPosition.deltaX;
            coors.clientY = (eventObject.clientY - bbox.top) - canvasPosition.deltaY;

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