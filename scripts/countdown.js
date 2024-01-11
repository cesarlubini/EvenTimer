const dia = 10;
const mes = 12;
const ano = 2024;

const finalDate = new Date(ano, mes - 1, dia).getTime();

const $ = document.querySelector.bind(document);
const dayInput = $('.day');
const hourInput = $('.hour');
const minuteInput = $('.minute');
const secondInput = $('.second');

const countdownInput = $('.countdown');
const todayInput = $('.today');

let countdown = setInterval(function () {
    const now = new Date().getTime();
  
    const diference = finalDate - now;
    
    let days = Math.floor(diference / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diference % (1000 * 60)) / 1000);
  
    dayInput.innerHTML = days;
    hourInput.innerHTML = hours;
    minuteInput.innerHTML = minutes;
    secondInput.innerHTML = seconds;

    if (diference < 0) {
      clearInterval(countdown);
      todayInput.classList.remove('esconder');
      countdownInput.classList.add('esconder');
    }

  },1000);
