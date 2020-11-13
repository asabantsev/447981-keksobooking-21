'use strict';

const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;

const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

const renderOffers = (obj) => {
  const pinElement = pinTemplate.cloneNode(true);

  const {
    location: {
      x: x,
      y: y,
    },
    author: {
      avatar: avatar,
    },
    offer: {
      description: description,
      id: id,
    },
  } = obj;

  pinElement.style.left = x - PIN_WIDTH / 2 + `px`;
  pinElement.style.top = y - PIN_HEIGHT + `px`;
  pinElement.querySelector(`img`).src = avatar;
  pinElement.querySelector(`img`).alt = description;
  pinElement.dataset.id = id;

  return pinElement;
};

window.pin = {
  renderOffers,
};
