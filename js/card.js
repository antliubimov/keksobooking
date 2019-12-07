// card.js
'use strict';

(function() {
  const ESC_KEY = 'Escape';
  const template = document.querySelector('template');
  const mapCardTemplate = template.content.querySelector('.map__card');

  /**
   * Create fragment of Features
   * @param adElement
   * @param adData
   */
  const createFeaturesFragment = (adElement, adData) => {
    const featuresList = [
      ...adElement.querySelector('.popup__features').children,
    ];

    featuresList.forEach(featureItem => {
      if (
        !adData.offer.features.includes(
          featureItem.classList[1].replace(/feature--/, ''),
        )
      ) {
        featureItem.style.display = 'none';
      }
    });
  };

  /**
   * Create ad's photos gallery
   * @param adElement
   * @param adData
   */
  const createAdPhotos = (adElement, adData) => {
    const photos = adElement.querySelector('.popup__pictures');

    adData.offer.photos.forEach(photo => {
      const li = document.createElement('li');
      const img = document.createElement('img');
      img.src = photo;
      img.width = 45;
      img.height = 40;
      li.appendChild(img);
      li.classList.add('popup__picture');
      photos.appendChild(li);
    });
  };

  /**
   * Create Ad from template
   * @param adData
   * @returns {Node}
   */
  const createAd = adData => {
    const adElement = mapCardTemplate.cloneNode(true);

    adElement.querySelector('.popup__avatar').src = `${adData.author.avatar}`;
    adElement.querySelector(
      '.popup__title',
    ).textContent = `${adData.offer.title}`;
    adElement.querySelector(
      '.popup__text--address',
    ).textContent = `${adData.offer.address}`;
    adElement.querySelector(
      '.popup__price',
    ).textContent = `${adData.offer.price}₽/ночь`;
    adElement.querySelector(
      '.popup__type',
    ).textContent = `${adData.offer.type}`;
    adElement.querySelector(
      '.popup__text--capacity',
    ).textContent = `${adData.offer.rooms} комнаты для ${adData.offer.guests} гостей`;
    adElement.querySelector(
      '.popup__text--time',
    ).textContent = `Заезд послу ${adData.offer.checkin}, выезд до ${adData.offer.checkout}`;
    adElement.querySelector(
      '.popup__description',
    ).textContent = `${adData.offer.description}`;

    createFeaturesFragment(adElement, adData);
    createAdPhotos(adElement, adData);

    const adCloseButton = adElement.querySelector('.popup__close');

    const closeAd = () => {
      adElement.remove();
      adCloseButton.removeEventListener('click', onAdCloseClick);
      document.removeEventListener('keydown', onAdElementEscPress);
    };

    const onAdCloseClick = () => closeAd();

    const onAdElementEscPress = evt => {
      if (evt.key === ESC_KEY) {
        closeAd();
      }
    };

    adCloseButton.addEventListener('click', onAdCloseClick);
    document.addEventListener('keydown', onAdElementEscPress);

    return adElement;
  };

  window.card = {
    createAd,
  };
})();
