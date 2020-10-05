'use strict';

const OFFER_CHECKIN = [`12:00`, `13:00`, `14:00`];
const OFFER_CHECKOUT = [`12:00`, `13:00`, `14:00`];
const OFFER_TYPE = [`Дворец`, `Квартира`, `Дом`, `Бунгало`];
const OFFER_FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const OFFER_DESCRIPTION = [`Великолепная квартира-студия в центре Токио.`, `Подходит как туристам, так и бизнесменам.`, `Квартира полностью укомплектована и недавно отремонтирована.`];
const OFFER_PHOTOS = [
  `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
];
const OFFER_ROOMS_MIN = 1;
const OFFER_ROOMS_MAX = 3;
const OFFER_PRICE_MIN = 0;
const OFFER_PRICE_MAX = 10000;
const OFFER_LOCATION_X_MIN = 130;
const OFFER_LOCATION_X_MAX = 1070;
const OFFER_LOCATION_Y_MIN = 130;
const OFFER_LOCATION_Y_MAX = 630;
const OFFER_COUNT = 8;
const PIN_WIDTH = 50;
const PIN_HEIGHT = 70;

let getRandomItem = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

let getOfferLocationArray = function (length) {
  let array = [];

  for (let i = 0; i < length; i++) {
    array.push({
      x: getRandomItem(OFFER_LOCATION_X_MIN, OFFER_LOCATION_X_MAX),
      y: getRandomItem(OFFER_LOCATION_Y_MIN, OFFER_LOCATION_Y_MAX),
    });
  }

  return array;
};

let offersLocation = getOfferLocationArray(OFFER_COUNT);

let suffleArray = function (array) {
  let i = array.length;

  while (i !== 0) {
    const randomIndex = Math.floor(Math.random() * i);
    i -= 1;

    const temporaryValue = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

let getRandomArray = function (array) {
  return suffleArray(array).slice(getRandomItem(0, array.length));
};

let getOfferArray = function (length) {
  let array = [];

  for (let i = 0; i < length; i++) {
    array.push({
      author: {
        avatar: `img/avatars/user0` + (i + 1) + `.png`,
      },
      offer: {
        title: `Заголовок предложения`,
        address: offersLocation[i].x + `, ` + offersLocation[i].y,
        price: getRandomItem(OFFER_PRICE_MIN, OFFER_PRICE_MAX),
        type: OFFER_TYPE[getRandomItem(0, OFFER_TYPE.length)],
        features: getRandomArray(OFFER_FEATURES),
        rooms: getRandomItem(OFFER_ROOMS_MIN, OFFER_ROOMS_MAX),
        guests: getRandomItem(OFFER_ROOMS_MIN, OFFER_ROOMS_MAX),
        checkin: OFFER_CHECKIN[getRandomItem(0, OFFER_CHECKIN.length)],
        checkout: OFFER_CHECKOUT[getRandomItem(0, OFFER_CHECKOUT.length)],
        description: OFFER_DESCRIPTION[getRandomItem(0, OFFER_CHECKOUT.length)],
        photos: getRandomArray(OFFER_PHOTOS),
      },
      location: {
        x: offersLocation[i].x,
        y: offersLocation[i].y,
      }
    });
  }

  return array;
};

let offers = getOfferArray(OFFER_COUNT);

let map = document.querySelector(`.map`);
map.classList.remove(`map--faded`);

let pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
let cardTemplate = document.querySelector(`#card`).content.querySelector(`.popup`);

let renderOffers = function (obj) {
  let pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = obj.location.x - PIN_WIDTH + `px`;
  pinElement.style.top = obj.location.y - PIN_HEIGHT + `px`;
  pinTemplate.getElementsByTagName(`img`)[0].src = obj.author.avatar;
  pinTemplate.getElementsByTagName(`img`)[0].alt = obj.offer.description;

  return pinElement;
};

let renderCard = function (obj) {
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
    photo.width = 45;
    photo.height = 40;
    photos.appendChild(photo);
  }

  cardElement.querySelector(`.popup__avatar`).src = obj.author.avatar;

  return cardElement;
};

let mapPins = map.querySelector(`.map__pins`);

let fragment = document.createDocumentFragment();

for (let i = 0; i < offers.length; i++) {
  fragment.appendChild(renderOffers(offers[i]));
  fragment.appendChild(renderCard(offers[i]));
}

mapPins.appendChild(fragment);
