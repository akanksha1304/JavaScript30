let countdown;
const timeLeftElem = document.querySelector('.display__time-left');
const endTimeElem = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(secs) {

    // clear any existing timer (if any) so that 
    // not more than one timers are working at the same time
    clearInterval(countdown);

    const now = Date.now();
    const then = now + 1000*secs;
    // console.log({now, then});

    displayEndTime(then);
    displayTimeLeft(secs);
    

    // assigning it to a variable countdown
    // so that we can clear (hence stop) this interval when secsLeft goes 0
    countdown = setInterval(() => {
        const secsLeft = Math.round((then - Date.now())/1000);

        if (secsLeft<0) {
            clearInterval(countdown);
            return;
        }
        displayTimeLeft(secsLeft);
    }, 1000);
}

function displayTimeLeft(secs) {
    // console.log(secs);
    const hours = Math.floor(secs/3600);
    let remaining = secs%3600;
    const mins = Math.floor(remaining/60);
    remaining = remaining%60;
    // console.log(`${hours}:${mins}:${remaining}`);
    const displayTime = `${mins}:${remaining<10 ? '0'+remaining.toString() : remaining}`;

    // // The below one might work but not appropriate because 
    // // displayTime is just a string, not html
    // timeLeftElem.innerHTML = displayTime;

    timeLeftElem.textContent = displayTime;

    // displays the browser icon to be time left
    document.title = displayTime;
}

function displayEndTime(timestamp) {
    const endTime = new Date(timestamp);
    const hours = endTime.getHours();
    const mins = endTime.getMinutes();
    const secs = endTime.getSeconds();

    // convert 24 hour format to 12 hour format
    // also, add trailing '0' to minutes if less than 10
    const displayEndTime = `Be back at: ${hours>12 ? hours-12:hours}:${mins<10 ? '0':''}${mins} ${hours>12 ? 'PM' : 'AM'}`;
    // console.log(displayEndTime);
    endTimeElem.textContent = displayEndTime;
}

function startTimer(e) {
    // console.log(this,e);
    const secs = parseInt(this.dataset.time);
    timer(secs);
}

buttons.forEach(button => button.addEventListener('click', startTimer));

// we can select a element using name attribute
// here selecting form element using document.customerForm
// 'customForm' is the name of the form element
// we could have selected input element named 'minutes' inside form element using:
// document.customForm.minutes
document.customForm.addEventListener('submit', function (e) {
    // console.log(e);
    e.preventDefault(); // this is prevent page from reloading on submit
    
    // this.minutes will give the input element with name 'minutes'
    // declared in side this form
    const mins = this.minutes.value;
    
    const secs = parseInt(mins)*60;
    // console.log(mins,secs); 
    
    timer(secs);

    // clear the value in the input
    this.reset();
});