// filters.js
'use strict';

(function() {
  const housingType = document.querySelector('#housing-type');
  const housingPrice = document.querySelector('#housing-price');
  const housingRooms = document.querySelector('#housing-rooms');
  const housingGuests = document.querySelector('#housing-guests');
  const housingFeatures = document.querySelector('#housing-features');

  const sortTypeRoomsGuests = (...args) => {
    const [type, filter, , ads] = args;
    return ads.filter(ad => ad.offer[filter].toString() === type);
  };

  const sortFeatures = (...args) => {
    const [type, filter, checked, ads] = args;

    return checked === true
      ? ads.filter(ad => ad.offer[filter].includes(type))
      : ads;
  };

  const sortPrice = (...args) => {
    const [type, filter, , ads] = args;
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
    return ads.filter(ad => price[type](ad.offer[filter]));
  };

  const filters = {
    type: sortTypeRoomsGuests,
    price: sortPrice,
    rooms: sortTypeRoomsGuests,
    guests: sortTypeRoomsGuests,
    features: sortFeatures,
  };

  const sortHousing = (type, filter, checked, ads) => {
    if (type === 'any') {
      return ads;
    } else {
      return filters[filter](type, filter, checked, ads);
    }
  };

  const onFilterClick = evt => {
    window.map.removePins();
    const ads = [...window.map.ads];
    const type = evt.target.value;
    const filterName = evt.target.name.replace(/^housing-/, '');
    const checked = evt.target.checked;
    const sortArr = sortHousing(type, filterName, checked, ads);
    window.pin.renderPins(sortArr);
  };

  housingType.addEventListener('change', onFilterClick);
  housingPrice.addEventListener('change', onFilterClick);
  housingRooms.addEventListener('change', onFilterClick);
  housingGuests.addEventListener('change', onFilterClick);
  housingFeatures.addEventListener('change', onFilterClick);
})();
