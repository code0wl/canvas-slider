#Canvas slider (under construction) [![Build Status](https://travis-ci.org/code0wl/canvas-slider.svg)](https://travis-ci.org/code0wl/canvas-slider)

A free canvas slider to be used with remote or local data.
Use when speed is absolutely a necessity! Also works on mobile.

###Features
- image fetch api
- image to canvas convertion
- documented code coverage
- Modern buildstreet
- Image aspect ratio resize 
- Map events to canvas coordinates
- linting
- no libs, clean ES2015

###Feature pipeline
- Webpack integration
- Horizontal scroll
- Vertical scroll
- Both for possible screensave mode
- Tests

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
    
    
###additional
Enter the following for a list of build tasks
    
    gulp help
    

###Expected completion time
19 - 11 - 2015