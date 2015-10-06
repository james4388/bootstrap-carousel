/*
 *  jquery-bootstrap-carousel
 *  Collect a list of image and create bootstrap carousel.
 *
 *  Made by Nhu Trinh nhutrinh.com
 */
;(function ( $, window, document, undefined ) {

  "use strict";
  var pluginName = "bootstrapCarousel",
    pluginVersion = '1.0',
    defaults = {
      captionData : 'caption',        //Data to extract caption text, can be html
      fullImgData : 'fullsize',       //Fullsize image url, must use with lightbox option
      lightbox    : true,
      lightboxTriggerClass: 'lbtrigger',
      lightboxCaptionClass : 'carousel-caption',
      modalContentSelector : '.modal-body .content',

      //Template
      tplCarousel : '<div class="carousel slide" data-ride="carousel"/>', //Allow to change template
      tplPrev     : '<a class="left carousel-control" role="button" data-slide="prev">'+
                      '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>'+
                      '<span class="sr-only">Previous</span>'+
                    '</a>',
      tplNext     : '<a class="right carousel-control" role="button" data-slide="next">'+
                      '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>'+
                      '<span class="sr-only">Next</span>'+
                    '</a>',
      tplIndicators: '<ol class="carousel-indicators"/>',
      tplCarouselInner : '<div class="carousel-inner" role="listbox"/>',
      tplItem     : '<div class="item"/>',
      tplCaption  : '<div class="carousel-caption"/>',
      tplLightBox : '<div class="modal fade" id="bootstrap-carousel-lightbox">' +
                      '<div class="modal-dialog modal-lg">' +
                        '<div class="modal-content">' +
                          '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                            '<h4 class="modal-title"></h4>' +
                          '</div>' +
                          '<div class="modal-body">' +
                            '<div class="container-fluid">' +
                              '<div class="row content">'+
                              '</div>' +
                            '</div>' +
                          '</div>' +
                          '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                          '</div>' +
                        '</div>' +
                      '</div>' +
                    '</div>',

      interval    : 5000,             //bootstrap carousel data
      pause       : "hover",
      wrap        : true,
      keyboard    : true
    },
    exportedMethod = ['cycle','pause','to','prev','next'];

  // The actual plugin constructor
  function Plugin ( element, options ) {
    this.element = element;
    this.$el = $(element);
    this.exported = exportedMethod;
    this.opts = $.extend( {}, defaults, options );
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }
  
  function getLightBox(opts){
    var $modal, $prev, $next;
    $modal = $('body').data('_bootstrap_lightbox_modal');
    if (!$modal){
      $modal = $(opts.tplLightBox).appendTo('body');
      $modal.modal({show: false});
      $prev = $(opts.tplPrev);
      $next = $(opts.tplNext);
      $modal.find(opts.modalContentSelector).after($prev).after($next);
      $modal.on('hidden.bs.modal', function () {
        var $carousel = $(this).data('_current_carousel');
        if ($carousel){
          $carousel.carousel('cycle');
        }
      });
      $modal.on('click', '.carousel-control', function(e){
        var $active, $modal, $carousel, data, $next, nextIndex;
        e.preventDefault();
        e.stopPropagation();
        $modal = $('body').data('_bootstrap_lightbox_modal');
        if (!$modal) return;
        $carousel = $modal.data('_current_carousel');
        data = $carousel.data('bs.carousel'); //Need to access real carousel object to use its api
        $active = $carousel.find('.item.active');
        if($(this).hasClass('left')){
          $next = data.getItemForDirection('prev', $active);
          data.slide('prev');
        }else{
          $next = data.getItemForDirection('next', $active);
          data.slide('next');
        }
        nextIndex = data.getItemIndex($next);
        $next.trigger('click'); //Dirty trigger;
        return false;
      });
      $('body').data('_bootstrap_lightbox_modal', $modal);
    }
    return $modal;
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {
    init: function () {
      var self = this;
      var carouselID = 'carousel-' + this.uuid();
      var $carousel = $(this.opts.tplCarousel),
          $indicators = $(this.opts.tplIndicators),
          $carouselInner = $(this.opts.tplCarouselInner),
          $prev, $next, $modal;

      //Collect image and create real carousel
      $carousel.insertBefore(this.$el).append(this.$el).attr('id', carouselID);
      this.$el.find('img').each(function(index){
        var $img, $caption, $indicator, $citem;
        $img = $(this);
        $indicator = $('<li/>').attr('data-target', '#' + carouselID).attr('data-slide-to',index);
        $indicators.append($indicator);
        $citem = $(self.opts.tplItem);
        $citem.append($img);
        if (self.opts.lightbox){
          $citem.addClass(self.opts.lightboxTriggerClass);
        }
        if ($img.data(self.opts.captionData)){
          $caption = $(self.opts.tplCaption);
          $caption.html($img.data(self.opts.captionData));
          $citem.append($caption);
        }
        $carouselInner.append($citem);
      });
      $carouselInner.children('div:first').addClass('active');
      $indicators.children('li:first').addClass('active');
      $indicators.appendTo($carousel);
      $carousel.append($carouselInner);
      $prev = $(this.opts.tplPrev).attr('href','#' + carouselID);
      $next = $(this.opts.tplNext).attr('href','#' + carouselID);
      $carousel.append($prev);
      $carousel.append($next);
      this.$el.hide();

      //Add light box
      if (this.opts.lightbox){
        $modal = getLightBox(self.opts);
        
        $carousel.on('click', '.' + this.opts.lightboxTriggerClass, function(){
          var $modal = getLightBox(self.opts);
          var $img = $('img', this);
          var $caption=$('<div/>');
          var $mdlimg = $img.clone().addClass('img-responsive center-block');
          if ($img.data(self.opts.fullImgData)){
            $mdlimg.attr('src', $img.data(self.opts.fullImgData));
          }
          $modal.data('_current_carousel', $carousel);
          $carousel.carousel('pause');
          $modal.find('.modal-title').html($img.attr('title') || 'Image ' + ($(this).index() + 1));
          $caption.addClass(self.opts.lightboxCaptionClass)
                  .html($img.data(self.opts.captionData));
          $modal.find(self.opts.modalContentSelector)
                .html('')
                .append($mdlimg)
                .append($caption)
          $modal.modal('show');
        });
      }

      //Init real carousel
      this.carousel = $carousel.carousel.bind($carousel);
      this.carousel({
        interval : this.opts.interval,
        pause    : this.opts.pause,
        wrap     : this.opts.wrap,
        keyboard : this.opts.keyboard
      });
    },
    uuid: function(){ //http://stackoverflow.com/a/8809472/533738
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    },

    //Expose carousel method
    'cycle': function(){
      this.carousel('cycle');
    },
    'pause': function(){
      this.carousel('pause');
    },
    'to' : function(index){
      this.carousel('to', index);
    },
    'prev': function(){
      this.carousel('prev');
    },
    'next': function(){
      this.carousel('next');
    },
    'getactive' : function(){
      console.debug(this.carousel('$active'));
    }
  });

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[ pluginName ] = function ( options ) {
    var extraArgs = [];
    for (var i = 1; i<arguments.length;i++){
      extraArgs.push(arguments[i]);
    }
    return this.each(function() {
      var instance = $.data( this, "plugin_" + pluginName ),
          opts = typeof(options) === 'string' ? {} : options;
      if (!instance) {
        instance = new Plugin( this, opts );
        $.data( this, "plugin_" + pluginName, instance);
      }
      if ( typeof(options) === 'string' && $.inArray(options, instance.exported) != -1 && instance && typeof(instance[options]) === 'function'){
        instance[options].apply(instance, extraArgs);
      }
    });
  };

})( jQuery, window, document );
