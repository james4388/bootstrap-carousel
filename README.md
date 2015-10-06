# bootstrap-carousel
Create bootstrap carousel and lightbox via simple html markup


----------


**Dependency**:
 - jQuery
 - Bootstrap (js)

**Usage**:
Create a container contain your images
```html
    <div class="make-me-carousel">
       <img src="img1.thumb.jpg" alt="" fullsize="img1.jpg" title="Image title" data-caption="This is image caption" /> 
       <img src="img2.jpg" alt="" title="Image title" data-caption="This is image caption" /> 
       <img src="img3.jpg" alt="" title="Image title" data-caption="This is image caption" /> 
    </div>
```
Call `bootstrapCarousel` with javascript
```javascript
$('.make-me-carousel').bootstrapCarousel(
  captionData : 'caption', //Attribute selector for caption
  fullImgData : 'fullsize',//Attribute selector for bigger image when open with light box
  lightbox    : true,      //Use lightbox (default bootstrap modal)
  interval    : 5000,             //default bootstrap carousel data
  pause       : "hover",
  wrap        : true,
  keyboard    : true
);
```

That's it!!!

