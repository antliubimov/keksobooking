// filters.js
'use strict';

(function() {
  const housingType = document.querySelector('#housing-type');
  const housingPrice = document.querySelector('#housing-price');
  const housingRooms = document.querySelector('#housing-rooms');
  const housingGuests = document.querySelector('#housing-guests');
  const housingFeatures = document.querySelector('#housing-features');
  const housingFilters = [
    housingType,
    housingPrice,
    housingRooms,
    housingGuests,
    housingFeatures,
  ];

  const sortTypeRoomsGuests = (...args) => {
    const [type, filter, ads] = args;
    return ads.filter(ad => ad.offer[filter].toString() === type);
  };

  const sortFeatures = (...args) => {
    const [types, filter, ads] = args;

    return ads.filter(ad =>
      types.every(type => ad.offer[filter].includes(type)),
    );
  };

  const sortPrice = (...args) => {
    const [type, filter, ads] = args;
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

  const sortHousing = (type, filter, ads) => {
    if (
      type === 'any' ||
      (filter === 'features' && filterList[filter].length === 0)
    ) {
      return ads;
    } else {
      return filters[filter](type, filter, ads);
    }
  };

  const filterList = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any',
    features: [],
  };

  const onFilterClick = evt => {
    window.map.removePins();
    const type = evt.target.value;
    const filterName = evt.target.name.replace(/^housing-/, '');
    const checked = evt.target.checked;
    let sortArr = [...window.map.ads];
    if (filterName === 'features') {
      if (checked) {
        filterList.features.push(type);
      } else {
        filterList.features.splice(filterList.features.indexOf(type), 1);
      }
    } else {
      filterList[filterName] = type;
    }

    for (let filter in filterList) {
      sortArr = [...sortHousing(filterList[filter], filter, sortArr)];
    }

    window.pin.renderPins(sortArr);
  };

  const initializeFilters = () =>
    housingFilters.forEach(filter =>
      filter.addEventListener('change', onFilterClick),
    );

  const deactivateFilters = () =>
    housingFilters.forEach(filter =>
      filter.removeEventListener('change', onFilterClick),
    );

  window.filters = {
    initializeFilters,
    deactivateFilters,
  };
})();
