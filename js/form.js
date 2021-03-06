// form.js
'use strict';

/*
 * Validation of form
 * */

(function() {
  const ESC_KEY = 'Escape';
  const TITLE_LENGTH = {
    MIN: 30,
    MAX: 100,
  };
  const maxPrice = 1000000;
  const houseTypeMinPrice = {
    bungalow: 0,
    flat: 1000,
    house: 5000,
    palace: 10000,
  };
  const forEvent = {
    rooms: '100',
    guests: '0',
  };

  const mapPinMain = document.querySelector('.map__pin--main');
  const adForm = document.querySelector('.notice__form');
  const formFieldSets = document.querySelectorAll('.notice__form fieldset');
  const formTitle = document.querySelector('#title');
  const formAddress = document.querySelector('#address');
  const formHouseType = document.querySelector('#type');
  const formPrice = document.querySelector('#price');
  const formTimeIn = document.querySelector('#timein');
  const formTimeOut = document.querySelector('#timeout');
  const formRoomNumber = document.querySelector('#room_number');
  const formCapacity = document.querySelector('#capacity');
  const formSubmitButton = document.querySelector('.form__submit');
  const formResetButton = document.querySelector('.form__reset');
  const successMessage = document.querySelector('.success');

  const setAddress = () => {
    formAddress.value = `${window.data.getLocation(mapPinMain).join(', ')}`;
  };

  const highlightInvalidInput = formInput => {
    formInput.classList.add('input--invalid');
  };
  const unhighlightInvalidInput = formInput => {
    if (formInput.classList.contains('input--invalid')) {
      formInput.classList.remove('input--invalid');
    }
  };

  /**
   * Toggle highlight on invalid element
   * @param evt event
   * @param element Node
   * @param min number
   * @param max number
   */
  const toggleLightInvalidElement = (evt, element, min, max) => {
    const { value } = evt.target;
    if (value < min || value > max) {
      highlightInvalidInput(element);
    } else {
      unhighlightInvalidInput(element);
    }
  };
  /**
   * Change on title of ad-form
   * @param evt
   */
  const onFormTitleInput = evt => {
    toggleLightInvalidElement(
      evt,
      formTitle,
      TITLE_LENGTH.MIN,
      TITLE_LENGTH.MAX,
    );
  };
  /**
   * When change type of houses, then change min-price
   */
  const onFormHouseTypeChange = () => {
    const minPrice = houseTypeMinPrice[formHouseType.value];
    formPrice.min = minPrice;
    formPrice.placeholder = minPrice;
    return minPrice;
  };
  /**
   * Change on price of ad-form
   * @param evt
   */
  const onFormPriceChange = evt => {
    const minPrice = onFormHouseTypeChange();
    toggleLightInvalidElement(evt, formPrice, minPrice, maxPrice);
  };

  /**
   * Sync change formTimeIn and adFormTimeout
   * @param evt
   */
  const onFormTime = evt => {
    const formTime = evt.target === formTimeIn ? formTimeOut : formTimeIn;
    formTime.value = evt.target.value;
  };

  /**
   * Monitored compliance number of rooms and number of guests
   */
  const onFormRoomNumber = () => {
    const rooms = formRoomNumber.value;
    const guests = formCapacity.value;

    if (rooms === forEvent.rooms && guests !== forEvent.guests) {
      formRoomNumber.setCustomValidity(
        `При выборе 100 комнат можно выбрать только вариант "не для гостей"`,
      );
      highlightInvalidInput(formRoomNumber);
    } else if (rooms !== forEvent.rooms && guests === forEvent.guests) {
      formRoomNumber.setCustomValidity(
        `Для ${rooms} ${
          rooms === '1' ? 'комнаты' : 'комнат'
        } не может быть количество мест "не для гостей"`,
      );
      highlightInvalidInput(formRoomNumber);
    } else if (rooms < guests) {
      formRoomNumber.setCustomValidity(
        `Количество комнат должно быть больше или равно количеству гостей`,
      );
      highlightInvalidInput(formRoomNumber);
      highlightInvalidInput(formRoomNumber);
    } else {
      formRoomNumber.setCustomValidity(``);
      unhighlightInvalidInput(formRoomNumber);
    }
  };
  /**
   * Activate fields of ad-form
   */
  const activateAdFields = () => {
    formFieldSets.forEach(fieldset => (fieldset.disabled = false));
  };
  /**
   * Deactivate fields of ad-form
   */
  const deactivateAdFields = () => {
    formFieldSets.forEach(fieldset => {
      fieldset.disabled = true;
      unhighlightInvalidInput(fieldset.elements[0]);
    });
  };

  /**
   * Activate form
   */
  const activateForm = () => {
    adForm.classList.remove('notice__form--disabled');
    activateAdFields();
    window.avatar.activateChoosers();
  };
  /**
   * Deactivate form
   */
  const deactivateForm = () => {
    adForm.reset();
    adForm.classList.add('notice__form--disabled');
    deactivateAdFields();
    window.avatar.removePhotos();
    window.avatar.deactivateChoosers();
  };

  /**
   * Deactivate form when click on reset-button
   */
  const onFormResetButton = evt => {
    evt.preventDefault();
    window.map.deactivateState();
    deactivateForm();
    removeFormListeners();
  };

  const activateFormListeners = () => {
    formTitle.addEventListener('input', onFormTitleInput);
    formPrice.addEventListener('change', onFormPriceChange);
    formHouseType.addEventListener('change', onFormHouseTypeChange);
    formTimeIn.addEventListener('change', onFormTime);
    formTimeOut.addEventListener('change', onFormTime);
    formSubmitButton.addEventListener('click', onFormRoomNumber);
    formResetButton.addEventListener('click', onFormResetButton);
    adForm.addEventListener('submit', submitAdForm);
  };

  const removeFormListeners = () => {
    formTitle.removeEventListener('input', onFormTitleInput);
    formPrice.removeEventListener('change', onFormPriceChange);
    formHouseType.removeEventListener('change', onFormHouseTypeChange);
    formTimeIn.removeEventListener('change', onFormTime);
    formTimeOut.removeEventListener('change', onFormTime);
    formSubmitButton.removeEventListener('click', onFormRoomNumber);
    formResetButton.removeEventListener('click', onFormResetButton);
    adForm.removeEventListener('submit', submitAdForm);
  };
  /**
   * Show success-message
   */
  const showSuccess = () => {
    successMessage.classList.remove('hidden');
    successMessage.addEventListener('click', onSuccessMessageClick);
    document.addEventListener('keydown', onSuccessMessageEscDown);
  };
  /**
   * Hidden success-message
   */
  const successMessageHidden = () => {
    successMessage.classList.add('hidden');
    successMessage.addEventListener('click', onSuccessMessageClick);
    document.addEventListener('keydown', onSuccessMessageEscDown);
  };
  /**
   * Hidden the success-message when click on it
   */
  const onSuccessMessageClick = () => {
    successMessageHidden();
  };
  /**
   * Hidden the success-message when down Escape
   * @param evt
   */
  const onSuccessMessageEscDown = evt => {
    window.utils.escDown(evt, successMessageHidden);
  };

  const successHandler = response => {
    showSuccess();
    window.map.deactivateState();
    deactivateForm();
    removeFormListeners();
  };
  /**
   * Submit data of adForm
   * @param evt
   */
  const submitAdForm = evt => {
    window.backend.save(
      new FormData(adForm),
      successHandler,
      window.utils.errorHandler,
    );
    evt.preventDefault();
  };

  return (window.form = {
    setAddress,
    activateForm,
    activateFormListeners,
  });
})();
