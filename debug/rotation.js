var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
osmAttrib = '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});

var map = L.map('map', {rotate: true })
	.setView([-19.885543, -43.9530557], 13)
	.addLayer(osm);

function rotate(ev) {
	if (ev.buttons === 0) return;
	var angle = ev.target.valueAsNumber;
	// 			console.log(angle);
	map.setBearing(angle);
}

function rotateFromButton(angle) {
	document.getElementById('rho_input').valueAsNumber = angle;
	map.setBearing(angle);
}

document.getElementById('rho_input').addEventListener('change', rotate);
document.getElementById('rho_input').addEventListener('mousemove', rotate);

var centerMarker;
var bounds;
function displayCenter() {
if (centerMarker) { centerMarker.remove(); }
centerMarker = L.circleMarker(map.getCenter()).addTo(map);

if (bounds) { bounds.remove(); }
var padding = document.getElementById('pad_input').valueAsNumber;
bounds = L.rectangle(map.getBounds().pad(padding)).addTo(map);
}

map.on('moveend zoomend resetview rotate', displayCenter);

displayCenter();
        
function handleRotation() {
    let mapAngle = document.getElementById('rho_input').valueAsNumber;
    console.log(mapAngle)
    if (mapAngle >= 360) {
        mapAngle = 0;
    } else {
        mapAngle+=30;
        map.setBearing(mapAngle);
        console.log(mapAngle)
    }

    document.getElementById('rho_input').valueAsNumber = mapAngle;
}