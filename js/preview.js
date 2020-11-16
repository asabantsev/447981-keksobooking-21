'use strict';

const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];

const avatarChooser = document.querySelector(`.ad-form__field input[type=file]`);
const photoChooser = document.querySelector(`.ad-form__upload input[type=file]`);
const avatarPreview = document.querySelector(`.ad-form-header__preview img`);
const photoPreview = document.querySelector(`.ad-form__photo`);

const getSrc = (chooser, elemSrc) => {
  const file = chooser.files[0];

  const matches = FILE_TYPES.some((type) => {
    return file.type.endsWith(type);
  });

  if (matches) {
    const reader = new FileReader();


    reader.addEventListener(`load`, () => {
      elemSrc.src = reader.result;
    });

    reader.readAsDataURL(file);
  }
};

const avatarChangeHandler = () => {
  getSrc(avatarChooser, avatarPreview);
};

const previewChangeHandler = () => {
  const img = `<img alt="Фото объекта" width="70" height="70">`;

  photoPreview.innerHTML = img;

  const imgPreview = photoPreview.querySelector(`img`);

  getSrc(photoChooser, imgPreview);
};

avatarChooser.addEventListener(`change`, avatarChangeHandler);
photoChooser.addEventListener(`change`, previewChangeHandler);
