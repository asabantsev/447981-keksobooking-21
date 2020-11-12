'use strict';

const PINS_LIMIT = 5;
const PRICE_RANGE = {
  LOW: {
    MIN: 0,
    MAX: 10000
  },
  MIDDLE: {
    MIN: 10000,
    MAX: 50000
  },
  HIGH: {
    MIN: 50000,
    MAX: Infinity
  }
};
const FILTER_TYPES = {
  ANY: `any`,
  TYPE: `type`,
  ROOMS: `rooms`,
  GUESTS: `guests`
};

const mapFilters = document.querySelector(`.map__filters`);
const mapFiltersSelects = mapFilters.querySelectorAll(`select`);
const mapFiltersInputs = mapFilters.querySelectorAll(`input`);
const typeSelect = mapFilters.querySelector(`#housing-type`);
const priceSelect = mapFilters.querySelector(`#housing-price`);
const roomsSelect = mapFilters.querySelector(`#housing-rooms`);
const guestsSelect = mapFilters.querySelector(`#housing-guests`);
const featuresFieldset = mapFilters.querySelector(`#housing-features`);
let data = [];

const filtrationItem = (it, item, key) => {
  return it.value === FILTER_TYPES.ANY ? true : it.value === item[key].toString();
};

const filtrationByType = (obj) => {
  return filtrationItem(typeSelect, obj.offer, FILTER_TYPES.TYPE);
};

const filtrationByPrice = (obj) => {
  const filteringPrice = PRICE_RANGE[priceSelect.value.toUpperCase()];

  return filteringPrice ? obj.offer.price >= filteringPrice.MIN && obj.offer.price <= filteringPrice.MAX : true;
};

const filtrationByRooms = (obj) => {
  return filtrationItem(roomsSelect, obj.offer, FILTER_TYPES.ROOMS);
};

const filtrationByGuests = (obj) => {
  return filtrationItem(guestsSelect, obj.offer, FILTER_TYPES.GUESTS);
};

const filtrationByFeatures = (obj) => {
  const checkedFeaturesItems = featuresFieldset.querySelectorAll(`input:checked`);

  return Array.from(checkedFeaturesItems).every((element) => {
    return obj.offer.features.includes(element.value);
  });
};

const resetFilter = () => {
  mapFiltersSelects.forEach((it) => {
    it.value = FILTER_TYPES.ANY;
  });
  mapFiltersInputs.forEach((feature) => {
    feature.checked = false;
  });
};

const changeFilter = window.util.debounce(() => {
  let filteredData = [];
  let isSuitableOffer = true;
  for (let i = 0; i < data.length; i++) {
    isSuitableOffer = filtrationByType(data[i]);
    if (isSuitableOffer === false) {
      continue;
    }
    isSuitableOffer = filtrationByPrice(data[i]);
    if (isSuitableOffer === false) {
      continue;
    }
    isSuitableOffer = filtrationByRooms(data[i]);
    if (isSuitableOffer === false) {
      continue;
    }
    isSuitableOffer = filtrationByGuests(data[i]);
    if (isSuitableOffer === false) {
      continue;
    }
    isSuitableOffer = filtrationByFeatures(data[i]);
    if (isSuitableOffer === false) {
      continue;
    }
    filteredData.push(data[i]);
    if (filteredData.length >= PINS_LIMIT) {
      break;
    }
  }
  window.map.cardRemoveHandler();
  window.map.pinsRemoveHandler();
  window.map.renderPinsMarkup(filteredData);
});

const filtersChangeStatusHandler = (status) => {
  mapFiltersSelects.forEach((item) => {
    item.disabled = status;
  });

  mapFiltersInputs.forEach((item) => {
    item.disabled = status;
  });
};

const setFiltersActive = () => {
  filtersChangeStatusHandler(false);

  mapFilters.addEventListener(`change`, changeFilter);
};

const activateFiltration = (offerdata) => {
  data = offerdata.slice(0);
  window.filter.setFiltersActive();
  return offerdata.slice(0, PINS_LIMIT);
};

const setFiltersDisactive = () => {
  filtersChangeStatusHandler(true);

  resetFilter();
  mapFilters.removeEventListener(`change`, changeFilter);
};

window.filter = {
  setFiltersActive,
  activateFiltration,
  setFiltersDisactive
};
