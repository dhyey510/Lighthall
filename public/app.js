const lat = document.getElementById("lat");
const long = document.getElementById("long");

document.addEventListener("DOMContentLoaded", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log(position);
      lat.setAttribute("value", position.coords.latitude);
      long.setAttribute("value", position.coords.longitude);
    });
  }
});
