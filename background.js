function setRandomBackground() {
    const numberOfImages = 5; 
    const imagePath = "images/background/";
    const randomImageNumber = Math.floor(Math.random() * numberOfImages) + 1;
    const randomImage = imagePath + "image" + randomImageNumber + ".jpg"; 
  
    document.body.style.backgroundImage = `url(${randomImage})`;
  }
  
  window.onload = setRandomBackground;
//   body {
//     height: 100%;
//     font-family: 'Roboto', sans-serif;
//     display: flex;
//     flex-direction: column;
//     background-size: cover;
//     background-repeat: no-repeat;
//     background-position: center;
//   }
  