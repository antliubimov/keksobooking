// avatar.js
'use strict';

(function() {
  const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  const DEFAULT_AVATAR = 'img/muffin.png';

  const avatarChooser = document.querySelector('#avatar');
  const photosChooser = document.querySelector('#images');
  const avatarPreview = document.querySelector('.notice__preview img');
  const photosPreview = document.querySelector('.form__photo-container');

  const addAvatar = (src) => {
    avatarPreview.src = src;
  };

  const addPhotos = (src) => {
    const div = document.createElement('div');
    div.classList.add('form__photo');
    const img = document.createElement('img');
    img.src = src;
    photosPreview.appendChild(div);
    div.appendChild(img);
  };

  const onAvatarChange = (evt) => {
    loadFile(evt.target, addAvatar);
  };

  const onPhotosChange = (evt) => {
    loadFile(evt.target, addPhotos);
  };

  const activateChoosers = () => {
    avatarChooser.addEventListener('change', onAvatarChange);
    photosChooser.addEventListener('change', onPhotosChange);
  };
  const deactivateChoosers = () => {
    avatarChooser.removeEventListener('change', onAvatarChange);
    photosChooser.removeEventListener('change', onPhotosChange);
  };

  const loadFile = (target, fn) => {
    const file = target.files[0];
    const fileName = file.name.toLowerCase();

    const matches = FILE_TYPES.some(it => fileName.endsWith(it));

    if (matches) {
      const reader = new FileReader();

      reader.addEventListener('load', function(evt) {
        fn(evt.target.result);
      });

      reader.readAsDataURL(file);
    }
  }

  activateChoosers();
})();
