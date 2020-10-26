'use strict';

(function () {
  const OFFER_CHECKIN = [`12:00`, `13:00`, `14:00`];
  const OFFER_CHECKOUT = [`12:00`, `13:00`, `14:00`];
  window.OFFER_TYPE = [`Дворец`, `Квартира`, `Дом`, `Бунгало`];
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
  window.OFFER_LOCATION_X_MIN = 130;
  window.OFFER_LOCATION_X_MAX = 1070;
  window.OFFER_LOCATION_Y_MIN = 130;
  window.OFFER_LOCATION_Y_MAX = 630;
  const OFFER_COUNT = 8;

  let getRandomItem = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  let getOfferLocationArray = function (length) {
    let array = [];

    for (let i = 0; i < length; i++) {
      array.push({
        x: getRandomItem(window.OFFER_LOCATION_X_MIN, window.OFFER_LOCATION_X_MAX),
        y: getRandomItem(window.OFFER_LOCATION_Y_MIN, window.OFFER_LOCATION_Y_MAX),
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
        id: i,
        author: {
          avatar: `img/avatars/user0` + (i + 1) + `.png`,
        },
        offer: {
          title: `Заголовок предложения`,
          address: offersLocation[i].x + `, ` + offersLocation[i].y,
          price: getRandomItem(OFFER_PRICE_MIN, OFFER_PRICE_MAX),
          type: window.OFFER_TYPE[getRandomItem(0, window.OFFER_TYPE.length)],
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

  window.offers = getOfferArray(OFFER_COUNT);
})();
