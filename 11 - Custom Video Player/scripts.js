// get elements
const player = document.querySelector('.player');
const video = player.querySelector('video');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
let update = false;

// functions
function togglePlay() {
    if (video.paused) {
        video.play();
    }
    else {
        video.pause();
    }
}

function updateButton(e) {
    // console.log(e,this.paused);
    if (this.paused) {
        toggle.textContent = '❚ ❚';
    }
    else {
        toggle.textContent = '►';
    }
}

function skip(e) {
    // console.log(e, this, this.dataset, this.dataset);
    video.currentTime += parseFloat(this.dataset.skip);
}

function updateRange(e) {
    // console.log(e.type);
    // console.log(this.name, this.value, update);
    if (e.type==='change' || (e.type==='mousemove' && update===true)) {
        video[this.name] = this.value;
    }
}

function updateProgress(e) {
    const progress = (video.currentTime/video.duration)*100;
    // console.log(progress);
    progressBar.style.flexBasis = `${progress}%`;
}

function scrub(e) {
    // console.log(e.type,update,progress.offsetWidth,e.offsetX);
    if (e.type==='click' || (e.type=='mousemove' && update===true)) {
        const scrubTime = (e.offsetX/progress.offsetWidth)*video.duration;
        // // this also works
        // video['currentTime'] = scrubTime;
        
        // console.log(e.offsetX,progress.offsetWidth,video.duration,scrubTime);
        video.currentTime = scrubTime;
    }
}

// hook up event listeners
// toggle play
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause',updateButton);
toggle.addEventListener('click', togglePlay);

// skipping
skipButtons.forEach(skipButton => skipButton.addEventListener('click', skip));

// ranges
ranges.forEach(range => range.addEventListener('change', updateRange));
ranges.forEach(range => range.addEventListener('mousemove', updateRange));
ranges.forEach(range => range.addEventListener('mouseup', (e) => {
    // console.group('up');
    update = false;
}));
ranges.forEach(range => range.addEventListener('mousedown', (e) => {
    // console.log('down');
    update = true;
}));

// progress
video.addEventListener('timeupdate', updateProgress);
progress.addEventListener('click', scrub);

progress.addEventListener('mousemove', scrub);
// // another way to do it:
// progress.addEventListener('mousemove', (e) => update && scrub(e));

progress.addEventListener('mouseup', () => {
    update = false;
});
progress.addEventListener('mousedown', () => {
    update = true;
});