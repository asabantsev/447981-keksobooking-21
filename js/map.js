'use strict';

(function () {
  const MAP_PIN_WIDTH = 65;
  const MAP_PIN_HEIGHT = 65;

  let map = document.querySelector(`.map`);
  let mapPins = map.querySelector(`.map__pins`);
  let mapPin = map.querySelector(`.map__pin--main`);
  let adForm = document.querySelector(`.ad-form`);
  let fragment = document.createDocumentFragment();
  let adFormFieldsets = adForm.querySelectorAll(`fieldset`);
  let mapFiltersContainer = map.querySelector(`.map__filters-container`);
  let mapFilters = mapFiltersContainer.querySelector(`.map__filters`);
  let mapFiltersSelects = mapFilters.querySelectorAll(`select`);
  let mapFiltersInputs = mapFilters.querySelectorAll(`input`);
  let adFormAddress = adForm.querySelector(`input[name="address"]`);
  adFormAddress.readonly = true;

  let activateHandler = function () {
    setActiveState();
  };

  let setActiveState = function () {
    map.classList.remove(`map--faded`);
    adForm.classList.remove(`ad-form--disabled`);

    for (let i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].disabled = false;
    }

    for (let i = 0; i < mapFiltersSelects.length; i++) {
      mapFiltersSelects[i].disabled = false;
    }

    for (let i = 0; i < mapFiltersInputs.length; i++) {
      mapFiltersInputs[i].disabled = false;
    }

    for (let i = 0; i < window.offers.length; i++) {
      fragment.appendChild(window.renderOffers(window.offers[i]));
    }

    mapPins.appendChild(fragment);

    mapPin.removeEventListener(`mousedown`, activateHandler);

    map.addEventListener(`click`, mapPinHandler);
  };

  window.setDisactiveState = function () {
    map.classList.add(`map--faded`);
    adForm.classList.add(`ad-form--disabled`);

    for (let i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].disabled = true;
    }

    for (let i = 0; i < mapFiltersSelects.length; i++) {
      mapFiltersSelects[i].disabled = true;
    }

    for (let i = 0; i < mapFiltersInputs.length; i++) {
      mapFiltersInputs[i].disabled = true;
    }

    mapPin.addEventListener(`click`, activateHandler);

    mapPin.addEventListener(`mousedown`, function (evt) {
      evt.preventDefault();

      let startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      let mouseMoveHandler = function (moveEvt) {
        moveEvt.preventDefault();

        let shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY,
        };

        mapPin.style.top = (mapPin.offsetTop - shift.y) + `px`;
        mapPin.style.left = (mapPin.offsetLeft - shift.x) + `px`;

        window.mapPinFormValueX = (mapPin.offsetLeft - shift.x + MAP_PIN_WIDTH / 2);
        window.mapPinFormValueY = (mapPin.offsetTop - shift.y + MAP_PIN_HEIGHT);

        if (window.mapPinFormValueY <= window.OFFER_LOCATION_Y_MIN || window.mapPinFormValueY >= window.OFFER_LOCATION_Y_MAX) {
          document.removeEventListener(`mousemove`, mouseMoveHandler);
        } else if (window.mapPinFormValueX <= window.OFFER_LOCATION_X_MIN || window.mapPinFormValueX >= window.OFFER_LOCATION_X_MAX) {
          document.removeEventListener(`mousemove`, mouseMoveHandler);
        }

        let mapCard = map.querySelector(`.map__card`);
        if (mapCard) {
          cardCloseHandler();
        }
      };

      let mouseUpHandler = function (upEvt) {
        upEvt.preventDefault();
        adFormAddress.value = `X: ` + window.mapPinFormValueX + ` px` + `, Y: ` + window.mapPinFormValueY + ` px`;

        document.removeEventListener(`mousemove`, mouseMoveHandler);
        document.removeEventListener(`mouseup`, mouseUpHandler);
      };

      document.addEventListener(`mousemove`, mouseMoveHandler);
      document.addEventListener(`mouseup`, mouseUpHandler);
    });
  };

  let cardCloseHandler = function () {
    let mapCard = map.querySelector(`.map__card`);
    mapCard.remove();
    let pointerActive = map.querySelector(`.map__pin--active`);
    pointerActive.classList.remove(`map__pin--active`);
    document.removeEventListener(`keydown`, cardEcsHandler);
  };

  let cardEcsHandler = function (evt) {
    if (evt.key === `Escape`) {
      cardCloseHandler();
    }
  };

  let cardOpenHandler = function (pinAttr, pointer) {
    map.insertBefore(window.renderCard(window.offers[pinAttr]), mapPins);
    pointer.classList.add(`map__pin--active`);
    document.addEventListener(`keydown`, cardEcsHandler);
    let cardClose = map.querySelector(`.popup__close`);
    cardClose.addEventListener(`click`, cardCloseHandler);
  };

  let mapPinHandler = function (evt) {
    let pointer = evt.target.closest(`.map__pin`);
    let mapCard = map.querySelector(`.map__card`);

    if (pointer && !pointer.classList.contains(`map__pin--main`)) {
      let pinAttr = pointer.attributes[3].value;
      if (!mapCard) {
        cardOpenHandler(pinAttr, pointer);
      } else {
        cardCloseHandler();
        cardOpenHandler(pinAttr, pointer);
      }
    }
  };

})();
