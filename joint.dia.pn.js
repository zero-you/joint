/**
 * Joint.dia.pn 0.1.0 - Joint.dia plugin for creating Petri net diagrams.
 * Copyright (c) 2009 David Durman
 * Licensed under the MIT license: (http://www.opensource.org/licenses/mit-license.php)
 */
(function(global){	// BEGIN CLOSURE

var pn = global.Joint.dia.pn = {};
var Element = global.Joint.dia.Element;

/**
 * Predefined arrow.
 */
pn.arrow = {
    startArrow: {type: "none"},
    endArrow: {type: "basic", size: 5}, 
    attrs: {"stroke-dasharray": "none"}
};

/**
 * Petri net place.
 * @param raphael raphael paper
 * @param p point position
 * @param r radius
 * @param rToken radius of my tokens
 * @param nTokens number of tokens
 * @param attrs shape SVG attributes
 */
pn.Place = Element.extend({
     object: "Place",
     module: "pn",
     init: function(properties){
	 // options
	 var p = this.properties;
	 var position = p.position = properties.position;
	 var radius = p.radius = properties.radius || 20;
	 var tokenRadius = p.tokenRadius = properties.tokenRadius || 3;
	 var tokens = p.tokens = parseInt(properties.tokens) || 0;
	 var label = p.label = properties.label;
	 var attrs = p.attrs = properties.attrs || {};
	 if (!attrs.fill){
	     attrs.fill = "white";
	 }
	 var tokenAttrs = p.tokenAttrs = properties.tokenAttrs || {};
	 if (!tokenAttrs.fill){
	     tokenAttrs.fill = "black";
	 }
	 // wrapper
	 var paper = this.paper;
	 this.setWrapper(paper.circle(position.x, position.y, radius).attr(attrs));
	 // inner
	 var strut = 2; // px
	 switch (tokens){
	 case 0:
	     break;
	 case 1:
	     this.addInner(paper.circle(position.x, position.y, tokenRadius).attr(tokenAttrs));
	     break;
	 case 2:
	     this.addInner(paper.circle(position.x - (tokenRadius * 2), position.y, tokenRadius).attr(tokenAttrs));
	     this.addInner(paper.circle(position.x + (tokenRadius * 2), position.y, tokenRadius).attr(tokenAttrs));
	     break;
	 case 3:
	     this.addInner(paper.circle(position.x - (tokenRadius * 2) - strut, position.y, tokenRadius).attr(tokenAttrs));
	     this.addInner(paper.circle(position.x + (tokenRadius * 2) + strut, position.y, tokenRadius).attr(tokenAttrs));
	     this.addInner(paper.circle(position.x, position.y, tokenRadius).attr(tokenAttrs));
	     break;
	 default:
	     this.addInner(paper.text(position.x, position.y, tokens.toString()));
	     break;
	 }
	 // label
	 if (label){
	     this.addInner(paper.text(position.x, position.y - radius, label));
	     this.inner[this.inner.length - 1].translate(0, -this.inner[this.inner.length - 1].getBBox().height);
	 }
     },
     zoom: function(){
	 // @todo tokens must move accordingly
	 for (var i = 0, len = this.inner.length; i < len; i++){
	     this.inner[i].scale.apply(this.inner[i], arguments);
	 }
	 if (this.label){
	     this.inner[this.inner.length - 1].remove();
	     var bb = this.wrapper.getBBox();
	     this.inner[this.inner.length - 1] = this.paper.text(bb.x, bb.y, this.properties.label);
	     this.inner[this.inner.length - 1].translate(0, -this.inner[this.inner.length - 1].getBBox().height);
	 }
     }
});

/**
 * Petri net event.
 * @param raphael raphael paper
 * @param r rectangle
 * @param attrs shape SVG attributes
 */
pn.Event = Element.extend({
     object: "Event",
     module: "pn",
     init: function(properties){
	 // options
	 var p = this.properties;
	 var rect = p.rect = properties.rect;
	 var attrs = p.attrs = properties.attrs || {};
	 if (!attrs.fill){ attrs.fill = "black"; }
	 if (!attrs.stroke){ attrs.stroke = "black"; }
	 var label = p.label = properties.label;
	 // wrapper
	 var paper = this.paper;
	 this.setWrapper(paper.rect(rect.x, rect.y, rect.width, rect.height).attr(attrs));
	 if (label){
	     this.addInner(paper.text(rect.x, rect.y, label));
	     this.inner[0].translate(0, -this.inner[0].getBBox().height);
	 }
     },
     zoom: function(){
	 if (this.label){
	     this.inner[0].remove();
	     var bb = this.wrapper.getBBox();
	     this.inner[0] = this.paper.text(bb.x, bb.y, this.properties.label);
	     this.inner[0].translate(0, -this.inner[0].getBBox().height);
	 }
     }
});

})(this);	// END CLOSURE