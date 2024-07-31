mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 11 // starting zoom
});
//console.log(coordinates)
// const popupOffsets = {
//     'top': [0, 0],
//     'top-left': [0, 0],
//     'top-right': [0, 0],
//     'bottom': [0, -markerHeight],
//     'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
//     'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
//     'left': [markerRadius, (markerHeight - markerRadius) * -1],
//     'right': [-markerRadius, (markerHeight - markerRadius) * -1]
// };
const marker1 = new mapboxgl.Marker({color: "red"})
        .setLngLat(coordinates)
        .setPopup( new mapboxgl.Popup({offset: 30})
        .setHTML("<p><br>This Where You BE</p>"))
        .addTo(map);