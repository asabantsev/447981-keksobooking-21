'use strict';

(function () {
  const PHOTO_WIDTH = 45;
  const PHOTO_HEIGHT = 40;

  let cardTemplate = document.querySelector(`#card`).content.querySelector(`.popup`);

  window.renderCard = (obj) => {
    let cardElement = cardTemplate.cloneNode(true);

    cardElement.querySelector(`.popup__title`).textContent = obj.offer.title;
    cardElement.querySelector(`.popup__text--address`).textContent = obj.offer.address;
    cardElement.querySelector(`.popup__type`).textContent = obj.offer.type;
    cardElement.querySelector(`.popup__text--price`).textContent = obj.offer.price + `₽/ночь`;
    cardElement.querySelector(`.popup__text--capacity`).textContent = obj.offer.rooms + ` комнаты для ` + obj.offer.guests + ` гостей`;
    cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ` + obj.offer.checkin + `, выезд до ` + obj.offer.checkout;

    let features = cardElement.querySelector(`.popup__features`);
    features.textContent = ``;

    for (let i = 0; i < obj.offer.features.length; i++) {
      let li = document.createElement(`li`);
      li.className = `popup__feature`;
      features.appendChild(li);
      li.classList.add(`popup__feature--` + obj.offer.features[i]);
    }

    cardElement.querySelector(`.popup__description`).textContent = obj.offer.description;

    let photos = cardElement.querySelector(`.popup__photos`);
    photos.textContent = ``;

    for (let i = 0; i < obj.offer.photos.length; i++) {
      let photo = document.createElement(`img`);
      photo.src = obj.offer.photos[i];
      photo.alt = `Фотография жилья`;
      photo.className = `popup__photo`;
      photo.width = PHOTO_WIDTH;
      photo.height = PHOTO_HEIGHT;
      photos.appendChild(photo);
    }

    cardElement.querySelector(`.popup__avatar`).src = obj.author.avatar;

    return cardElement;
  };
})();
