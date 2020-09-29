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
const OFFER_LOCATION_X_MAX = 630;
const OFFER_LOCATION_Y_MIN = 130;
const OFFER_LOCATION_Y_MAX = 630;
const OFFER_COUNT = 8;

let getRandomItem = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

let getOfferArray = function (lenght) {
  let array = [];

  for (let i = 1; i <= lenght; i++) {
    array.push({
      author: {
        avatar: `img/avatars/user0` + i + `.png`,
      },
      offer: {
        title: `Заголовок предложения`,
        address: getRandomItem(OFFER_LOCATION_X_MIN, OFFER_LOCATION_X_MAX) + `, ` + getRandomItem(OFFER_LOCATION_Y_MIN, OFFER_LOCATION_Y_MAX),
        price: `Стоимость`,
        type: OFFER_TYPE[getRandomItem(0, OFFER_TYPE.length)],
        rooms: getRandomItem(OFFER_ROOMS_MIN, OFFER_ROOMS_MAX),
        guests: getRandomItem(OFFER_ROOMS_MIN, OFFER_ROOMS_MAX),
        checkin: OFFER_CHECKIN[getRandomItem(0, OFFER_CHECKIN.length)],
        checkout: OFFER_CHECKOUT[getRandomItem(0, OFFER_CHECKOUT.length)],
        features: OFFER_FEATURES[getRandomItem(0, OFFER_FEATURES.length)],
        description: `Строка с описанием`,
        photos: OFFER_PHOTOS[getRandomItem(0, OFFER_PHOTOS.length)],
      },
      location: {
        x: getRandomItem(OFFER_LOCATION_X_MIN, OFFER_LOCATION_X_MAX),
        y: getRandomItem(OFFER_LOCATION_Y_MIN, OFFER_LOCATION_Y_MAX),
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

  pinElement.style.left = obj.location.x - 25 + `px`;
  pinElement.style.top = obj.location.y - 35 + `px`;
  pinTemplate.getElementsByTagName(`img`)[0].src = obj.author.avatar;
  pinTemplate.getElementsByTagName(`img`)[0].alt = obj.offer.description;

  return pinElement;
};

let mapPins = document.querySelector(`.map__pins`);

let fragment = document.createDocumentFragment();

for (let i = 0; i < offers.length; i++) {
  fragment.appendChild(renderOffers(offers[i]));
}

mapPins.appendChild(fragment);
