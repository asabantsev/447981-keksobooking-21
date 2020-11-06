'use strict';

(function () {
  const PINS_LIMIT = 5;

  let mapFilters = document.querySelector(`.map__filters`);
  let mapFiltersSelects = mapFilters.querySelectorAll(`select`);
  let mapFiltersInputs = mapFilters.querySelectorAll(`input`);
  let typeSelect = mapFilters.querySelector(`#housing-type`);
  let data = [];
  let filteredData = [];

  let filtrationItem = (it, item, key) => {
    return it.value === `any` ? true : it.value === item[key].toString();
  };

  let filtrationByType = (obj) => {
    return filtrationItem(typeSelect, obj.offer, `type`);
  };

  let filterChangeHandler = () => {
    filteredData = data.slice(0);
    filteredData = filteredData.filter(filtrationByType);
    window.cardRemoveHandler();
    window.pinsRemoveHandler();
    window.renderPinsMarkup(filteredData.slice(0, PINS_LIMIT));
  };

  window.setFiltersActive = () => {
    for (let i = 0; i < mapFiltersSelects.length; i++) {
      mapFiltersSelects[i].disabled = false;
    }

    for (let i = 0; i < mapFiltersInputs.length; i++) {
      mapFiltersInputs[i].disabled = false;
    }

    mapFilters.addEventListener(`change`, filterChangeHandler);
  };

  window.activateFiltration = (offerdata) => {
    data = offerdata.slice(0);
    window.setFiltersActive();
    return offerdata.slice(0, PINS_LIMIT);
  };

  window.setFiltersDisactive = () => {
    for (let i = 0; i < mapFiltersSelects.length; i++) {
      mapFiltersSelects[i].disabled = true;
    }

    for (let i = 0; i < mapFiltersInputs.length; i++) {
      mapFiltersInputs[i].disabled = true;
    }

    mapFilters.removeEventListener(`change`, filterChangeHandler);
  };
})();
