'use strict';

(() => {
  const OFFER_TYPE_VALUE = {
    'palace': `дворец`,
    'flat': `квартира`,
    'house': `дом`,
    'bungalow': `бунгало`
  };
  const OFFER_TYPE_PRICE = {
    'palace': 10000,
    'flat': 1000,
    'house': 5000,
    'bungalow': 0
  };
  const ROOMS = [1, 2, 3, 100];
  const CAPACITY = [3, 2, 1, 0];
  const TITLE_MAX_LENGTH = 100;
  const TITLE_MIN_LENGTH = 30;
  const MAX_PRICE = 1000000;
  const KEY_ESC = `Escape`;

  const main = document.querySelector(`main`);
  const adForm = document.querySelector(`.ad-form`);
  const adFormRooms = adForm.querySelector(`select[name="rooms"]`);
  const adFormCapacity = adForm.querySelector(`select[name="capacity"]`);
  const adFormTitle = adForm.querySelector(`#title`);
  const adFormPrice = adForm.querySelector(`#price`);
  const adFormType = adForm.querySelector(`#type`);
  const adFormTimein = adForm.querySelector(`#timein`);
  const adFormTimeout = adForm.querySelector(`#timeout`);
  const adFormReset = adForm.querySelector(`.ad-form__reset`);
  const adFormSubmit = document.querySelector(`.ad-form__submit`);
  let minPrice;
  const successMessageTemplate = document.querySelector(`#success`).content.querySelector(`.success`);
  const errorMessageTemplate = document.querySelector(`#error`).content.querySelector(`.error`);

  adFormCapacity.addEventListener(`input`, () => {
    adFormCapacity.setCustomValidity(``);
    if (+adFormRooms.value === ROOMS[0] && +adFormCapacity.value !== CAPACITY[2]) {
      adFormCapacity.setCustomValidity(`Необходимо выбрать 1-го гостя`);
    }
    if (+adFormRooms.value === ROOMS[1] && +adFormCapacity.value !== CAPACITY[2] && +adFormCapacity.value !== CAPACITY[1]) {
      adFormCapacity.setCustomValidity(`Необходимо выбрать 1-го или 2-х гостей`);
    }
    if (+adFormRooms.value === ROOMS[2] && +adFormCapacity.value !== CAPACITY[0] && +adFormCapacity.value !== CAPACITY[1] && +adFormCapacity.value !== CAPACITY[2]) {
      adFormCapacity.setCustomValidity(`Необходимо выбрать 1-го, 2-х или 3-х гостей`);
    }
    if (+adFormRooms.value === ROOMS[3] && +adFormCapacity.value !== CAPACITY[3]) {
      adFormCapacity.setCustomValidity(`Необходимо выбрать "не для гостей"`);
    }
    adFormCapacity.reportValidity();
  });

  adFormTitle.addEventListener(`input`, () => {
    adFormTitle.setCustomValidity(``);
    if (adFormTitle.value.length < TITLE_MIN_LENGTH) {
      adFormTitle.setCustomValidity(`Заголовок объявления должен быть больше ${TITLE_MIN_LENGTH} символов. Сейчас ${adFormTitle.value.length}.`);
    }
    if (adFormTitle.value.length > TITLE_MAX_LENGTH) {
      adFormTitle.setCustomValidity(`Заголовок объявления должен быть не более ${TITLE_MAX_LENGTH} символов. Сейчас ${adFormTitle.value.length}.`);
    }
    adFormTitle.reportValidity();
  });

  minPrice = OFFER_TYPE_PRICE[adFormType.value];
  adFormPrice.placeholder = `` + minPrice;
  adFormPrice.min = minPrice;

  adFormType.addEventListener(`change`, () => {
    adFormPrice.setAttribute(`max`, MAX_PRICE);
    minPrice = OFFER_TYPE_PRICE[adFormType.value];
    adFormPrice.value = ``;
    adFormPrice.placeholder = `` + minPrice;
    adFormPrice.min = minPrice;
    adFormType.reportValidity();
  });

  adFormPrice.addEventListener(`input`, () => {
    const adFormTypeText = OFFER_TYPE_VALUE[adFormType.value];

    adFormPrice.setCustomValidity(``);
    if (adFormPrice.value > MAX_PRICE) {
      adFormPrice.setCustomValidity(`Максимальная цена за ночь ${MAX_PRICE} руб.`);
    }
    if (adFormPrice.value < minPrice) {
      adFormPrice.setCustomValidity(`Минимальная цена за ночь в типе жилья: ${adFormTypeText}, ${minPrice} руб.`);
    }
    adFormPrice.reportValidity();
  });

  adFormTimein.addEventListener(`change`, (evt) => {
    adFormTimeout.value = evt.target.value;
  });

  adFormTimeout.addEventListener(`change`, (evt) => {
    adFormTimein.value = evt.target.value;
  });

  const uploadSuccessHandler = () => {
    const renderSuccessMessage = () => {
      const successMessageElement = successMessageTemplate.cloneNode(true);

      const documentEscHandler = (evt) => {
        if (evt.key === KEY_ESC) {
          successMessageElement.remove();
        }
        document.removeEventListener(`keydown`, documentEscHandler);
        document.removeEventListener(`click`, documentClickHandler);
      };

      const documentClickHandler = () => {
        successMessageElement.remove();
        document.removeEventListener(`click`, documentClickHandler);
        document.removeEventListener(`keydown`, documentEscHandler);
      };

      document.addEventListener(`keydown`, documentEscHandler);
      document.addEventListener(`click`, documentClickHandler);

      return successMessageElement;
    };

    main.appendChild(renderSuccessMessage());
    adForm.reset();
    window.map.setDisactiveState();
  };

  const renderErrorMessage = () => {
    const errorMessageElement = errorMessageTemplate.cloneNode(true);
    const errorMessageButton = errorMessageElement.querySelector(`.error__button`);

    const documentEscHandler = (evt) => {
      if (evt.key === KEY_ESC) {
        errorMessageElement.remove();
      }
      document.removeEventListener(`keydown`, documentEscHandler);
      document.removeEventListener(`click`, documentClickHandler);
    };

    const documentClickHandler = () => {
      errorMessageElement.remove();
      document.removeEventListener(`click`, documentClickHandler);
      document.removeEventListener(`keydown`, documentEscHandler);
    };

    errorMessageButton.addEventListener(`click`, documentClickHandler);
    document.addEventListener(`click`, documentClickHandler);
    document.addEventListener(`keydown`, documentEscHandler);

    return errorMessageElement;
  };

  const uploadErrorHandler = () => {
    main.appendChild(renderErrorMessage());
  };

  adFormSubmit.addEventListener(`click`, () => {
    checkValidity();
  });

  const checkValidity = () => {
    if (adFormTitle.value.length === 0) {
      adFormTitle.setCustomValidity(`Введите заголовок`);
    }

    const adFormTypeText = OFFER_TYPE_VALUE[adFormType.value];

    adFormPrice.setCustomValidity(``);
    if (adFormPrice.value.length === 0) {
      adFormPrice.setCustomValidity(`Введите цену`);
    }
    if (adFormPrice.value > MAX_PRICE) {
      adFormPrice.setCustomValidity(`Максимальная цена за ночь ${MAX_PRICE} руб.`);
    }
    if (adFormPrice.value < minPrice) {
      adFormPrice.setCustomValidity(`Минимальная цена за ночь в типе жилья: ${adFormTypeText}, ${minPrice} руб.`);
    }

    adFormCapacity.setCustomValidity(``);
    if (adFormRooms.value.indexOf(+adFormCapacity.value) === -1) {
      adFormCapacity.setCustomValidity(`Выбранное количество гостей не поместятся в данное количество комнат`);
    }
  };

  adForm.addEventListener(`submit`, (evt) => {
    window.backend.upload(new FormData(adForm), uploadSuccessHandler, uploadErrorHandler);

    evt.preventDefault();
    window.map.setDefaultPinPosition();
  });

  adFormReset.addEventListener(`click`, () => {
    adForm.reset();
    window.map.setDisactiveState();
    window.map.setDefaultPinPosition();
  });
})();
