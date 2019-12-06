// data.js
'use strict';

(function () {
  const PIN_SIZE = {
    WIDTH: 44,
    HEIGHT: 44,
  };
  const TAIL_HEIGHT = 16;

  const MAIN_PIN = {
    WIDTH: 65,
    HEIGHT: 65,
  };
  const DRAG_LIMIT = {
    X: {
      MIN: PIN_SIZE.WIDTH / 2,
      MAX: 1200 - PIN_SIZE.WIDTH / 2,
    },
    Y: {
      MIN: 130,
      MAX: 630,
    },
  };

  const TITLE = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде',
  ];
  const TYPE = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalow: 'Бунгало',
  };
  const IN_OUT = ['12:00', '13:00', '14:00'];
  const FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner',
  ];
  const PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
  ];
  const PRICE = {
    MIN: 1000,
    MAX: 1000000,
  };
  const avatarNums = window.utils.shuffle([1, 2, 3, 4, 5, 6, 7, 8]);
  const randomTitleNums = window.utils.shuffle([0, 1, 2, 3, 4, 5, 6, 7]);

  /**
   * Create array of ads
   * @returns {[]}
   */
  const createAds = () => {
    const adsArr = [];

    for (let i = 0; i < 8; i += 1) {
      const x = window.utils.getRandomNumber(DRAG_LIMIT.X.MIN, DRAG_LIMIT.X.MAX);
      const y = window.utils.getRandomNumber(DRAG_LIMIT.Y.MIN, DRAG_LIMIT.Y.MAX);

      const ad = {
        author: {
          avatar: `img/avatars/user0${avatarNums[i]}.png`,
        },
        offer: {
          title: TITLE[randomTitleNums[i]],
          address: `${x}, ${y}`,
          price: window.utils.getRandomNumber(PRICE.MIN, PRICE.MAX),
          type: TYPE[window.utils.getRandomKey(TYPE)],
          rooms: window.utils.getRandomNumber(1, 5),
          guests: window.utils.getRandomNumber(1, 10),
          checkin: IN_OUT[window.utils.getRandomNumber(0, IN_OUT.length - 1)],
          checkout: IN_OUT[window.utils.getRandomNumber(0, IN_OUT.length - 1)],
          features: window.utils.randomFeatures(FEATURES),
          description: '',
          photos: window.utils.shuffle(PHOTOS),
        },
        location: {
          x,
          y,
        },
      };

      adsArr.push(ad);
    }

    return adsArr;
  };

  const ads = createAds();

  window.data = {
    PIN_SIZE,
    TAIL_HEIGHT,
    MAIN_PIN,
    DRAG_LIMIT,
    ads,
  };
})();


