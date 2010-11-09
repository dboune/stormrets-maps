OpenLayers.Layer.AgentStorm = OpenLayers.Class(OpenLayers.Layer.XYZ, {
    initialize: function(name, options) {
        options = OpenLayers.Util.extend({
            attribution: "Data &copy; 2009 <a href='http://openstreetmap.org/'>OpenStreetMap</a>. Rendering &copy; 2010 <a href='http://www.agentstorm.com'>Agent Storm</a>.",
            maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
            maxResolution: 156543.0339,
            units: "m",
            projection: "EPSG:900913",
			isBaseLayer: true,
			numZoomLevels: 19,
			displayOutsideMaxExtent: true,
			wrapDateLine: true,
        }, options);
        var url = [
            "http://a.maps.agentstorm.com/tiles/${z}/${x}/${y}.png",
            "http://b.maps.agentstorm.com/tiles/${z}/${x}/${y}.png",
            "http://c.maps.agentstorm.com/tiles/${z}/${x}/${y}.png"
        ];
        var newArguments = [name, url, options];
        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, newArguments);
    },
    CLASS_NAME: "OpenLayers.Layer.AgentStorm"
});
OpenLayers.Layer.AgentStormTransit = OpenLayers.Class(OpenLayers.Layer.XYZ, {
    initialize: function(name, options) {
        options = OpenLayers.Util.extend({
            attribution: "Data &copy; 2009 <a href='http://openstreetmap.org/'>OpenStreetMap</a>. Rendering &copy; 2010 <a href='http://www.agentstorm.com'>Agent Storm</a>.",
            maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
            maxResolution: 156543.0339,
            units: "m",
            projection: "EPSG:900913",
			isBaseLayer: true,
			numZoomLevels: 19,
			displayOutsideMaxExtent: true,
			wrapDateLine: true,
        }, options);
        var url = [
            "http://a.maps.agentstorm.com/transit/${z}/${x}/${y}.png",
            "http://b.maps.agentstorm.com/transit/${z}/${x}/${y}.png",
            "http://c.maps.agentstorm.com/transit/${z}/${x}/${y}.png"
        ];
        var newArguments = [name, url, options];
        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, newArguments);
    },
    CLASS_NAME: "OpenLayers.Layer.AgentStormTransit"
});
