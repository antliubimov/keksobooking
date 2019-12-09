// pin.js
'use strict';

(function () {
  const template = document.querySelector('template');
  const pinTemplate = template.content.querySelector('.map__pin');

  /**
   * Remove card on a map
   */
  const removeMapCard = () => {
    const mapCard = document.querySelector('.map__card');
    if (mapCard) mapCard.remove();
  };

  /**
   * Create pin-element
   * @param pin
   * @returns {Node}
   */
  const createPin = pin => {
    const pinElement = pinTemplate.cloneNode(true);
    const pinImg = pinElement.querySelector('img');

    pinElement.style.left = `${Math.round(
      pin.location.x - window.data.PIN_SIZE.WIDTH / 2,
    )}px`;
    pinElement.style.top = `${Math.round(
      pin.location.y - window.data.PIN_SIZE.HEIGHT / 2 - window.data.TAIL_HEIGHT,
    )}px`;
    pinImg.src = `${pin.author.avatar}`;
    pinImg.alt = `${pin.offer.title}`;

    const onPinElementClick = () => {
      removeMapCard();
      const adFragment = document.createDocumentFragment();
      adFragment.appendChild(window.card.createAd(pin));
      document.querySelector('.map__filters-container').before(adFragment);
    };

    pinElement.addEventListener('click', onPinElementClick);

    return pinElement;
  };

  /**
   * Renders pins on the map
   * @param pins
   * @returns {DocumentFragment}
   */
  const renderPins = pins => {
    const pinsFragment = document.createDocumentFragment();
    pins.forEach(pin => pinsFragment.appendChild(createPin(pin)));
    return pinsFragment;
  };

  return window.pin = {
    renderPins,
  };
})();

