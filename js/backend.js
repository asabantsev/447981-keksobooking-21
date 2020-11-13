'use strict';

const ServerURL = {
  LOAD: `https://21.javascript.pages.academy/keksobooking/data`,
  UPLOAD: `https://21.javascript.pages.academy/keksobooking`
};

const TIMEOUT_IN_MS = 10000;

const StatusCode = {
  OK: 200
};

const createXhr = (method, url, successHandler, errorHandler) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

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

  xhr.open(method, url);
  return xhr;
};

const load = (successHandler, errorHandler) => createXhr(`GET`, ServerURL.LOAD, successHandler, errorHandler).send();

const upload = (data, successHandler, errorHandler) => createXhr(`POST`, ServerURL.UPLOAD, successHandler, errorHandler).send(data);

window.backend = {
  load,
  upload
};
