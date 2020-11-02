'use strict';

(function () {
  const URL = `https://21.javascript.pages.academy/keksobooking`;

  const TIMEOUT_IN_MS = 10000;

  const StatusCode = {
    OK: 200
  };

  window.upload = (data, successHandler, errorHandler) => {
    let xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.open(`POST`, URL);

    xhr.addEventListener(`load`, () => {
      if (xhr.status === StatusCode.OK) {
        successHandler(xhr.response);
      } else {
        errorHandler(`Статус ответа: ${xhr.status} - ${xhr.statusText}`);
      }
    });

    xhr.addEventListener(`error`, function () {
      errorHandler(`Произошла ошибка соединения`);
    });
    xhr.addEventListener(`timeout`, function () {
      errorHandler(`Запрос не успел выполниться за ${xhr.timeout} мс`);
    });

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.send(data);
  };
})();
