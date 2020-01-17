// avatar.js
'use strict';

(function() {
  const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  const DEFAULT_AVATAR = 'img/muffin.png';

  const ImageParams = {
    WIDTH: '70px',
    HEIGHT: '70px',
    BORDER_RADIUS: '5px'
  };

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
    img.style.width = ImageParams.WIDTH;
    img.style.height = ImageParams.HEIGHT;
    img.style.borderRadius = ImageParams.BORDER_RADIUS;
    div.appendChild(img);
    photosPreview.appendChild(div);
  };

  const removePhotos = () => {
    addAvatar(DEFAULT_AVATAR);
    const photos = document.querySelectorAll('.form__photo');
    photos.forEach(photo => photo.remove());
  };

  const loadFile = (target, fn) => {
    const files = target.files;
    [...files].forEach(file => {
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
    );

  };

  const onAvatarChange = (evt) => {
    loadFile(evt.target, addAvatar);
  };

  const onPhotosChange = (evt) => {
    loadFile(evt.target, addPhotos);
  };

  const dropZones = document.querySelectorAll('.drop-zone');

  function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    [...dropZones].forEach(dropZone => dropZone.addEventListener(eventName, preventDefaults, false))
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    [...dropZones].forEach(dropZone => dropZone.addEventListener(eventName, highlight, false))
  });

  ['dragleave', 'drop'].forEach(eventName => {
    [...dropZones].forEach(dropZone => dropZone.addEventListener(eventName, unhighlight, false))
  });

  function highlight(e) {
    e.target.classList.add('highlight');
  }

  function unhighlight(e) {
    e.target.classList.remove('highlight');
  }

  [...dropZones].forEach(dropZone => dropZone.addEventListener('drop', handleDrop, false));

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const fn = (e.target.htmlFor === 'avatar') ? addAvatar: addPhotos;

    loadFile(dt, fn);
  }

  const activateChoosers = () => {
    avatarChooser.addEventListener('change', onAvatarChange);
    photosChooser.addEventListener('change', onPhotosChange);
  };
  const deactivateChoosers = () => {
    avatarChooser.removeEventListener('change', onAvatarChange);
    photosChooser.removeEventListener('change', onPhotosChange);
  };

  window.avatar = {
    removePhotos,
    activateChoosers,
    deactivateChoosers
  };

})();
