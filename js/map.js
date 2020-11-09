'use strict';

(() => {
  const MAP_PIN_WIDTH = 65;
  const MAP_PIN_HEIGHT = 65;
  const MAP_PIN_POINTER = 22;
  const OFFER_LOCATION_X_MIN = 0;
  const OFFER_LOCATION_Y_MIN = 130;
  const OFFER_LOCATION_Y_MAX = 630;
  const MAIN_PIN_LEFT = 570;
  const MAIN_PIN_TOP = 375;
  const KEY_ESC = `Escape`;

  const map = document.querySelector(`.map`);
  const mapPins = map.querySelector(`.map__pins`);
  const mapPin = map.querySelector(`.map__pin--main`);
  const adForm = document.querySelector(`.ad-form`);
  const adFormFieldsets = adForm.querySelectorAll(`fieldset`);
  const adFormAddress = adForm.querySelector(`input[name="address"]`);
  adFormAddress.setAttribute(`readonly`, true);

  const setDefaultPinPosition = () => {
    mapPin.style.left = MAIN_PIN_LEFT + `px`;
    mapPin.style.top = MAIN_PIN_TOP + `px`;
  };

  mapPin.addEventListener(`mousedown`, (evt) => {
    evt.preventDefault();

    let startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    const mouseMoveHandler = (moveEvt) => {
      moveEvt.preventDefault();

      const shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      mapPin.style.top = (mapPin.offsetTop - shift.y) + `px`;
      mapPin.style.left = (mapPin.offsetLeft - shift.x) + `px`;

      const currentY = mapPin.offsetTop - shift.y;
      const currentX = mapPin.offsetLeft - shift.x;

      if (currentX > map.clientWidth) {
        mapPin.style.left = map.clientWidth + `px`;
      }

      if (currentX > (map.clientWidth - MAP_PIN_WIDTH / 2)) {
        mapPin.style.left = (map.clientWidth - MAP_PIN_WIDTH / 2) + `px`;
      }

      if (currentX < OFFER_LOCATION_X_MIN - MAP_PIN_WIDTH / 2) {
        mapPin.style.left = OFFER_LOCATION_X_MIN - (MAP_PIN_WIDTH / 2) + `px`;
      }

      if (currentY < OFFER_LOCATION_Y_MIN - (MAP_PIN_HEIGHT + MAP_PIN_POINTER)) {
        mapPin.style.top = Math.round(OFFER_LOCATION_Y_MIN - (MAP_PIN_HEIGHT + MAP_PIN_POINTER)) + `px`;
      }

      if (currentY > OFFER_LOCATION_Y_MAX - (MAP_PIN_HEIGHT + MAP_PIN_POINTER)) {
        mapPin.style.top = Math.round(OFFER_LOCATION_Y_MAX - (MAP_PIN_HEIGHT + MAP_PIN_POINTER)) + `px`;
      }

      adFormAddress.value = (mapPin.offsetLeft + Math.round(MAP_PIN_WIDTH / 2)) + `, ` + (mapPin.offsetTop + MAP_PIN_HEIGHT + MAP_PIN_POINTER);
    };

    const mouseUpHandler = (upEvt) => {
      upEvt.preventDefault();

      document.removeEventListener(`mousemove`, mouseMoveHandler);
      document.removeEventListener(`mouseup`, mouseUpHandler);
    };

    document.addEventListener(`mousemove`, mouseMoveHandler);
    document.addEventListener(`mouseup`, mouseUpHandler);
  });

  const renderPinsMarkup = (pinsData) => {
    const fragment = document.createDocumentFragment();

    pinsData.forEach((item) => {
      fragment.appendChild(window.pin.renderOffers(item));
    });

    mapPins.appendChild(fragment);
  };

  const loadSuccessHandler = (data) => {
    const addIdToSourceData = (array) => {
      return array.map((item, index) => {
        item.offer.id = index;

        return item;
      });
    };

    window.offers = addIdToSourceData(data);

    window.map.renderPinsMarkup(window.filter.activateFiltration(window.offers));
  };

  const loadErrorHandler = (errorMessage) => {
    const node = document.createElement(`div`);

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

  const mainPinClickHandler = () => {
    setActiveState();
  };

  const setActiveState = () => {
    map.classList.remove(`map--faded`);
    adForm.classList.remove(`ad-form--disabled`);

    adFormFieldsets.forEach((it)=>{
      it.disabled = false;
    });

    window.filter.setFiltersActive();

    window.backend.load(loadSuccessHandler, loadErrorHandler);

    mapPin.removeEventListener(`click`, mainPinClickHandler);

    map.addEventListener(`click`, pinClickHandler);
  };

  const pinsRemoveHandler = () => {
    const mapPinsItems = document.querySelectorAll(`.map__pin:not(.map__pin--main)`);
    mapPinsItems.forEach((item) => {
      item.remove();
    });
  };

  const cardRemoveHandler = () => {
    const mapCard = document.querySelector(`.map__card`);
    if (mapCard) {
      window.map.cardCloseHandler();
    }
  };

  const setDisactiveState = () => {
    map.classList.add(`map--faded`);
    adForm.classList.add(`ad-form--disabled`);

    adFormFieldsets.forEach((item) => {
      item.disabled = true;
    });

    window.filter.setFiltersDisactive();

    mapPin.addEventListener(`click`, mainPinClickHandler);

    window.map.cardRemoveHandler();
    window.map.pinsRemoveHandler();

    adFormAddress.value = MAIN_PIN_LEFT + `, ` + MAIN_PIN_TOP;
  };

  const cardCloseHandler = () => {
    const mapCard = map.querySelector(`.map__card`);
    mapCard.remove();
    const pointerActive = map.querySelector(`.map__pin--active`);
    pointerActive.classList.remove(`map__pin--active`);
    document.removeEventListener(`keydown`, documentEcsHandler);
  };

  const documentEcsHandler = (evt) => {
    if (evt.key === KEY_ESC) {
      window.map.cardCloseHandler();
    }
  };

  const cardOpenHandler = (pinAttr, pointer) => {
    map.insertBefore(window.card.renderPopup(window.offers[pinAttr]), mapPins);
    pointer.classList.add(`map__pin--active`);
    document.addEventListener(`keydown`, documentEcsHandler);
    const cardClose = map.querySelector(`.popup__close`);
    cardClose.addEventListener(`click`, window.map.cardCloseHandler);
  };

  const pinClickHandler = (evt) => {
    const pointer = evt.target.closest(`.map__pin`);
    const mapCard = map.querySelector(`.map__card`);

    if (pointer && !pointer.classList.contains(`map__pin--main`)) {
      const pinAttr = pointer.attributes[3].value;
      if (!mapCard) {
        cardOpenHandler(pinAttr, pointer);
      } else {
        window.map.cardCloseHandler();
        cardOpenHandler(pinAttr, pointer);
      }
    }
  };

  window.map = {
    setDefaultPinPosition,
    renderPinsMarkup,
    pinsRemoveHandler,
    cardRemoveHandler,
    cardCloseHandler,
    setDisactiveState,
  };

})();
