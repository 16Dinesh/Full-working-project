const mapDataElement = document.getElementById('mapData');
const mapToken = mapDataElement.getAttribute('data-map-token');
const coordinates = JSON.parse(mapDataElement.getAttribute('data-coordinates'));

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    center: coordinates, 
    zoom: 11 
});

const marker1 = new mapboxgl.Marker({color: "red"})
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({offset: { 'right': [-30, 0] }})
    .setHTML("<p><br>This is where you'll be</p>"))
    .addTo(map);
