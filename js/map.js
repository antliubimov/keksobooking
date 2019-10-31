'use strict';
var TAIL_HEIGTH = 16;
var PIN_SIZE = {
  WIDTH: 46,
  HEIGHT: 62
};
var DRAG_LIMIT = {
  X: {
    MIN: 0,
    MAX: 1200
  },
  Y: {
    MIN: 130,
    MAX: 630
  }
};
var TITLE = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
var TYPE = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalow: 'Бунгало'
};
var IN_OUT = ['12:00', '13:00', '14:00'];
var FEATURES = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
var PHOTOS = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg" , "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];

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

var getRandomKey = function (obj) {
  var keys = Object.keys(obj);
  return keys[getRandomNumber(0, keys.length - 1)];
};

var avatarNums = shuffle([1,2,3,4,5,6,7,8]);
var randomTitleNums = shuffle([0,1,2,3,4,5,6,7]);

var randomFeatures = (features) => {
  var length = getRandomNumber(0, features.length);
  var arrNums = getRandomArray(0, length - 1);
  var featuresArr = [];
  for (let i = 0; i < arrNums.length; i++) {
    featuresArr.push(features[arrNums[i]]);
  }
  return  featuresArr;
};

var createAds = () => {
  var adsArr = [];

  for (var i = 0; i < 8; i++) {
  var x = getRandomNumber(DRAG_LIMIT.X.MIN, DRAG_LIMIT.X.MAX),
        y = getRandomNumber(DRAG_LIMIT.Y.MIN,
          DRAG_LIMIT.Y.MAX);

    var ad = {
      "author": {
        "avatar": `img/avatars/user0${avatarNums[i]}.png`,
      },
      "offer": {
        "title": TITLE[randomTitleNums[i]],
        "address": `${x}, ${y}`,
        "price": getRandomNumber(1000, 1000000),
        "type": getRandomKey(TYPE),
        "rooms": getRandomNumber(1, 5),
        "guests": getRandomNumber(1, 10),
        "checkin": IN_OUT[getRandomNumber(0, IN_OUT.length - 1)],
        "checkout": IN_OUT[getRandomNumber(0, IN_OUT.length - 1)],
        "features": randomFeatures(FEATURES),
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

var createPin = (pin) => {
  var pinElement = pinTemplate.cloneNode(true);
  var pinImg = pinElement.querySelector('img');
  pinElement.style.left = `${pin.location.x - PIN_SIZE.WIDTH / 2}px`;
  pinElement.style.top = `${pin.location.y - PIN_SIZE.HEIGHT}px`;
  pinImg.src = `${pin.author.avatar}`;
  pinImg.alt = `${pin.offer.title}`;
  var onPinElementClick = () => {
    var mapCard = document.querySelector('.map__card');
    if (mapCard) mapCard.remove();
    var adFragment = document.createDocumentFragment();
    adFragment.appendChild(createAd(pin));
    document.querySelector('.map__filters-container').before(adFragment);
  };
  pinElement.addEventListener('click', onPinElementClick);
  return pinElement;
};

var createAd = (ad) => {
  var adElement = adTemplate.cloneNode(true);
  adElement.querySelector('.popup__avatar').src = `${ad.author.avatar}`;
  adElement.querySelector('.popup__title').textContent = `${ad.offer.title}`;
  adElement.querySelector('.popup__text--address').textContent = `${ad.offer.address}`;
  adElement.querySelector('.popup__price').textContent = `${ad.offer.price}₽/ночь`;
  adElement.querySelector('.popup__type').textContent = `${ad.offer.type}`;
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
  var adClose = adElement.querySelector('.popup__close');
  var onAdCloseClick = () => {
    adElement.remove();
  };
  adClose.addEventListener('click', onAdCloseClick);

  return adElement;
};

var renderPins = (pins) => {
  var pinsFragment = document.createDocumentFragment();
  pins.forEach(pin => pinsFragment.appendChild(createPin(pin)));
  return pinsFragment;
};

var map = document.querySelector('.map');
var adForm = document.querySelector('.notice__form');
var inputAddress = document.querySelector('#address');
var mapPinMain = document.querySelector('.map__pin--main');

var onMapPinMainActiveState = () => {
  map.classList.remove('map--faded');
  adForm.classList.remove('notice__form--disabled');
  document.querySelector('.map__pins').appendChild(renderPins(ads));
  //
};
var onMapPinMainWatchAddress = (e) => {
  console.log(e);
};

mapPinMain.addEventListener('mouseup', onMapPinMainActiveState);
mapPinMain.addEventListener('mouseup', onMapPinMainWatchAddress);
