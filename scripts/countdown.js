function construirTimerHTML() {

  return divTimer = `
    <div class="today">A data Chegou!</div>
    <section class="countdown">
      <div class="block">
        <p class="day digit">00</p>
        <p class="text">Dia(s)</p> 
      </div>
      <div class="block">
        <p class="hour digit">00</p>
        <p class="text">Hora(s)</p> 
      </div>
      <div class="block">
        <p class="minute digit">00</p>
        <p class="text">Min(s)</p> 
      </div>
      <div class="block">
        <p class="second digit">00</p>
        <p class="text">Seg(s)</p> 
      </div>
    </section>
  `;
}

function contagemRegressiva(evento) {

  const eventoDataTimer = evento.data.split("-");
  const ano = eventoDataTimer[0];
  const mes = eventoDataTimer[1];
  const dia = eventoDataTimer[2];
  const finalDate = new Date(ano, mes - 1, dia).getTime();
  
  const eventoElement = document.querySelector(`[data-id="${evento.id}"]`);
  const countdownInput = eventoElement.querySelector('.countdown');
  const todayInput = eventoElement.querySelector('.today');
  const dayInput = eventoElement.querySelector('.day');
  const hourInput = eventoElement.querySelector('.hour');
  const minuteInput = eventoElement.querySelector('.minute');
  const secondInput = eventoElement.querySelector('.second');

  countdown = setInterval(function () {
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
      todayInput.classList.remove('hide');
      countdownInput.classList.add('hide');
    } else {
      todayInput.classList.add('hide');
      countdownInput.classList.remove('hide');
    }
  
  },1000);

}