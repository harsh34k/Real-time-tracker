const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
    },
        (error) => {
            console.log(error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        });
}

const map = L.map("map").setView([0, 0], 16);  // Store the map instance in a variable
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);  // Add the tile layer to the map

const markers = {};
socket.on("receive-location", (data) => {
    const { latitude, longitude, id } = data;
    map.setView([latitude, longitude]);  // Use the map variable to call setView
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    }
    else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id]
    }
})
