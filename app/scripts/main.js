
$.fn.exists = function() {
  return this.length !== 0;
}

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
    editing: undefined,
    showProperties: false
  },
  size: {
    name: 'size',
    width: '100',
    editing: undefined
  },
  breakpoint: {
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


// Classes
function Image(options) {
  var self = this;
  var set = $.extend({}, defaults.image, options);

  self.id = set.id;
  self.name = ko.observable(set.name);
  self.sizes = ko.observableArray(set.sizes);
  self.breakpoints = ko.observableArray(set.breakpoints);
  self.active = ko.observable(set.active);
  self.showProperties = ko.observable(set.showProperties);
  self.editing = ko.observable();

  if(set.editing !== undefined) {
    self.editing(self[set.editing]);
  }
  self.isEditing = function(value) {
    return value === self.editing();
  };
  self.clearEdit = function(value) {
    if (value === self.editing()) {
      self.editing(null);
    }
  };

  ko.computed(function() {
    if(self.showProperties()) { return; }

    if(self.editing() === null || self.sizes().length > 0 || self.breakpoints().length > 0) {
      self.showProperties(true);
    }
  });

  self.output = ko.computed(function() {
    var outputHtml = '&lt;img ';
    var sizes = self.sizes();
    var breakpoints = self.breakpoints();
    var name = self.name();

    if (sizes.length > 0) {
      outputHtml += 'srcset="';
      for (var key in sizes) {
        var size = sizes[key];
        var sizeWidth = size.width();
        var iteration = parseInt(key) + 1;

        outputHtml += 'http://placehold.it/' + sizeWidth + 'x' + sizeWidth + ' ' + sizeWidth + 'w';

        if (iteration !== sizes.length) {
          outputHtml += ',&NewLine;' + spaces(13);
        } else {
          outputHtml += '"';
        }
      }
      outputHtml += '&NewLine;' + spaces(5);
    }

    if (breakpoints.length > 0) {
      outputHtml += 'sizes="';
      for (var key in breakpoints) {
        var breakpoint = breakpoints[key];
        var iteration = parseInt(key) + 1;

        outputHtml += '(' + breakpoint.type() + ': ' + breakpoint.breakWidth() + 'px) ' + breakpoint.displayWidth() + breakpoint.unit();

        if (iteration !== breakpoints.length) {
          outputHtml += ',&NewLine;' + spaces(12);
        } else {
          outputHtml += '"';
        }
      }
      outputHtml += '&NewLine;' + spaces(5);
    }

    outputHtml += 'alt="' + name + '" /&gt;';

    return outputHtml;
  });
}
function Size(options) {
  var self = this;
  var set = $.extend({}, defaults.size, options);

  self.id = set.id;
  self.name = ko.observable(set.name);
  self.width = ko.observable(set.width);
  self.height = ko.observable(set.width);
  self.editing = ko.observable();

  if(set.editing !== undefined) {
    self.editing(self[set.editing]);
  }
  self.isEditing = function(value) {
    return value === self.editing();
  };
  self.clearEdit = function(value) {
    if (value === self.editing()) {
      self.editing(null);
    }
  };
}
function Breakpoint(options) {
  var self = this;
  var set = $.extend({}, defaults.breakpoint, options);

  self.id = set.id;
  self.type = ko.observable(set.type);
  self.breakWidth = ko.observable(set.breakWidth);
  self.displayWidth = ko.observable(set.displayWidth);
  self.unit = ko.observable(set.unit);

  self.verboseType = function() {
    if(self.type() === 'min-width') { return 'larger than'; }
    if(self.type() === 'max-width') { return 'smaller than'; }
  };

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

  self.loss = ko.computed(function () {
    var loss;
    var sizeFound = false;

    if(!$.isEmptyObject(viewmodel.activeImage()) && viewmodel.activeImage().sizes().length > 0) { // <-- check if there are sizes to calculate with
      var displayWidth = false;
      var sizes = viewmodel.activeImage().sizes();
      var breakpoints = viewmodel.activeImage().breakpoints();

      for (var key1 in sizes) {
        var size = sizes[key1];

        for (var key2 in breakpoints) {
          var breakpoint = breakpoints[key2];
          var breakpointTest = breakpoint.test(self.width);
          if (breakpointTest) {
            displayWidth = breakpointTest;
            break;
          }
        }

        if (displayWidth) {
          var displayHeight = displayWidth;

          var deviceLoss = size.width() * size.height() - (self.density * displayWidth) * (self.density * displayHeight);
          var lossInKb = deviceLoss * 4 / 1024;

          if (deviceLoss >= 0 && (deviceLoss < loss || typeof loss === 'undefined')) {
            loss = lossInKb;
            self.usingSize(size.width());
            sizeFound = true;
          }
        }
      }
    }

    if (!sizeFound) {
      self.usingSize('-');
      return '-';
    } else {
      return loss != 0 ? Math.round((loss + 0.00001) / 1024 * 10 ) / 10 + ' MB' : loss;
    }
  });
}


// Viewmodel
function DevicesViewModel() {
  var self = this;

  self.images = ko.observableArray();
  self.activeImage = ko.observable(new Image());
  self.devices = ko.observableArray();

  self.addImage = function(options) {
    // generate unique id
    var newId = genUniqueProperty(self.images(), 'id');

    // merge id to the options
    options = $.extend({}, options, { id: newId });

    // create the new image
    self.images.push(new Image(options));

    // set image as active if it's the first created
    if(self.images().length === 1) {
      self.setActiveImage(newId);
    }
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
    if(self.activeImage().active) {
      self.activeImage().active(false);
    }

    // set the new item as active
    image.active(true);
    self.activeImage(image);
  };
  self.clearActiveImage = function() {
    self.activeImage(new Image());
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

  self.updateOuput = ko.computed(function() {
    if(!$.isEmptyObject(self.activeImage())) {
      $('#js-output').html(self.activeImage().output());
    }
  });

}

var viewmodel = new DevicesViewModel();

// setting up some initial data, this will be moved once local storage is implemented.
// also, intitial data might be removed once the 'intro' is in place.

viewmodel.addImage({ name: 'Example image' });
viewmodel.addBreakpoint({ displayWidth: 100 });
viewmodel.addSize({ width: 1600 });
viewmodel.addSize({ width: 2000 });
viewmodel.addSize({ width: 1200 });

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


$('[data-toggle="accordion').each(function() {
  var $this = $(this);
  $this.set = {
    target: $($this.data('target')),
    parent: $($this.data('parent')),
    isActive: false,
  };

  if(!$this.set.target.hasClass('collapse')) {
    return; // fail, target needs to has class collapse.
  }

  if($this.set.parent.exists()) {
    $this.on('click', function() {
      if($this.set.parent.find($('.collapsing')).exists()) {
        return;
      }
      $this.set.isActive = $this.hasClass('active');

      $this.set.parent.find($('.collapse.in')).collapse('hide');
      $this.set.parent.find($('[data-toggle="accordion"]')).removeClass('active');

      if(!$this.set.isActive) {
        $this.addClass('active');
        $this.set.target.collapse('show');
      }

    });
  } else if(!$this.set.parent.exists()) {
    $this.on('click', function() {
      if($this.set.target.hasClass('collapsing')) {
        return;
      }
      $this.set.isActive = $this.hasClass('active');

      if($this.set.isActive) {
        $this.removeClass('active');
        $this.set.target.collapse('hide');
      } else {
        $this.addClass('active');
        $this.set.target.collapse('show');
      }

    });
  }
});


/*$('[data-toggle="tooltip"]').tooltip();*/