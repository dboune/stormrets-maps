
/**
 * Agent Storm Maps Loader
 * Copyright 2010 Agent Storm
 *
 * Dependencies: OpenLayers (Automatically Included)
 */

/**
 * Contains parts of Base.js, version 1.1a
 * Copyright 2006-2010, Dean Edwards
 * License: http://www.opensource.org/licenses/mit-license.php
 */

var Base = function() {};
Base.extend = function(_instance, _static) { // subclass
	var extend = Base.prototype.extend;
	Base._prototyping = true;
	var proto = new this;
	extend.call(proto, _instance);
    proto.base = function() { };
	delete Base._prototyping;
	
	var constructor = proto.constructor;
	var klass = proto.constructor = function() {
		if (!Base._prototyping) {
			if (this._constructing || this.constructor == klass) { // instantiation
				this._constructing = true;
				constructor.apply(this, arguments);
				delete this._constructing;
			} else if (arguments[0] !== null) { // casting
				return (arguments[0].extend || extend).call(arguments[0], proto);
			}
		}
	};
	
	klass.ancestor = this;
	klass.extend = this.extend;
	klass.forEach = this.forEach;
	klass.implement = this.implement;
	klass.prototype = proto;
	klass.toString = this.toString;
	klass.valueOf = function(type) {
		return (type == "object") ? klass : constructor.valueOf();
	};
	extend.call(klass, _static);
	if (typeof klass.init == "function") {
        klass.init();
    }
	return klass;
};

Base.prototype = {	
	extend: function(source, value) {
		if (arguments.length > 1) {
			var ancestor = this[source];
			if (ancestor && (typeof value == "function") &&
				(!ancestor.valueOf || ancestor.valueOf() != value.valueOf()) &&
				/\bbase\b/.test(value)) {
				var method = value.valueOf();
				value = function() {
					var previous = this.base || Base.prototype.base;
					this.base = ancestor;
					var returnValue = method.apply(this, arguments);
					this.base = previous;
					return returnValue;
				};
				value.valueOf = function(type) {
					return (type == "object") ? value : method;
				};
				value.toString = Base.toString;
			}
			this[source] = value;
		} else if (source) {
			var extend = Base.prototype.extend;
			if (!Base._prototyping && typeof this != "function") {
				extend = this.extend || extend;
			}
			var proto = {toSource: null};
			var hidden = ["constructor", "toString", "valueOf"];
			var i = Base._prototyping ? 0 : 1;
            var key;
			while (key = hidden[i++]) {
				if (source[key] != proto[key]) {
					extend.call(this, key, source[key]);
				}
			}
			for (key in source) {
				if (!proto[key]) {
                    extend.call(this, key, source[key]);
                }
			}
		}
		return this;
	}
};

Base = Base.extend({
	constructor: function() {
		this.extend(arguments[0]);
	}
}, {
	ancestor: Object,
	version: "1.1",
	forEach: function(object, block, context) {
		for (var key in object) {
			if (this.prototype[key] === undefined) {
				block.call(context, object[key], key, object);
			}
		}
	},
	implement: function() {
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "function") {
				arguments[i](this.prototype);
			} else {
				this.prototype.extend(arguments[i]);
			}
		}
		return this;
	},
	toString: function() {
		return String(this.valueOf());
	}
});

/**
 * Binds a function to the given object's scope
 *
 * @param {Object} object The object to bind the function to.
 * @return {Function}	Returns the function bound to the object's scope.
 */
Function.prototype.bind = function (object)
{
	var method = this;
	return function ()
	{
		return method.apply(object, arguments);
	};
};

/**
 * Create a new instance of Event.
 *
 * @classDescription	This class creates a new Event.
 * @return {Object}	Returns a new Event object.
 * @constructor
 */
function Event()
{
	this.events = [];
	this.builtinEvts = [];
}

/**
 * Gets the index of the given action for the element
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {Number} Returns an integer.
 */
Event.prototype.getActionIdx = function(obj,evt,action,binding)
{
	if(obj && evt)
	{

		var curel = this.events[obj][evt];
		if(curel)
		{
			var len = curel.length;
			for(var i = len-1;i >= 0;i--)
			{
				if(curel[i].action == action && curel[i].binding == binding)
				{
					return i;
				}
			}
		}
		else
		{
			return -1;
		}
	}
	return -1;
};

/**
 * Adds a listener
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {null} Returns null.
 */
Event.prototype.addListener = function(obj,evt,action,binding)
{
	if(this.events[obj])
	{
		if(this.events[obj][evt])
		{
			if(this.getActionIdx(obj,evt,action,binding) == -1)
			{
				var curevt = this.events[obj][evt];
				curevt[curevt.length] = {action:action,binding:binding};
			}
		}
		else
		{
			this.events[obj][evt] = [];
			this.events[obj][evt][0] = {action:action,binding:binding};
		}
	}
	else
	{
		this.events[obj] = [];
		this.events[obj][evt] = [];
		this.events[obj][evt][0] = {action:action,binding:binding};
	}
};

/**
 * Removes a listener
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {null} Returns null.
 */
Event.prototype.removeListener = function(obj,evt,action,binding)
{
	if(this.events[obj])
	{
		if(this.events[obj][evt])
		{
			var idx = this.actionExists(obj,evt,action,binding);
			if(idx >= 0)
			{
				this.events[obj][evt].splice(idx,1);
			}
		}
	}
};

/**
 * Fires an event
 *
 * @memberOf Event
 * @param e [(event)] A builtin event passthrough
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Object} args The argument attached to the event.
 * @return {null} Returns null.
 */
Event.prototype.fireEvent = function(e,obj,evt,args)
{
	if(!e){e = window.event;}

	if(obj && this.events)
	{
		var evtel = this.events[obj];
		if(evtel)
		{
			var curel = evtel[evt];
			if(curel)
			{
				for(var act in curel)
				{
					var action = curel[act].action;
					if(curel[act].binding)
					{
						action = action.bind(curel[act].binding);
					}
					action(e,args);
				}
			}
		}
	}
};


var AgentStormMap = Base.extend({
    
    resolutions: [],
    controls: [],
    
    minScale: 0,
    projection: "",
    maxExtent: "",
    units: "m",
    displayProjection: null,
    markers: null,
    debug: false,
    
    event: new Event(),
    
    //target: null,
    //map: null,
    //map_layer: null,
    //logo: null,
    
    constructor: function(target, map_type, debug) {
        
        var map_object = this;
        var head = document.getElementsByTagName('head')[0];
        
        this.scripts_loaded = 1;
        this.script_queue = [
            this.getAgentStormUrl(debug) + '/static/js/openlayers/OpenLayers.js'
        ];
        
        // Generate the CSS File Include
        //
        var css = document.createElement('link');
        css.type = 'text/css';
        css.rel = 'stylesheet';
        css.href = this.getAgentStormUrl(debug) + '/static/css/maps.css';
        css.media = 'screen';
        head.appendChild(css);
        
        // Process the Script Queue and Load each file
        //
        if (this.script_queue) {
            for (var s in this.script_queue) {
                var script = document.createElement('script');
                script.type= 'text/javascript';
                script.src = this.script_queue[s];
                script.onreadystatechange = this.initStage2IE(this, target, map_type);
                script.onload = this.initStage2FFWebKit(this, target, map_type);
                head.appendChild(script);
            }
        }
        
    },
	initStage2IE: function(object, target, map_type, debug) {
        return function d() {
            if (this.readyState == 'loaded' || this.readyState == 'completed') {
				object.initStage2(target, map_type, debug);
            }
        };
	},
	initStage2FFWebKit: function(object, target, map_type, debug) {
        return function d() {
			object.initStage2(target, map_type, debug);
        };
	},
	initStage2: function(target, map_type, debug) {
		
        this.scripts_loaded = 0;
		this.script_queue = [];
		
        // Queue the Scripts for loading 
        //
        switch (map_type) {
            case 'google':
                //this.scripts_loaded += 1;
                //this.script_queue.push('http://maps.google.com/maps/api/js?sensor=false&region=US');
                break;
            case 'bing':
                this.scripts_loaded += 1;
                this.script_queue.push('http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6.2&mkt=en-us');
                break;
            case 'yahoo':
                this.scripts_loaded += 1;
                this.script_queue.push('http://api.maps.yahoo.com/ajaxymap?v=3.0&appid=euzuro-openlayers');
                break;
            case 'cloudmade':
                this.scripts_loaded += 1;
                this.script_queue.push(this.getAgentStormUrl(debug) + '/static/js/maps/cloudmade.js');
                break;
            default:
                this.scripts_loaded += 1;
                this.script_queue.push(this.getAgentStormUrl(debug) + '/static/js/maps/agentstorm.js');
                break;
        }
		
        if (this.script_queue) {
            for (var s in this.script_queue) {
		        var head = document.getElementsByTagName('head')[0];
                var script = document.createElement('script');
                script.type= 'text/javascript';
                script.src = this.script_queue[s];
                script.onreadystatechange = this.loadScriptsIE(this, target, map_type);
                script.onload = this.loadScripts(this, target, map_type);
                head.appendChild(script);
            }
        }
	},
    loadScriptsIE: function(object, target, map_type, debug) {
        return function d() {
            if (this.readyState == 'loaded' || this.readyState == 'completed') {
                object.scripts_loaded -= 1;
                if (object.scripts_loaded === 0) {
                    object.initMap(target, map_type, debug);
                }   
            }
        };
    },
    loadScripts: function(object, target, map_type, debug) {
        return function d() {
            object.scripts_loaded -= 1;
            if (object.scripts_loaded === 0) {
                object.initMap(target, map_type, debug);
            }
        };
    },
    initMap: function(target, map_type, debug) {
        
        var map_object = this;
        
        // Setup the Target
        //
        this.target = target;
        
        // Sets the outer most zoom of the map
        //
        this.minScale = 2000000;
        
        // Sets the available resolutions for each zoom level
        //
        this.resolutions = [
            78271.516953125,
            39135.7584765625,
            19567.87923828125,
            9783.939619140625,
            4891.9698095703125,
            2445.9849047851562,
            1222.9924523925781,
            611.4962261962891,
            305.74811309814453,
            152.87405654907226,
            76.43702827453613,
            38.218514137268066,
            19.109257068634033,
            9.554628534317017,
            4.777314267158508,
            2.388657133579254,
            1.194328566789627,
            0.5971642833948135,
            0.29858214169740677,
            0.14929107084870338,
            0.07464553542435169,
            0.037322767712175846
            //0.018661383856087923,
            //0.009330691928043961,
            //0.004665345964021981
        ];
        
        // Setup the Default Controls
        //
        this.controls = [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.KeyboardDefaults(),
            new OpenLayers.Control.LayerSwitcher({
                roundedCornerColor: '#111111'    
            }),
            new OpenLayers.Control.Attribution()
        ];
        
        // Set the Projection type and the max bounds of the map
        //
        this.map_layers = [];
        this.displayProjection = new OpenLayers.Projection("EPSG:4326");
        this.projection = new OpenLayers.Projection('EPSG:900913');
        this.maxExtent = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
        this.units = "m";
        
        // Build the map object
        //
        this.map = new OpenLayers.Map(target, {
            controls: this.controls,
            minScale: this.minScale,
            //resolutions: this.resolutions,
            //projection: this.projection,
            //displayProjection: this.displayProjection,
            maxExtent: this.maxExtent,
            units: this.units,
            maxResolution: 156543.0339,
            numZoomLevels: 18,
			wrapDateLine: true,
            eventListeners: {
                "moveend": this.eventProxy(this, 'moveEnd'),
                "zoomend": this.eventProxy(this, 'zoomEnd'),
                "changelayer": this.eventProxy(this, 'changeLayer'),
                "changebaselayer": this.eventProxy(this, 'changeBaseLayer')
            }
        });
        
        switch (map_type) {
            case 'google':
                this.map_layers.push(new OpenLayers.Layer.Google(
                    "Google Streets",
                    {'sphericalMercator': true}
                ));
                this.map_layers.push(new OpenLayers.Layer.Google(
                    "Google Satellite",
                    {type: G_SATELLITE_MAP, 'sphericalMercator': true, numZoomLevels: 22}
                ));
                this.map_layers.push(new OpenLayers.Layer.Google(
                    "Google Hybrid",
                    {type: G_HYBRID_MAP, 'sphericalMercator': true}
                ));
                break;
            case 'bing':
                this.map_layers.push(new OpenLayers.Layer.VirtualEarth(
                    "Virtual Earth Roads",
                    {'type': VEMapStyle.Road, 'sphericalMercator': true}
                ));
                this.map_layers.push(new OpenLayers.Layer.VirtualEarth(
                    "Virtual Earth Aerial",
                    {'type': VEMapStyle.Aerial, 'sphericalMercator': true}
                ));
                this.map_layers.push(new OpenLayers.Layer.VirtualEarth(
                    "Virtual Earth Hybrid",
                    {'type': VEMapStyle.Hybrid, 'sphericalMercator': true}
                ));
                break;
            case 'yahoo':
                this.map_layers.push(new OpenLayers.Layer.Yahoo(
                    "Yahoo Street",
                    {'sphericalMercator': true}
                ));
                this.map_layers.push(new OpenLayers.Layer.Yahoo(
                    "Yahoo Satellite",
                    {'type': YAHOO_MAP_SAT, 'sphericalMercator': true}
                ));
                this.map_layers.push(new OpenLayers.Layer.Yahoo(
                    "Yahoo Hybrid",
                    {'type': YAHOO_MAP_HYB, 'sphericalMercator': true}
                ));
                break;
            case 'openstreetmap':
                this.map_layers.push(new OpenLayers.Layer.OSM());
                break;
            case 'cloudmade':
                this.map_layers.push(new OpenLayers.Layer.CloudMade("CloudMade", {
                    key: 'BC9A493B41014CAABB98F0471D759707',
                    styleId: 998
                }));
                break;
            default:
                this.map_layers.push(new OpenLayers.Layer.AgentStorm("Agent Storm"));
                break;
        }
        this.map.addLayers(this.map_layers);
        
        // Zoom to outmost zoom level
        //
        if (!this.map.getCenter()) {
            this.map.zoomToMaxExtent();
        }
        
        // Add the Agent Storm Controls
        //
        this.drawLogo();
        this.drawStatus();
        this.drawFullscreen();
        
        // Fire the 'Map Ready' event
        //
        this.event.fireEvent(null, this, 'mapReady');
        
    },
    getAgentStormUrl: function(debug) {
        if (this.debug || debug) {
            return 'http://dev.www.agentstorm.com';
        }
        return 'http://www.agentstorm.com';
    },
    eventProxy: function(object, event_name) {
        return function d(evt) {
            object.event.fireEvent(evt, object, event_name);
        };
    },
    drawLogo: function() {
        this.logo = new OpenLayers.Control.Button({
            displayClass: "olControlImage",
            trigger: function() {
                alert('Logo Clicked');
            }
        });
        this.map.addControls([this.logo]);
    },
    drawStatus: function() {
        this.status = new OpenLayers.Control();
        OpenLayers.Util.extend(this.status, {
            element: null,
            initialize: function(element, options) {
                OpenLayers.Control.prototype.initialize.apply(this, [options]);
                this.element = OpenLayers.Util.getElement(element);        
            },
            draw: function () {
                OpenLayers.Control.prototype.draw.apply(this, arguments);
                if (!this.element) {
                    this.element = document.createElement("div");
                    this.element.className = 'content';
                    this.element.innerHTML = 'Loading...';
                    this.div.appendChild(this.element);
                    this.div.id = 'AgentStorm_StatusBar';
                }
                OpenLayers.Rico.Corner.round(this.div, {
                    corners: "bl",
                    bgColor: "transparent",
                    color: "#444444",
                    blend: false
                });
                return this.div;
            },
            updateStatus: function(status) {
                this.element.innerHTML = status;
            }
        });
        this.map.addControls([this.status]);
    },
    drawFullscreen: function() {
        this.fs = new OpenLayers.Control();
        OpenLayers.Util.extend(this.fs, {
            element: null,
            initialize: function(element, options) {
                OpenLayers.Control.prototype.initialize.apply(this, [options]);
                this.element = OpenLayers.Util.getElement(element);        
            },
            draw: function () {
                OpenLayers.Control.prototype.draw.apply(this, arguments);
                if (!this.element) {
                    
                    this.element = document.createElement("div");
                    this.element.className = 'olFullScreenSwitcher';
                    
                    this.link = document.createElement('a');
                    this.link.innerHTML = 'Fullscreen';
                    this.link.onclick = function() {
                        map_object.toggleFullscreen();
                    };
                    
                    this.element.appendChild(this.link);
                    this.div.appendChild(this.element);
                    this.div.id = 'AgentStorm_Fullscreen';
                    
                }
                return this.div;
            }
        });
        this.map.addControls([this.fs]);
    },
    
    // setCenter/getCenter Functions
    //
    setCenter: function(lat, lon, zoom) {
        var point = new OpenLayers.LonLat(lon, lat);
        if (!zoom) {
            this.map.setCenter(point.transform(this.displayProjection, this.projection));
        } else {
            this.map.setCenter(point.transform(this.displayProjection, this.projection), zoom);
        }
        return this;
    },
    getCenter: function() {
        return this.map.getCenter().transform(this.projection, this.displayProjection);
    },
    
    // Zoom Functions
    //
    getZoom: function() {
        return this.map.getZoom();
    },
    zoomIn: function() {
        this.map.zoomIn();
        return this;
    },
    zoomOut: function() {
        this.map.zoomOut();
        return this;
    },
    zoomTo: function(level) {
        this.map.zoomTo(level);
        return this;
    },
    getBounds: function() {
        return this.map.getExtent().transform(this.projection, this.displayProjection);
    },
    
    // Full sceen method
    //
    toggleFullscreen: function() {
        if (!this.fullscreen) {
            document.getElementById(this.target).className += ' olFullscreen';
            window.document.body.className += ' olFullScreenNoScroll';
            window.scroll(0,0);
            this.fullscreen = true;
        } else {
            document.getElementById(this.target).className = document.getElementById(this.target).className.replace(' olFullscreen', '');
            window.document.body.className = window.document.body.className.replace(' olFullScreenNoScroll', '');
            this.fullscreen = false;
        }
        this.map.updateSize();
        return this;
    },
    
    //
    //
    setMarkerProxyUrl: function(url) {
        this.markerProxyUrl = url;
        return this;
    },
    setMarkerUrl: function(url) {
        this.markerUrl = url;
        return this;
    },
    updateMarkers: function() {
        
        // Check we do not double run
        //
        if (this.updating) {
            return;
        }
        this.updating = true;
        
        // Update the Status
        //
        if (this.status) {
            this.status.updateStatus('Loading...');
        }
        
        // Get a map object that can be used in sub-functions
        //
        map_object = this;
        
        // Get the Properties for the current map view
        //
        bounds = this.getBounds();
        this.ajaxPost(this.markerProxyUrl, {
            'top': bounds.top,
            'left': bounds.left,
            'bottom': bounds.bottom,
            'right': bounds.right
        }, function(request) {
            
            // Parse the results
            //
            if (request.status == 200) {
                result = map_object.parseJSON(request.responseText);
                map_object.clearMarkers();
                for (var p in result.Properties) {
                    var markerSize = -map.getZoom() + (map.getZoom()*2);
                    map_object.addMarker(markerSize, markerSize, map_object.markerUrl, result.Properties[p].Latitude, result.Properties[p].Longitude);
                }
                map_object.status.updateStatus('Showing <strong>' + result.Count + '</strong> of <strong>' + result.TotalCount + '</strong> total properties (' + result.ElapsedTime + ' sec). Zoom in for more');
            }
            
            // Reset the updating flag
            //
            map_object.updating = false;
            
        });
        
    },
    addMarker: function(width, height, icon_url, lat, lon, contentUrl) {
        
        if (!this.markers) {
            this.markers = new OpenLayers.Layer.Markers("Markers");
            this.map.addLayer(this.markers);
        }
        
        var position = new OpenLayers.LonLat(lon, lat).transform(this.displayProjection, this.projection);
        var size = new OpenLayers.Size(width, height);
        var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
        var icon = new OpenLayers.Icon(icon_url, size, offset);
        
        var feature = new OpenLayers.Feature(this.markers, position); 
        feature.closeBox = true;
        feature.popupClass = OpenLayers.Popup.AnchoredBubble;
        feature.data.popupContentHTML = 'Hello';
        feature.data.overflow = "hidden";
        feature.data.icon = icon;
        
        var marker = feature.createMarker();
        var map_object = this.map;
        marker.events.register("mousedown", feature, function (evt) {
            if (this.popup === null) {
                this.popup = this.createPopup(this.closeBox);
                map_object.addPopup(this.popup);
                this.popup.show();
            } else {
                this.popup.toggle();
            }
            currentPopup = this.popup;
            OpenLayers.Event.stop(evt);
        });
        this.markers.addMarker(marker);
        
        return this;
        
    },
    clearMarkers: function() {
        if (this.markers) {
            this.markers.clearMarkers();
        }
        return this;
    },
    
    // Basic Ajax Functions
    //
    ajaxGet: function(url, handler) {
        var request = OpenLayers.Request.GET({
            url: url,
            callback: handler
        });
    },
    ajaxPost: function(url, params, handler) {
        var request = OpenLayers.Request.POST({
            url: url,
            data: OpenLayers.Util.getParameterString(params),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            callback: handler
        });
    },
    parseJSON: function(json) {
        parser = new OpenLayers.Format.JSON();
        return parser.read(json);
    },
    
    // Overlays
    //
    addTransitOverlay: function() {
        this.map.addLayers([new OpenLayers.Layer.AgentStormTransit("Public Transit")]);
    }
    
});

