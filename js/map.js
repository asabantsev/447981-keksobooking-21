'use strict';

(function () {
  const MAP_PIN_WIDTH = 65;
  const MAP_PIN_HEIGHT = 65;
  const OFFER_LOCATION_X_MIN = 130;
  const OFFER_LOCATION_X_MAX = 1070;
  const OFFER_LOCATION_Y_MIN = 130;
  const OFFER_LOCATION_Y_MAX = 630;

  let map = document.querySelector(`.map`);
  let mapPins = map.querySelector(`.map__pins`);
  let mapPin = map.querySelector(`.map__pin--main`);
  let adForm = document.querySelector(`.ad-form`);
  let adFormFieldsets = adForm.querySelectorAll(`fieldset`);
  let mapFiltersContainer = map.querySelector(`.map__filters-container`);
  let mapFilters = mapFiltersContainer.querySelector(`.map__filters`);
  let mapFiltersSelects = mapFilters.querySelectorAll(`select`);
  let mapFiltersInputs = mapFilters.querySelectorAll(`input`);
  let adFormAddress = adForm.querySelector(`input[name="address"]`);
  adFormAddress.readonly = true;

  let loadSuccessHandler = (data) => {
    const addIdToSourceData = (array) => {
      return array.map((item, index) => {
        item.offer.id = index;

        return item;
      });
    };

    window.offers = addIdToSourceData(data);

    let fragment = document.createDocumentFragment();

    for (let i = 0; i < window.offers.length; i++) {
      fragment.appendChild(window.renderOffers(window.offers[i]));
    }

    mapPins.appendChild(fragment);
  };

  let loadErrorHandler = (errorMessage) => {
    let node = document.createElement(`div`);

    node.style.zIndex = 100;
    node.style.margin = `0 auto`;
    node.style.textAlign = `center`;
    node.style.backgroundColor = `red`;
    node.style.position = `absolute`;
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = `30px`;

    node.textContent = errorMessage;
    document.body.insertAdjacentElement(`afterbegin`, node);
  };

  let activateHandler = () => {
    setActiveState();
  };

  let setActiveState = () => {
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

    window.load(loadSuccessHandler, loadErrorHandler);

    mapPin.removeEventListener(`click`, activateHandler);

    map.addEventListener(`click`, mapPinHandler);

    mapPin.addEventListener(`mousedown`, (evt) => {
      evt.preventDefault();

      let startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      let mouseMoveHandler = (moveEvt) => {
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

        let currentY = mapPin.offsetTop - shift.y;
        let currentX = mapPin.offsetLeft - shift.x;

        if (currentX < OFFER_LOCATION_X_MIN) {
          mapPin.style.left = OFFER_LOCATION_X_MIN + `px`;
        }

        if (currentX > OFFER_LOCATION_X_MAX) {
          mapPin.style.left = OFFER_LOCATION_X_MAX + `px`;
        }

        if (currentY < OFFER_LOCATION_Y_MIN) {
          mapPin.style.top = OFFER_LOCATION_Y_MIN + `px`;
        }

        if (currentY > OFFER_LOCATION_Y_MAX) {
          mapPin.style.top = OFFER_LOCATION_Y_MAX + `px`;
        }
        adFormAddress.value = `X: ` + (currentX - MAP_PIN_WIDTH / 2) + ` px` + `, Y: ` + (currentY - MAP_PIN_HEIGHT) + ` px`;
      };

      let mouseUpHandler = (upEvt) => {
        upEvt.preventDefault();

        document.removeEventListener(`mousemove`, mouseMoveHandler);
        document.removeEventListener(`mouseup`, mouseUpHandler);
      };

      document.addEventListener(`mousemove`, mouseMoveHandler);
      document.addEventListener(`mouseup`, mouseUpHandler);
    });
  };

  window.setDisactiveState = () => {
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
  };

  let cardCloseHandler = () => {
    let mapCard = map.querySelector(`.map__card`);
    mapCard.remove();
    let pointerActive = map.querySelector(`.map__pin--active`);
    pointerActive.classList.remove(`map__pin--active`);
    document.removeEventListener(`keydown`, cardEcsHandler);
  };

  let cardEcsHandler = (evt) => {
    if (evt.key === `Escape`) {
      cardCloseHandler();
    }
  };

  let cardOpenHandler = (pinAttr, pointer) => {
    map.insertBefore(window.renderCard(window.offers[pinAttr]), mapPins);
    pointer.classList.add(`map__pin--active`);
    document.addEventListener(`keydown`, cardEcsHandler);
    let cardClose = map.querySelector(`.popup__close`);
    cardClose.addEventListener(`click`, cardCloseHandler);
  };

  let mapPinHandler = (evt) => {
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
