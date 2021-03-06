/*
 * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
 */


/* @namespace Marker
 * @section Interaction handlers
 *
 * Interaction handlers are properties of a marker instance that allow you to control interaction behavior in runtime, enabling or disabling certain features such as dragging (see `Handler` methods). Example:
 *
 * ```js
 * marker.dragging.disable();
 * ```
 *
 * @property dragging: Handler
 * Marker dragging handler (by both mouse and touch).
 */

L.Handler.MarkerDrag = L.Handler.extend({
	initialize: function (marker) {
		this._marker = marker;
	},

	addHooks: function () {
		var icon = this._marker._icon;

		if (!this._draggable) {
			this._draggable = new L.Draggable(icon, icon, true);
		}

		this._draggable.on({
			dragstart: this._onDragStart,
			drag: this._onDrag,
			dragend: this._onDragEnd
		}, this).enable();

		L.DomUtil.addClass(icon, 'leaflet-marker-draggable');
	},

	removeHooks: function () {
		this._draggable.off({
			dragstart: this._onDragStart,
			drag: this._onDrag,
			dragend: this._onDragEnd
		}, this).disable();

		if (this._marker._icon) {
			L.DomUtil.removeClass(this._marker._icon, 'leaflet-marker-draggable');
		}
	},

	moved: function () {
		return this._draggable && this._draggable._moved;
	},

	_onDragStart: function () {
		// @section Dragging events
		// @event dragstart: Event
		// Fired when the user starts dragging the marker.

		// @event movestart: Event
		// Fired when the marker starts moving (because of dragging).

		this._oldLatLng = this._marker.getLatLng();
		this._marker
		    .closePopup()
		    .fire('movestart')
		    .fire('dragstart');
		if (this._marker._map._rotate){
			this._draggable.updateMapBearing(this._marker._map._bearing);
		}
	},

	_onDrag: function (e) {
		var marker = this._marker,
		    rotated_marker = marker.options.rotation || marker.options.rotateWithView,
		    shadow = marker._shadow,
		    iconPos = L.DomUtil.getPosition(marker._icon);

		// update shadow position
		if (!rotated_marker && shadow) {
			L.DomUtil.setPosition(shadow, iconPos);
		}

		if (marker._map._rotate) {
			// Reverse calculation from mapPane coordinates to rotatePane coordinates
			iconPos = marker._map.mapPanePointToRotatedPoint(iconPos);
		}
		latlng = marker._map.layerPointToLatLng(iconPos);

		marker._latlng = latlng;
		e.latlng = latlng;
		e.oldLatLng = this._oldLatLng;

		if (rotated_marker) marker.setLatLng(latlng); // use `setLatLng` to presisit rotation. low efficiency
		else marker.fire('move', e); // `setLatLng` will trig 'move' event. we imitate here.

		// @event drag: Event
		// Fired repeatedly while the user drags the marker.
		marker
		    .fire('drag', e);
	},

	_onDragEnd: function (e) {
		// @event dragend: DragEndEvent
		// Fired when the user stops dragging the marker.

		this._marker.update();

		// @event moveend: Event
		// Fired when the marker stops moving (because of dragging).
		delete this._oldLatLng;
		this._marker
		    .fire('moveend')
		    .fire('dragend', e);
	}
});
