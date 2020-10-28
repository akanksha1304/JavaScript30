const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video:true, audio:false}) // thsi returns promise
        .then(localMediaStream => {
            console.log(localMediaStream);
            // set the src attribute of the video element to the video URL
            // Deprecated: video.src = window.URL.createObjectURL(localMediaStream);

            video.srcObject = localMediaStream;
            video.play();
        }) // if the app is denied access to the webcam then catch that error
        .catch(err => {
            console.error(`Oh no! ${err}`);
        });
}

function putToCanvas() {
    const [width, height] = [video.videoWidth, video.videoHeight];
    console.log(width,height,canvas.width, canvas.height);
    [canvas.width, canvas.height] = [width,height];
    console.log(canvas.width,canvas.height);

    // so that we will have access to the interval, and we can user clearInterval to stop it
    return setInterval(() => {
        // draws the image from position 0,0 (top-left) to width,height (bottom-right)
        ctx.drawImage(video, 0, 0, width, height);

        // get all the pixels of canvas
        let pixels = ctx.getImageData(0, 0, width, height);

        // pixels = putEffect(pixels);
        // pixels = rgbSplit(pixels);

        // ghosting image
        // ctx.globalAlpha = 0.1;

        pixels = greenScreen(pixels);
        // console.log(levels);

        // console.log(pixels);

        // put the modified pixels in canvas
        ctx.putImageData(pixels, 0, 0);
    }, 16); // will draw the image every 16 ms, hence looks like video (succession of images in a short time)

} 

function putEffect(pixels) {
    // due to below modifications, some red/green/blue values might exceed 255 but that's okay
    for(let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i] -= 100; // red value for the pixel
        pixels.data[i+1] -= 50; // green value for the pixel
        pixels.data[i+2] *= 0.5; // blue value for the pixel
        // we don't change pixels[i+3] which denotes the alpha value of the pixel
    }

    return pixels;
}

function rgbSplit(pixels) {
    // due to below modifications, some red/green/blue values might exceed 255 but that's okay
    for(let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i-150] = pixels.data[i]; // red value for the pixel
        pixels.data[i+100] = pixels.data[i+1]; // green value for the pixel
        pixels.data[i-550] *= pixels.data[i+2]; // blue value for the pixel
    }

    return pixels;
}

function greenScreen(pixels) {
    const levels = {};

    elems = document.querySelectorAll('input');
    elems.forEach(elem => {
        levels[elem.name] = elem.value;
    });
    // console.log(levels);
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        // setting the alpha value of the pixel to 0 will turn that pixel totally transparent
        pixels.data[i + 3] = 0; 
      }
    }
  
    return pixels;
  }

function takePhoto() {
    // playing the taking photo sound 
    snap.currentTime = 0;
    snap.play();

    // take photo from canvas
    const pic = canvas.toDataURL('image/jpeg');

    // creates a link element
    const link = document.createElement('a');
    link.href = pic;
    // link.textContent = 'Download Pic';
    link.innerHTML = `<img src="${pic}" alt='handsome pic'>`;
    link.setAttribute('download', 'handsome');

    // insert the link element before strip's (strip is a div element) first child
    strip.insertBefore(link, strip.firstChild);

}

getVideo();

// when video is there (in this case video.play() called in getVideo()), then call putToCanvas method
// putToCanvas will start injecting video image to the canvas every 16 ms,
// so that it looks like a video in the canvas
video.addEventListener('canplay', putToCanvas);