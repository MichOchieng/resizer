const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

function loadImage(e) {
  const file = e.target.files[0];

  if (!isImage(file)) {
    alert('Select an image');
    return;
  }

  // Get OG dimensions
  const img =  new Image();
  img.src = URL.createObjectURL(file);
  img.onload = function () {
    widthInput.value  = this.width;
    heightInput.value = this.height;
  };

  form.style.display = 'block';
  filename.innerText = file.name;
}

function isImage(file) {
  const acceptedImageTypes = ['image/gif','image/png','image/jpeg'];
  return file && acceptedImageTypes.includes(file['type']);
}

img.addEventListener('change',loadImage);