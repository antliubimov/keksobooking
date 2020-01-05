// filters.js
'use strict';

(function() {
  const housingType = document.querySelector('#housing-type');
  const housingPrice = document.querySelector('#housing-price');
  const housingRooms = document.querySelector('#housing-rooms');
  const housingGuests = document.querySelector('#housing-guests');

  const sortHousingType = (type, ads) =>
    type === 'any' ? ads : ads.filter(ad => ad.offer.type === type);

  const sortHousingPrice = (type, ads) => {
    const price = {
      low(x) {
        return x >= 0 && x < 10000;
      },
      middle(x) {
        return x >= 10000 && x < 50000;
      },
      high(x) {
        return x >= 50000;
      },
    };
    return type === 'any' ? ads : ads.filter(ad => price[type](ad.offer.price));
  };

  const sortHousingRooms = (type, ads) =>
    type === 'any' ? ads : ads.filter(ad => ad.offer.rooms.toString() === type);

  const sortHousingGuests = (type, ads) =>
    type === 'any'
      ? ads
      : ads.filter(ad => ad.offer.guests.toString() === type);

  const filter = {
    'housing-type': sortHousingType,
    'housing-price': sortHousingPrice,
    'housing-rooms': sortHousingRooms,
    'housing-guests': sortHousingGuests,
    // 'housing-features': sortHousingFeatures,
  };

  const onFilterClick = evt => {
    window.map.removePins();
    console.log(evt);
    const ads = [...window.map.ads];
    const type = evt.target.value;
    const filterName = evt.target.name;
    const sortArr = filter[filterName](type, ads);
    window.pin.renderPins(sortArr);
  };

  housingType.addEventListener('change', onFilterClick);
  housingPrice.addEventListener('change', onFilterClick);
  housingRooms.addEventListener('change', onFilterClick);
  housingGuests.addEventListener('change', onFilterClick);
})();
