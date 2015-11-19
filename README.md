#Canvas slider [![Build Status](https://travis-ci.org/code0wl/canvas-slider.svg)](https://travis-ci.org/code0wl/canvas-slider)

A free canvas slider to be used with remote or local data.
Use when speed is absolutely a necessity! Also works on mobile.

###Features
- image fetch api
- image to canvas convertion
- documented code coverage
- modern buildstreet
- Image aspect ratio resize
- horizontal scroll
- vertical scroll
- map events to canvas coordinates
- linting
- no libs, clean ES2015 (w/babel)

###Feature pipeline
- Mobile
- import image
- select image to modify
- add effects to image
- !deadzone scrolling 
- crop image
- rotate image
- force scroll with physics and momentum

###usage
Checkout the project from this github repo
    
    cd canvas-slider
    npm i 
    gulp serve
    
    

###api
    document.addEventListener('DOMContentLoaded', function() {
        var dcDogs = new CanvasSlider({
            element: '.js-slider',
            direction: 'horizontal',
            data: '/data/dcdogs.json',
            dimensions: {
                width: '600',
                height: '400'
            }
        });
    });
    
    <!-- or... -->
    
    document.addEventListener('DOMContentLoaded', function() {
            var dcDogs = new CanvasSlider({
                element: '.js-slider',
                direction: 'vertical',
                data: '/data/dcdogs.json',
                dimensions: {
                    width: '600',
                    height: '400'
                }
            });
        });
    
    
###additional
Enter the following for a list of build tasks
    
    gulp help
