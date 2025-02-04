const socket = io();
const userId = socket.id; // Get the current socket ID
const markers = {};

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${accuracy} meters`);
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
  attribution: "OpenStreetMap"
}).addTo(map)


socket.on("receive-location", data =>{
  const {id, latitude, longitude} = data;

  if (!latitude || !longitude) return; // Ignore invalid data

  // Set the map view only for the current user
  if (id === userId) {
  map.setView([latitude, longitude],16);
  }

  // Update or create the marker
  if(markers[id]){
    markers[id].setLatLng([latitude, longitude]);
  }
  else{
    markers[id] = L.marker([latitude,longitude]).addTo(map)
              .bindPopup(`User ${id}`)
              .openPopup();           
  }
});

socket.on("user-disconnected", (id) => {
  if(markers[id]){
    map.removeLayer(markers[id]);
    delete markers[id];
  }
})