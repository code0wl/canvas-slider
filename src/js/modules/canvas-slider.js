'use strict';

class CanvasSlider {

    constructor(...options) {
        this.buildSlider(...options);
        this.images;
    }

    buildSlider(options) {
        this.setDirection(options.direction);
        this.fetchData(options.data);
        this.setdimensions(options.dimensions);
    }

    setdimensions(dimensions) {
        let canvas = document.querySelector('.js-slider');
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
                    this.setImages(data.DCdogs);
                })
                .catch(() => {
                    console.error("Unfortunately your remote source failed");
                });

        } else {
            return false;
        }
    }

    handleInteraction() {
        
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

    setImages(images) {
        if (images) {
            let imgs = {};
            Object.keys(images).map((image) => {
                return imgs[image] = images[image].url;
            });

            this.images = imgs;
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

