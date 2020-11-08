'use strict';

(function () {
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

  let mapFilters = document.querySelector(`.map__filters`);
  let mapFiltersSelects = mapFilters.querySelectorAll(`select`);
  let mapFiltersInputs = mapFilters.querySelectorAll(`input`);
  let typeSelect = mapFilters.querySelector(`#housing-type`);
  let priceSelect = mapFilters.querySelector(`#housing-price`);
  let roomsSelect = mapFilters.querySelector(`#housing-rooms`);
  let guestsSelect = mapFilters.querySelector(`#housing-guests`);
  let featuresFieldset = mapFilters.querySelector(`#housing-features`);
  let data = [];
  let filteredData = [];

  let filtrationItem = (it, item, key) => {
    return it.value === `any` ? true : it.value === item[key].toString();
  };

  let filtrationByType = (obj) => {
    return filtrationItem(typeSelect, obj.offer, `type`);
  };

  let filtrationByPrice = (obj) => {
    let filteringPrice = PRICE_RANGE[priceSelect.value.toUpperCase()];

    return filteringPrice ? obj.offer.price >= filteringPrice.MIN && obj.offer.price <= filteringPrice.MAX : true;
  };

  let filtrationByRooms = (obj) => {
    return filtrationItem(roomsSelect, obj.offer, `rooms`);
  };

  let filtrationByGuests = (obj) => {
    return filtrationItem(guestsSelect, obj.offer, `guests`);
  };

  let filtrationByFeatures = (obj) => {
    let checkedFeaturesItems = featuresFieldset.querySelectorAll(`input:checked`);

    return Array.from(checkedFeaturesItems).every((element) => {
      return obj.offer.features.includes(element.value);
    });
  };

  let resetFilter = () => {
    mapFiltersSelects.forEach((it) => {
      it.value = `any`;
    });
    mapFiltersInputs.forEach((feature) => {
      feature.checked = false;
    });
  };

  let filterChangeHandler = window.util.debounce(() => {
    filteredData = data.slice(0);
    filteredData = filteredData.filter(filtrationByType).filter(filtrationByPrice).filter(filtrationByRooms).filter(filtrationByGuests).filter(filtrationByFeatures);
    window.map.cardRemoveHandler();
    window.map.pinsRemoveHandler();
    window.map.renderPinsMarkup(filteredData.slice(0, PINS_LIMIT));
  });

  let setFiltersActive = () => {
    mapFiltersSelects.forEach((item) => {
      item.disabled = false;
    });

    mapFiltersInputs.forEach((item) => {
      item.disabled = false;
    });

    mapFilters.addEventListener(`change`, filterChangeHandler);
  };

  let activateFiltration = (offerdata) => {
    data = offerdata.slice(0);
    window.filter.setFiltersActive();
    return offerdata.slice(0, PINS_LIMIT);
  };

  let setFiltersDisactive = () => {
    mapFiltersSelects.forEach((item) => {
      item.disabled = true;
    });

    mapFiltersInputs.forEach((item) => {
      item.disabled = true;
    });

    resetFilter();
    mapFilters.removeEventListener(`change`, filterChangeHandler);
  };

  window.filter = {
    setFiltersActive,
    activateFiltration,
    setFiltersDisactive
  };
})();
