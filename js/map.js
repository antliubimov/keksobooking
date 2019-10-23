'use strict';
/**
 *
 * @param min number
 * @param max number
 * @returns {number}
 */
var random = (min, max) => Math.round(min - 0.5 + Math.random()*(max - min + 1));
/**
 *
 * @param min number
 * @param max number
 * @returns {[]}
 */
var randomArr = (min, max) => {
  var arr = [];
  while (arr.length < max) {
    var elem = random(min, max);
    if (!arr.includes(elem)) {
      arr.push(elem);
    }
  }
  return arr;
};
/**
 *
 * @param a array
 * @returns {*[]}
 */
var shuffle = (a) => {
  var arr = [...a];
  var j;
  for (var i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random()*(i + 1));
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
  return arr;
};

var avatarNums = randomArr(1, 8);
var title = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
var randomTitleNums = randomArr(0, 7);
var type = ['palace', 'flat', 'house', 'bungalow'];
var inOut = ['12:00', '13:00', '14:00'];
var features = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
var randomFeatures = (features) => {
  var length = random(1, features.length - 1);
  var arrNums = randomArr(0, length);
  var featuresArr = [];
  for (let i = 0; i < arrNums.length; i++) {
    featuresArr.push(features[arrNums[i]]);
  }
  return  featuresArr;
};

var photos = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg" , "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];

var map = document.querySelector('.map');

var createAds = () => {
  var adsArr = [];
  for (var i = 0; i < 8; i++) {
    var ad = {
      "author": {
        "avatar": `img/avatars/user${avatarNums[i]}.png`,
      },
      "offer": {
        "title": title[randomTitleNums[i]],
        "address": `${location.x}, ${location.y}`,
        "price": random(1000, 1000000),
        "type": type[random(0, type.length - 1)],
        "rooms": random(1, 5),
        "guests": random(1, 10),
        "checkin": inOut[random(0, inOut.length - 1)],
        "checkout": inOut[random(0, inOut.length - 1)],
        "features": randomFeatures(features),
        "description": "",
        "photos": shuffle(photos),
      },
      "location": {
        x: random(0, map.offsetWidth),
        y: random(130, 630),
      }
    };
    adsArr.push(ad);
  }
  return adsArr;
};

var ads = createAds();
//console.log(ads);

var adTemplate = document.querySelector('template');
var pinTemplate = adTemplate.content.querySelector('.map__pin');
map.classList.remove('map--faded');

var renderPin = (pin) => {

  var pinElement = pinTemplate.cloneNode(true);
  // debugger;
  var pinImg = pinElement.querySelector('img');
  console.log(pin.location.y);
  pinElement.style.left = `${pin.location.x}px`;
  pinElement.style.top = `${pin.location.y}px`;
  console.log(pinElement.style.top);
  pinImg.srcText = `${pin.author.avatar}`;
  pinImg.alt = `${pin.offer.title}`;
  return pinElement;
};

var pinsFragment = document.createDocumentFragment();
for (var i = 0; i < ads.length; i++) {
  pinsFragment.appendChild(renderPin(ads[i]));
}

document.querySelector('.map__pins').appendChild(pinsFragment);

