'use strict';

(function () {
  const PIN_WIDTH = 50;
  const PIN_HEIGHT = 70;

  let pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

  window.renderOffers = (obj) => {
    let pinElement = pinTemplate.cloneNode(true);

    pinElement.style.left = obj.location.x - PIN_WIDTH / 2 + `px`;
    pinElement.style.top = obj.location.y - PIN_HEIGHT + `px`;
    pinElement.querySelector(`img`).src = obj.author.avatar;
    pinElement.querySelector(`img`).alt = obj.offer.description;
    pinElement.dataset.id = obj.offer.id;

    return pinElement;
  };
})();
