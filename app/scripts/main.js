ko.options.deferUpdates = true;

var initialDevices = [
  { name: 'Desktop', width: 1920, density: 1, flagged: true },
  { name: 'iPhone4 - standing', width: 320, density: 2, flagged: true },
  { name: 'iPhone4 - landscape', width: 480, density: 2 },
  { name: 'iPhone5 - standing', width: 320, density: 2 },
  { name: 'iPhone5 - landscape', width: 568, density: 2 },
  { name: 'iPhone6 - standing', width: 375, density: 2, flagged: true },
  { name: 'iPhone6 - landscape', width: 627, density: 2 },
  { name: 'iPhone6+ - standing', width: 414, density: 3, flagged: true },
  { name: 'iPhone6+ - landscape', width: 736, density: 3 },
  { name: 'iPad - standing', width: 768, density: 2, flagged: true },
  { name: 'iPad - landscape', width: 1024, density: 2, flagged: true },
  { name: 'Nexus10 - standing', width: 800, density: 2 },
  { name: 'Nexus10 - landscape', width: 1280, density: 2 },
  { name: 'Nexus4 - standing', width: 384, density: 2 },
  { name: 'Nexus4 - landscape', width: 567, density: 2 },
  { name: 'Nexus5 - standing', width: 360, density: 3 },
  { name: 'Nexus5 - landscape', width: 567, density: 3 },
  { name: 'Nexus6 - standing', width: 412, density: 3.5 },
  { name: 'Nexus6 - landscape', width: 659, density: 3.5 },
  { name: 'Nexus7 - standing', width: 600, density: 2 },
  { name: 'Nexus7 - landscape', width: 960, density: 2 },
  { name: 'Laptop HiDPI', width: 1440, density: 2 },
  { name: 'Laptop', width: 1280, density: 1, flagged: true },
  { name: 'Lumia 520 - standing', width: 320, density: 1.4 },
  { name: 'Lumia 520 - landscape', width: 533, density: 1.4 },
  { name: 'Nokia N9 - standing', width: 360, density: 1 },
  { name: 'Nokia N9 - landscape', width: 640, density: 1 },
  { name: 'iPad Pro - standing', width: 2732, density: 2 },
  { name: 'iPad Pro - landscape', width: 2048, density: 2 }
  /*{ name: 'test', width: 400, density: 2, flagged: true }*/
];

// Default values for classes
var defaults = {
  image: {
    name: 'image',
    active: false,
    size: {
      name: 'Original',
      width: 1920,
      height: 1080
    },
    breakpoint: {
      name: 'Default',
      type: 'min-width',
      breakWidth: 0
    }
  },
  size: {
    name: 'Nameless Size',
    width: 0
  },
  breakpoint: {
    name: 'Nameless Query',
    type: 'min-width',
    breakWidth: 0,
    displayWidth: 50,
    unit: 'vw'
  },
  device: {
    name: 'device',
    width: 0,
    density: 1,
    flagged: false
  }
};


// Helpers
function genUniqueProperty(array, property) { // <-- only handles integers
  var newProperty = -1;
  for (var key in array) {
    var item = array[key];
    var itemProperty = typeof item[property] === 'function' ? item[property]() : item[property]; // <-- if property is a function (observable ect.) excecute it to get value

    if (newProperty < itemProperty) {
      newProperty = itemProperty;
    }
  }
  newProperty += 1;
  return newProperty;
}
function spaces(quantity) {
  var string = '';
  for (var i = quantity; i !== 0; i--) {
    string += '&nbsp;';
  }
  return string;
}
$.fn.exists = function() {
  return this.length !== 0;
}
Object.allKeys = function(obj) {
  var result = [];
  for (var prop in obj) {
    var value = obj[prop];
    if (typeof value === 'object') {
      result = result.concat(Object.allKeys(value));
    }
    result.push(prop);
  }
  return result;
}


// Classes
function Image(options) {
  var self = this;
  var set = $.extend({}, defaults.image, options);

  self.id = set.id;
  self.name = ko.observable(set.name);
  self.active = ko.observable(set.active);
  self.size = new Size(set.size);
  self.sizes = ko.observableArray([]);
  self.breakpoint = new Breakpoint(set.breakpoint);
  self.breakpoints = ko.observableArray();
  self.editing = ko.observable(self[set.editing]);
  self.output = ko.computed(function() {
    var outputHtml = '&lt;img ';
    var sizes = self.sizes();
    var breakpoints = self.breakpoints();

    //sizes
    outputHtml += 'srcset="';
    for (var key in sizes) {
      var size = sizes[key];
      outputHtml += 'http://placehold.it/' + size.width() + 'x' + size.height() + ' ' + size.width() + 'w';
      outputHtml += ',&NewLine;' + spaces(13);
    }

    outputHtml += 'http://placehold.it/' + self.size.width() + 'x' + self.size.height() + ' ' + self.size.width() + 'w"';
    outputHtml += '&NewLine;' + spaces(5);

    //breakpoints
    outputHtml += 'sizes="';

    for (var key in breakpoints) {
      var breakpoint = breakpoints[key];

      outputHtml += '(' + breakpoint.type() + ': ' + breakpoint.breakWidth() + 'px) ' + breakpoint.displayWidth() + breakpoint.unit();
      outputHtml += ',&NewLine;' + spaces(12);
    }

    outputHtml += self.breakpoint.displayWidth() + self.breakpoint.unit() + '"';
    outputHtml += '&NewLine;' + spaces(5);

    outputHtml += 'alt="' + self.name() + '" /&gt;';
    
    return outputHtml;
  });

  $.each(set.sizes, function() {
    self.sizes.push(new Size(this));
  });
  $.each(set.breakpoints, function() {
    self.breakpoints.push(new Breakpoint(this));
  });
}
Image.prototype.isEditing = function(value) {
  return value === this.editing();
}
Image.prototype.clearEdit = function(value) {
  if (value === this.editing()) {
    this.editing(null);
  }
}
Image.prototype.toggleEdit = function(value) {
  if (this.isEditing(value)) {
    this.clearEdit(value);
  } else {
    this.editing(value);
  }
}

function Size(options) {
  var self = this;
  var set = $.extend({}, defaults.size, options);

  self.id = set.id;
  self.name = ko.observable(set.name);
  self.width = ko.observable(set.width);
  /*self.editing = ko.observable();*/
  self.raw = set.raw;

  if(self.id === undefined) { // <- reasoning being all sizes thats in the arr should have gotten an id
    self.height = ko.observable(set.height);
    self.ratio = ko.computed(function() {
      return self.height() / self.width();
    });
  } else {
    self.height = ko.computed(function() {
      if(!$.isEmptyObject(viewmodel.activeImage())) {
        return Math.ceil(self.width() * viewmodel.activeImage().size.ratio());
      }
    });
  }

  /*if(set.editing !== undefined) {
    self.editing(self[set.editing]);
  }
  self.isEditing = function(value) {
    return value === self.editing();
  };
  self.clearEdit = function(value) {
    if (value === self.editing()) {
      self.editing(null);
    }
  };*/
}
function Breakpoint(options) {
  var self = this;
  var set = $.extend({}, defaults.breakpoint, options);

  self.id = set.id;
  self.name = ko.observable(set.name);
  self.type = ko.observable(set.type);
  self.types = [ { name: 'min-width', val: 'min-width' }, { name: 'max-width', val: 'max-width' } ];
  self.breakWidth = ko.observable(set.breakWidth);
  self.displayWidth = ko.observable(set.displayWidth);
  self.unit = ko.observable(set.unit);
  self.units = [ 'px', 'vw' ];

  // Test will check if the parameter displayWidth fits inside the breakpoint,
  // so if the breakpoint is 'min-width': 1600 px, then the displayWidth needs
  // to be 1600px or larger.
  // It also takes into account how large the image should be viewed at that
  // browser width, so in the above example, if the self.displayWidth would be
  // 50%, then the image needs to be 800px or larger.
  self.test = function(displayWidth) {
    if (self.type() === 'min-width' && displayWidth >= self.breakWidth() || self.type() === 'max-width' && displayWidth <= self.breakWidth()) {
      if (self.unit() === 'px') {
        return displayWidth > self.displayWidth() ? self.displayWidth() : displayWidth;
      } else if (self.unit() === 'vw') {
        return displayWidth * self.displayWidth() / 100;
      } // add more units here if needed
    } else {
      return false;
    }
  };
}
function Device(options) {
  var self = this;
  var set = $.extend({}, defaults.device, options);

  self.id = set.id;
  self.name = set.name;
  self.width = set.width;
  self.density = set.density;
  self.flagged = ko.observable(set.flagged);
  self.usingSize = ko.observable('-');

  self.toggleFlag = function() {
    if(self.flagged()) {
      self.flagged(false);
    } else {
      self.flagged(true);
    }
  };

  self.loss = ko.computed( function() {
    if($.isEmptyObject(viewmodel.activeImage())) {
      self.usingSize('-');
      return 'undefined';
    }

    var returnedLoss;
    var sizes = [].concat(viewmodel.activeImage().sizes()).concat(viewmodel.activeImage().size);
    var breakpoints = [].concat(viewmodel.activeImage().breakpoints()).concat(viewmodel.activeImage().breakpoint);

    for (var key1 in sizes) {
      var size = sizes[key1];
      var breakpointTest = false;

      if(size.width() < 1) {
        continue;
      }

      for (var key2 in breakpoints) {
        var breakpoint = breakpoints[key2];
        breakpointTest = breakpoint.test(self.width);
        if (breakpointTest) {
          break;
        }
      }

      if (breakpointTest) {
        var renderWidth = breakpointTest;
        var renderHeight = breakpointTest * viewmodel.activeImage().size.ratio();
        var loss = size.width() * size.height() - (self.density * renderWidth) * (self.density * renderHeight);
        
        if (loss >= 0 && (loss < returnedLoss || typeof returnedLoss === 'undefined')) {
          self.usingSize(size.width());
          returnedLoss = loss;
        } else if ((returnedLoss < 0 || typeof returnedLoss === 'undefined') && (loss > returnedLoss || typeof returnedLoss === 'undefined')) {
          self.usingSize(size.width());
          returnedLoss = loss;
        }
      }
    }

    if (typeof returnedLoss === 'undefined') {
      self.usingSize('-');
      return 'undefined';
    } else {
      return returnedLoss;
    }
  });

  self.lossOutput = ko.computed( function() {
    var loss = self.loss();

    if (loss === 0) {
      return loss + ' KB';
    } else if (loss > 0) {
      return Math.round(loss * 4 / 1024 + 0.00001) + ' KB';
      //return Math.round((loss * 4 / 1024 + 0.00001) / 1024 * 10) / 10 + ' MB';
    } else if (loss < 0) {
      return 'Upscaled';
    } else {
      return '-';
    }
  });
}


// Viewmodel
function DevicesViewModel() {
  var self = this;

  self.images = ko.observableArray();
  self.activeImage = ko.observable();
  self.editingImage = ko.observable();
  self.devices = ko.observableArray();

  self.addImage = function(options) {
    var newId = genUniqueProperty(self.images(), 'id');
    options = $.extend({}, options, { id: newId });
    self.images.push(new Image(options));

    self.setActiveImage(newId);
  };
  self.removeImage = function(id) {
    var image = ko.utils.arrayFirst(self.images(), function(image) { return image.id === id; });

    if(image.active()) {
      self.clearActiveImage();
    }

    self.images.remove(image);
  };
  self.setActiveImage = function(id) {
    var image = ko.utils.arrayFirst(self.images(), function(image) { return image.id === id; });

    // early escape if the selected image is already active
    if(image.active()) { return; }

    // remove active from the already active image
    self.clearActiveImage();

    // set the new item as active
    image.active(true);
    self.activeImage(image);
  };
  self.clearActiveImage = function() {
    if(!$.isEmptyObject(self.activeImage()) && self.activeImage().active) {
      self.activeImage().active(false);
    }
    self.activeImage(undefined);
  };
  self.addSize = function(options) {
    // generate unique id
    var newId = genUniqueProperty(self.activeImage().sizes(), 'id');
    options = $.extend({}, options, { id: newId });

    // create the new size
    var size = new Size(options);
    self.activeImage().sizes.push(size);
  };
  self.removeSize = function(id) {
    self.activeImage().sizes.remove( function(size) { return size.id === id; });
  };
  self.addBreakpoint = function(options) {
    // generate unique id
    var newId = genUniqueProperty(self.activeImage().breakpoints(), 'id');
    options = $.extend({}, options, { id: newId });

    // create the new breakpoint
    self.activeImage().breakpoints.push(new Breakpoint(options));
  };
  self.removeBreakpoint = function(id) {
    self.activeImage().breakpoints.remove( function(breakpoint) { return breakpoint.id === id; });
  };
  self.addDevice = function(options) {
    var newId = genUniqueProperty(self.devices(), 'id');

    options = $.extend({}, options, { id: newId });

    self.devices.push(new Device(options));
  };
  self.removeDevice = function(id) {

  };
}

var viewmodel = new DevicesViewModel();

// setting up some initial data, this will be moved once local storage is implemented.
// also, intitial data might be removed once the 'intro' is in place.

viewmodel.addImage();

$.map(initialDevices, function (item) { viewmodel.addDevice(item); });

ko.bindingHandlers.visibleAndSelect = {
  update: function(element, valueAccessor) {
    ko.bindingHandlers.visible.update(element, valueAccessor);

    if (valueAccessor()) {
      $(element).find('input').focus().select();
    }
  }
};

ko.bindingHandlers.selected = {
  update: function(element, valueAccessor) {
    var value = ko.unwrap(valueAccessor());

    if (value) {
      element.select();
    }
  }
};

ko.applyBindings(viewmodel);

$('.panel-content').on('click', '.component-header', function() {
  $(this).parent().toggleClass('active');
});

$('.col-top').on('click', '.panel-handle', function() {
  $(this).parent().siblings('.panel.active').removeClass('active');
  $(this).parent().addClass('active');
});

$('.modal').on('click', '.modal-bg', function() {
  $(this).closest('.modal').removeClass('open');
});

$('.modal').on('click', '[data-dismiss="modal"]', function() {
  $(this).closest('.modal').removeClass('open');

});

$('[data-toggle="modal"]').on('click', function() {
  var target = $(this).data('target');

  $(target).addClass('open');
});

/*
$('.col-top').sortable({
  connectWith: '.col-top',
  handle: '.panel-handle',
  distance: 32,
  scroll: false,
  tolerance: 'pointer',
  containment: 'window'
});

$('.col-top').on('sortstart', function(event, ui) {
  $(this).find('.panel:not(.active)').first().addClass('active');
})

$('.col-top').on('sortstop', function(event, ui) {
  if($(this).find(ui.item).length) {
    $(this).find('.panel.active').removeClass('active');
    ui.item.addClass('active');
  }
})

$('.col-top').on('sortreceive', function(event, ui) {
  $(this).find('.panel.active').removeClass('active');
  ui.item.addClass('active');
})*/

//$('[selectmenu="true"]').selectmenu();




/*$('[data-toggle="tooltip"]').tooltip();*/