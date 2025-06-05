let map;
let service;
let userLocation;
let restaurantResults = [];

function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 15
      });
      new google.maps.Marker({ position: userLocation, map: map });
    }, () => alert("無法取得定位"));
  } else {
    alert("瀏覽器不支援定位功能");
  }
}

function findRestaurants() {
  const cuisine = document.getElementById("cuisine").value;
  const keyword = cuisine === "不限" ? "餐廳" : cuisine + " 餐廳";

  const request = {
    location: userLocation,
    radius: 1500,
    keyword: keyword,
    type: ['restaurant'],
    openNow: true,
    rankBy: google.maps.places.RankBy.DISTANCE
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, showResults);
}

function showResults(results, status) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = "";
  restaurantResults = [];

  if (status === google.maps.places.PlacesServiceStatus.OK) {
    restaurantResults = results;
    results.forEach((place) => {
      resultsDiv.innerHTML += `
        <div class="card">
          <strong>${place.name}</strong><br>
          ⭐ ${place.rating || '無評分'}<br>
          📍 ${place.vicinity}
        </div>
      `;
      new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });
    });
  } else {
    resultsDiv.innerHTML = "找不到任何營業中的餐廳。";
  }
}

function recommendRandom() {
  if (restaurantResults.length === 0) {
    alert("請先搜尋附近餐廳！");
    return;
  }
  const randIndex = Math.floor(Math.random() * restaurantResults.length);
  const place = restaurantResults[randIndex];
  alert(`推薦你吃 🍽️：\n${place.name}\n地址：${place.vicinity}\n評分：${place.rating || '無評分'}`);
}
