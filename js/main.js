'use strict';

const OFFER_CHECKIN = [`12:00`, `13:00`, `14:00`];
const OFFER_CHECKOUT = [`12:00`, `13:00`, `14:00`];
const OFFER_TYPE = [`palace`, `flat`, `house`, `bungalow`];
const OFFER_FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const OFFER_PHOTOS = [
  `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
];
const OFFER_ROOMS_MIN = 1;
const OFFER_ROOMS_MAX = 3;
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
        price: `Стоимость`,
        type: OFFER_TYPE[getRandomItem(0, OFFER_TYPE.length)],
        features: getRandomArray(OFFER_FEATURES),
        rooms: getRandomItem(OFFER_ROOMS_MIN, OFFER_ROOMS_MAX),
        guests: getRandomItem(OFFER_ROOMS_MIN, OFFER_ROOMS_MAX),
        checkin: OFFER_CHECKIN[getRandomItem(0, OFFER_CHECKIN.length)],
        checkout: OFFER_CHECKOUT[getRandomItem(0, OFFER_CHECKOUT.length)],
        description: `Строка с описанием`,
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

let renderOffers = function (obj) {
  let pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = obj.location.x - PIN_WIDTH / 2 + `px`;
  pinElement.style.top = obj.location.y - PIN_HEIGHT / 2 + `px`;
  pinTemplate.getElementsByTagName(`img`)[0].src = obj.author.avatar;
  pinTemplate.getElementsByTagName(`img`)[0].alt = obj.offer.description;

  return pinElement;
};

let mapPins = map.querySelector(`.map__pins`);

let fragment = document.createDocumentFragment();

for (let i = 0; i < offers.length; i++) {
  fragment.appendChild(renderOffers(offers[i]));
}

mapPins.appendChild(fragment);
