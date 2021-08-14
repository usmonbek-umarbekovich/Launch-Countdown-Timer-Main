const inputForm = document.querySelector('.input-form');
const inputOverlay = document.querySelector('.input-overlay');
const btnOpenForm = document.querySelector('.open-form');
const btnCloseForm = document.querySelector('.close-form');
const form = inputForm.querySelector('form');

class Timer {
  #time;
  #dayCount;
  #hourCount;
  #minuteCount;
  #secondCount;
  #dayElement;
  #hourElement;
  #minuteElement;
  #secondElement;

  constructor() {
    btnOpenForm.addEventListener('click', this.#openForm);
    btnCloseForm.addEventListener('click', this.#closeForm);
    inputOverlay.addEventListener('click', this.#closeForm);
    inputForm.addEventListener('submit', this.#startTimer.bind(this));
  }

  #openForm() {
    inputOverlay.classList.remove('hidden');
    inputForm.classList.remove('hidden');
  }
  #closeForm() {
    inputOverlay.classList.add('hidden');
    inputForm.classList.add('hidden');
  }

  #startTimer(e) {
    e.preventDefault();
    this.#getInputTime();
    this.#closeForm();

    this.#initializeElements();
    setInterval(this.#update.bind(this), 1000);
  }

  #getInputTime() {
    const data = new FormData(form);
    this.#time =
      +data.get('days') * (24 * 60 * 60) +
      +data.get('hours') * (60 * 60) +
      +data.get('minutes') * 60 +
      +data.get('seconds');
  }

  #initializeElements() {
    this.#dayElement = this.#getElementObject('days');
    this.#hourElement = this.#getElementObject('hours');
    this.#minuteElement = this.#getElementObject('minutes');
    this.#secondElement = this.#getElementObject('seconds');
  }

  #getElementObject(element) {
    const container = document.querySelector(`.${element}`);
    return {
      mainTop: container.querySelector('.main-top'),
      mainBottom: container.querySelector('.main-bottom'),
      mainTopTime: container.querySelector(`.main-top-${element}`),
      mainBottomTime: container.querySelector(`.main-bottom-${element}`),
      flipTop: container.querySelector('.flip-top'),
      flipBottom: container.querySelector('.flip-bottom'),
      flipTopTime: container.querySelector(`.flip-top-${element}`),
      flipBottomTime: container.querySelector(`.flip-bottom-${element}`),
    };
  }

  #update() {
    // Remaining time
    const day = Math.floor(this.#time / (24 * 60 * 60));
    const hour = Math.floor((this.#time / (60 * 60)) % 24);
    const minute = Math.floor((this.#time / 60) % 60);
    const second = Math.floor(this.#time % 60);

    // update seconds
    if (second >= 0) {
      const timeFormatted = second.toString().padStart(2, '0');
      this.#flipCard(this.#secondElement, timeFormatted);
      this.#secondCount = second;
    }

    // update minutes
    if (minute >= 0 && minute !== this.#minuteCount) {
      const timeFormatted = minute.toString().padStart(2, '0');
      this.#flipCard(this.#minuteElement, timeFormatted);
      this.#minuteCount = minute;
    }

    // update hours
    if (hour >= 0 && hour !== this.#hourCount) {
      const timeFormatted = hour.toString().padStart(2, '0');
      this.#flipCard(this.#hourElement, timeFormatted);
      this.#hourCount = hour;
    }

    // update days
    if (day >= 0 && day !== this.#dayCount) {
      const timeFormatted = day.toString().padStart(2, '0');
      this.#flipCard(this.#dayElement, timeFormatted);
      this.#dayCount = day;
    }

    this.#time--;
  }

  #flipCard(element, time) {
    element.mainTopTime.textContent = time;
    element.flipTop.style.animation = 'flip-to-bottom 0.5s linear';
    element.flipBottom.style.animation = 'flip-to-top 0.5s linear';

    const resetTop = function () {
      element.flipTop.style.animation = '';
      element.flipTop.removeEventListener('animationend', resetTop);
      element.flipTopTime.textContent = time;
    };

    const resetBottom = function () {
      element.flipBottom.style.animation = '';
      element.flipBottom.removeEventListener('animationend', resetBottom);
      element.mainBottomTime.textContent = time;
    };

    element.flipTop.addEventListener('animationend', resetTop);
    element.flipBottom.addEventListener('animationend', resetBottom);

    // execute this function after animations finished
    setTimeout(function () {
      element.flipBottomTime.textContent = time;
    }, 0);
  }
}

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeForm();
});

new Timer();
