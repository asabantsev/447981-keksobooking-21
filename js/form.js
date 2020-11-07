'use strict';

(function () {
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

  let main = document.querySelector(`main`);
  let adForm = document.querySelector(`.ad-form`);
  let adFormRooms = adForm.querySelector(`select[name="rooms"]`);
  let adFormCapacity = adForm.querySelector(`select[name="capacity"]`);
  let adFormTitle = adForm.querySelector(`#title`);
  let adFormPrice = adForm.querySelector(`#price`);
  let adFormType = adForm.querySelector(`#type`);
  let adFormTimein = adForm.querySelector(`#timein`);
  let adFormTimeout = adForm.querySelector(`#timeout`);
  let adFormReset = adForm.querySelector(`.ad-form__reset`);
  let adFormSubmit = document.querySelector(`.ad-form__submit`);
  let minPrice;
  let successMessageTemplate = document.querySelector(`#success`).content.querySelector(`.success`);

  adFormCapacity.addEventListener(`input`, () => {
    if (+adFormRooms.value === ROOMS[0] && +adFormCapacity.value !== CAPACITY[2]) {
      adFormCapacity.setCustomValidity(`Необходимо выбрать 1-го гостя`);
    } else if (+adFormRooms.value === ROOMS[1] && +adFormCapacity.value !== CAPACITY[2] && +adFormCapacity.value !== CAPACITY[1]) {
      adFormCapacity.setCustomValidity(`Необходимо выбрать 1-го или 2-х гостей`);
    } else if (+adFormRooms.value === ROOMS[2] && +adFormCapacity.value !== CAPACITY[0] && +adFormCapacity.value !== CAPACITY[1] && +adFormCapacity.value !== CAPACITY[2]) {
      adFormCapacity.setCustomValidity(`Необходимо выбрать 1-го, 2-х или 3-х гостей`);
    } else if (+adFormRooms.value === ROOMS[3] && +adFormCapacity.value !== CAPACITY[3]) {
      adFormCapacity.setCustomValidity(`Необходимо выбрать "не для гостей"`);
    } else {
      adFormCapacity.setCustomValidity(``);
    }

    adFormCapacity.reportValidity();
  });

  adFormTitle.addEventListener(`input`, () => {
    if (adFormTitle.value.length < TITLE_MIN_LENGTH) {
      adFormTitle.setCustomValidity(`Заголовок объявления должен быть больше ${TITLE_MIN_LENGTH} символов. Сейчас ${adFormTitle.value.length}.`);
    } else if (adFormTitle.value.length > TITLE_MAX_LENGTH) {
      adFormTitle.setCustomValidity(`Заголовок объявления должен быть не более ${TITLE_MAX_LENGTH} символов. Сейчас ${adFormTitle.value.length}.`);
    } else {
      adFormTitle.setCustomValidity(``);
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
    let adFormTypeText = OFFER_TYPE_VALUE[adFormType.value];

    if (adFormPrice.value > MAX_PRICE) {
      adFormPrice.setCustomValidity(`Максимальная цена за ночь ${MAX_PRICE} руб.`);
    } else if (adFormPrice.value < minPrice) {
      adFormPrice.setCustomValidity(`Минимальная цена за ночь в типе жилья: ${adFormTypeText}, ${minPrice} руб.`);
    } else {
      adFormPrice.setCustomValidity(``);
    }
    adFormPrice.reportValidity();
  });

  adFormTimein.addEventListener(`change`, (evt) => {
    adFormTimeout.value = evt.target.value;
  });

  adFormTimeout.addEventListener(`change`, (evt) => {
    adFormTimein.value = evt.target.value;
  });

  let uploadSuccessHandler = () => {
    let renderSuccessMessage = () => {
      let successMessageElement = successMessageTemplate.cloneNode(true);

      let escHandler = (evt) => {
        if (evt.key === `Escape`) {
          successMessageElement.remove();
        }
        document.removeEventListener(`keydown`, escHandler);
        document.removeEventListener(`click`, clickHandler);
      };

      let clickHandler = () => {
        successMessageElement.remove();
        document.removeEventListener(`click`, clickHandler);
        document.removeEventListener(`keydown`, escHandler);
      };

      document.addEventListener(`keydown`, escHandler);
      document.addEventListener(`click`, clickHandler);

      return successMessageElement;
    };

    main.appendChild(renderSuccessMessage());
    adForm.reset();
    window.map.setDisactiveState();
  };

  let uploadErrorHandler = () => {
    let errorMessageTemplate = document.querySelector(`#error`).content.querySelector(`.error`);

    let renderErrorMessage = () => {
      let errorMessageElement = errorMessageTemplate.cloneNode(true);
      let errorMessageButton = errorMessageElement.querySelector(`.error__button`);

      let escHandler = (evt) => {
        if (evt.key === `Escape`) {
          errorMessageElement.remove();
        }
        document.removeEventListener(`keydown`, escHandler);
        document.removeEventListener(`click`, clickHandler);
      };

      let clickHandler = () => {
        errorMessageElement.remove();
        document.removeEventListener(`click`, clickHandler);
        document.removeEventListener(`keydown`, escHandler);
      };

      errorMessageButton.addEventListener(`click`, clickHandler);
      document.addEventListener(`click`, clickHandler);
      document.addEventListener(`keydown`, escHandler);

      return errorMessageElement;
    };

    main.appendChild(renderErrorMessage());
  };

  adFormSubmit.addEventListener(`click`, () => {
    checkValidity();
  });

  let checkValidity = () => {
    if (adFormTitle.value.length === 0) {
      adFormTitle.setCustomValidity(`Введите заголовок`);
    }

    let adFormTypeText = OFFER_TYPE_VALUE[adFormType.value];

    if (adFormPrice.value.length === 0) {
      adFormPrice.setCustomValidity(`Введите цену`);
    } else if (adFormPrice.value > MAX_PRICE) {
      adFormPrice.setCustomValidity(`Максимальная цена за ночь ${MAX_PRICE} руб.`);
    } else if (adFormPrice.value < minPrice) {
      adFormPrice.setCustomValidity(`Минимальная цена за ночь в типе жилья: ${adFormTypeText}, ${minPrice} руб.`);
    } else {
      adFormPrice.setCustomValidity(``);
    }

    if (adFormRooms.value.indexOf(+adFormCapacity.value) === -1) {
      adFormCapacity.setCustomValidity(`Выбранное количество гостей не поместятся в данное количество комнат`);
    } else {
      adFormCapacity.setCustomValidity(``);
    }
  };

  adForm.addEventListener(`submit`, (evt) => {
    window.upload(new FormData(adForm), uploadSuccessHandler, uploadErrorHandler);

    evt.preventDefault();
    window.map.getDefaultPinPosition();
  });

  adFormReset.addEventListener(`click`, () => {
    adForm.reset();
    window.map.setDisactiveState();
    window.map.getDefaultPinPosition();
  });
})();
