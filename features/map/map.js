// map.js

let map;
let marker;

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// This function is called by Google Maps API callback=initMap
function initMap() {
  const place = getParam("place") || "Singapore";
  const address = getParam("address") || "";
  const hours = getParam("hours") || "";

  // Put text at top
  document.getElementById("placeTitle").textContent = place;
  document.getElementById("placeAddress").textContent = address || "Singapore";
  document.getElementById("placeHours").textContent = hours || "";

  // Default center (SG)
  const defaultCenter = { lat: 1.3521, lng: 103.8198 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultCenter,
    zoom: 12,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  });

  marker = new google.maps.Marker({
    map,
    position: defaultCenter,
    title: place,
  });

  // Use Places service to find location
  const service = new google.maps.places.PlacesService(map);

  const queryText = address ? `${place}, ${address}, Singapore` : `${place}, Singapore`;

  service.textSearch({ query: queryText }, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
      const loc = results[0].geometry.location;

      map.setCenter(loc);
      map.setZoom(14);

      marker.setPosition(loc);
      marker.setTitle(place);

      // optional: info window
      const info = new google.maps.InfoWindow({
        content: `<strong>${place}</strong><br>${address || results[0].formatted_address}`
      });

      marker.addListener("click", () => info.open(map, marker));
    }
  });
}

// small header actions
document.addEventListener("DOMContentLoaded", () => {
  const notif = document.querySelector(".notif");
  notif?.addEventListener("click", () => alert("Notifications clicked"));

  document.querySelector(".logout")?.addEventListener("click", () => {
    alert("Logged out");
    window.location.href = "../login-page/login.html";
  });

  document.querySelector(".profile")?.addEventListener("click", () => {
    alert("Profile page coming soon");
  });
});
