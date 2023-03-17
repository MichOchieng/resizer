const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

function loadImage(e) {
  const file = e.target.files[0];

  if (!isImage(file)) {
    errAlert('Select an image!');
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
  outputPath.innerText = path.join(os.homedir(),'resizer')
}

function sendImage(e) {
  e.preventDefault();

  const width = widthInput.value;
  const height =  heightInput.value;
  const imgPath = img.files[0].path;

  if (!img.files[0]) {
    errAlert('Please upload and image');
    return;
  }

  if (width == 0 || height == 0) {
    errAlert('Please fill in a height and width!');
  }

  // Send to main w IPC
  ipcRenderer.send('image:resize', {imgPath,width,height})

}

ipcRenderer.on('image:done', () => {
  okAlert('Image Resized!')
})

function isImage(file) {
  const acceptedImageTypes = ['image/gif','image/png','image/jpeg'];
  return file && acceptedImageTypes.includes(file['type']);
}

function errAlert(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background:'red',
      color:'white',
      textAlign: 'center'
    }
  })
}

function okAlert(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background:'green',
      color:'white',
      textAlign: 'center'
    }
  })
}

form.addEventListener('change',sendImage);
img.addEventListener('change',loadImage);