'use strict';
/**
 *
 * @param min number
 * @param max number
 * @returns {number}
 */
var getRandomNumber = (min, max) => Math.abs(Math.round(min - 0.5 + Math.random()*(max - min + 1)));
/**
 *
 * @param min number
 * @param max number
 * @returns {[]}
 */
var getRandomArray = (min, max) => {
  var arr = [];
  while (arr.length < max) {
    var elem = getRandomNumber(min, max);
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

var avatarNums = shuffle([1,2,3,4,5,6,7,8]);

var TITLE = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
var randomTitleNums = shuffle([0,1,2,3,4,5,6,7]);

var TYPE = ['palace', 'flat', 'house', 'bungalow'];

var getTranslateType = (type) => {
  switch (type) {
    case 'palace':
      return 'Дворец';
      break;
    case 'flat':
      return 'Квартира';
      break;
    case 'bungalow':
      return 'Бунгало';
      break;
    case 'house':
      return 'Дом';
      break;
  }
}
var inOut = ['12:00', '13:00', '14:00'];
var features = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
var randomFeatures = (features) => {
  var length = getRandomNumber(0, features.length);
  var arrNums = getRandomArray(0, length - 1);
  var featuresArr = [];
  for (let i = 0; i < arrNums.length; i++) {
    featuresArr.push(features[arrNums[i]]);
  }
  return  featuresArr;
};

var PHOTOS = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg" , "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];

var map = document.querySelector('.map');

var createAds = () => {
  var adsArr = [];

  for (var i = 0; i < 8; i++) {
    var x = getRandomNumber(0, 1200),
        y = getRandomNumber(130, 630);

    var ad = {
      "author": {
        "avatar": `img/avatars/user0${avatarNums[i]}.png`,
      },
      "offer": {
        "title": TITLE[randomTitleNums[i]],
        "address": `${x}, ${y}`,
        "price": getRandomNumber(1000, 1000000),
        "type": TYPE[getRandomNumber(0, TYPE.length - 1)],
        "rooms": getRandomNumber(1, 5),
        "guests": getRandomNumber(1, 10),
        "checkin": inOut[getRandomNumber(0, inOut.length - 1)],
        "checkout": inOut[getRandomNumber(0, inOut.length - 1)],
        "features": randomFeatures(features),
        "description": "",
        "photos": shuffle(PHOTOS),
      },
      "location": {
        "x": x,
        "y": y
      },
    };

    adsArr.push(ad);
  }

  return adsArr;
};

var ads = createAds();

var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var adTemplate = template.content.querySelector('.map__card');
map.classList.remove('map--faded');

var renderPin = (pin) => {
  var pinElement = pinTemplate.cloneNode(true);
  var pinImg = pinElement.querySelector('img');
  pinElement.style.left = `${pin.location.x - 20}px`;
  pinElement.style.top = `${pin.location.y - 62}px`;
  pinImg.src = `${pin.author.avatar}`;
  pinImg.alt = `${pin.offer.title}`;
  return pinElement;
};

var renderAd = (ad) => {
  var adElement = adTemplate.cloneNode(true);
  adElement.querySelector('.popup__avatar').src = `${ad.author.avatar}`;
  adElement.querySelector('.popup__title').textContent = `${ad.offer.title}`;
  adElement.querySelector('.popup__text--address').textContent = `${ad.offer.address}`;
  adElement.querySelector('.popup__price').textContent = `${ad.offer.price}₽/ночь`;
  adElement.querySelector('.popup__type').textContent = `${getTranslateType(ad.offer.type)}`;
  adElement.querySelector('.popup__text--capacity').textContent = `${ad.offer.rooms} комнаты для ${ad.offer.guests} гостей`;
  adElement.querySelector('.popup__text--time').textContent = `Заезд послу ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;
  var featuresList = [...adElement.querySelector('.popup__features').children];
  for (var featureLi of featuresList) {
    if (!ad.offer.features.includes(featureLi.classList[1].replace(/feature--/, ''))) {
      featureLi.style.display = 'none';
    }
  }
  adElement.querySelector('.popup__description').textContent = `${ad.offer.description}`;
  // не отображать, нет стилей
  // var photos = adElement.querySelector('.popup__pictures');
  // ad.offer.photos.forEach(photo => {
  //   var li = document.createElement('li');
  //   var img = document.createElement('img');
  //   img.src = photo;
  //   li.appendChild(img);
  //   photos.appendChild(li);
  // });

  return adElement;
};

var pinsFragment = document.createDocumentFragment();
var adsFragment = document.createDocumentFragment();

for (var i = 0; i < ads.length; i++) {
  pinsFragment.appendChild(renderPin(ads[i]));
  adsFragment.appendChild(renderAd(ads[i]));
}
document.querySelector('.map__pins').appendChild(pinsFragment);

document.querySelector('.map__filters-container').before(adsFragment);
