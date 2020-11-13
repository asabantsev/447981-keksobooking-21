'use strict';

const PHOTO_WIDTH = 45;
const PHOTO_HEIGHT = 40;

const TYPES_MAP = {
  PALACE: `Дворец`,
  FLAT: `Квартира`,
  HOUSE: `Дом`,
  BUNGALO: `Бунгало`
};

const cardTemplate = document.querySelector(`#card`).content.querySelector(`.popup`);
const cardElement = cardTemplate.cloneNode(true);

const renderPopupType = (obj) => {
  const popupType = cardElement.querySelector(`.popup__type`);
  if (obj.offer.type === `palace`) {
    popupType.textContent = TYPES_MAP.PALACE;
  } else if (obj.offer.type === `flat`) {
    popupType.textContent = TYPES_MAP.FLAT;
  } else if (obj.offer.type === `house`) {
    popupType.textContent = TYPES_MAP.HOUSE;
  } else {
    popupType.textContent = TYPES_MAP.BUNGALO;
  }
};

const renderPopupFeatures = (obj) => {
  const features = cardElement.querySelector(`.popup__features`);
  features.textContent = ``;

  for (let i = 0; i < obj.offer.features.length; i++) {
    const li = document.createElement(`li`);
    li.className = `popup__feature`;
    features.appendChild(li);
    li.classList.add(`popup__feature--` + obj.offer.features[i]);
  }
};

const renderPopupPhotos = (obj) => {
  const photos = cardElement.querySelector(`.popup__photos`);
  photos.textContent = ``;

  for (let i = 0; i < obj.offer.photos.length; i++) {
    const photo = document.createElement(`img`);
    photo.src = obj.offer.photos[i];
    photo.alt = `Фотография жилья`;
    photo.className = `popup__photo`;
    photo.width = PHOTO_WIDTH;
    photo.height = PHOTO_HEIGHT;
    photos.appendChild(photo);
  }
};

const renderPopup = (obj) => {
  const {
    author: {
      avatar: avatar
    },
    offer: {
      title: title,
      address: address,
      price: price,
      rooms: rooms,
      guests: guests,
      checkin: checkin,
      checkout: checkout,
      description: description,
    }
  } = obj;

  cardElement.querySelector(`.popup__title`).textContent = title;
  cardElement.querySelector(`.popup__text--address`).textContent = address;
  renderPopupType(obj);
  cardElement.querySelector(`.popup__text--price`).textContent = `${price} ₽/ночь`;
  cardElement.querySelector(`.popup__text--capacity`).textContent = `${rooms} комнаты для ${guests} гостей`;
  cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${checkin}, выезд до ${checkout}`;
  renderPopupFeatures(obj);
  cardElement.querySelector(`.popup__description`).textContent = description;
  renderPopupPhotos(obj);
  cardElement.querySelector(`.popup__avatar`).src = avatar;

  return cardElement;
};

window.card = {
  renderPopup,
};
