'use strict';

(function () {

  const addIdToSourceData = (array) => {
    return array.map((item, index) => {
      item.offer.id = index;

      return item;
    });
  };

  let getData = (data) => {
    window.offers = addIdToSourceData(data);
  };

  window.load(getData);
})();
