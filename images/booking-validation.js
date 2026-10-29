(() => {
  'use strict';
  const messages = {
    past: {ru:'Выберите сегодня или будущую дату заезда.',en:'Choose today or a future check-in date.',ka:'აირჩიეთ დღევანდელი ან მომავალი შესვლის თარიღი.'},
    end: {ru:'Дата выезда должна быть позже даты заезда.',en:'Check-out must be after check-in.',ka:'გასვლის თარიღი შესვლის თარიღზე გვიან უნდა იყოს.'},
    guests: {ru:'Укажите количество гостей: целое число от 1.',en:'Enter the number of guests: a whole number of at least 1.',ka:'მიუთითეთ სტუმრების რაოდენობა: მთელი რიცხვი, მინიმუმ 1.'},
    phone: {ru:'Введите телефон с кодом страны, например +995 555 123 456.',en:'Enter a phone number with country code, e.g. +995 555 123 456.',ka:'შეიყვანეთ ტელეფონი ქვეყნის კოდით, მაგალითად +995 555 123 456.'},
    telegram: {ru:'Укажите Telegram: @username или ссылку t.me/username (5–32 символа в имени).',en:'Enter Telegram: @username or t.me/username (5–32 characters in the username).',ka:'მიუთითეთ Telegram: @username ან t.me/username (სახელი 5–32 სიმბოლო).'}
  };
  function today(now = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tbilisi',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
    const value = type => parts.find(part=>part.type===type).value;
    return `${value('year')}-${value('month')}-${value('day')}`;
  }
  function addDays(value,days) {
    const date = new Date(value+'T00:00:00Z');
    date.setUTCDate(date.getUTCDate()+days);
    return date.toISOString().slice(0,10);
  }
  function setup({form,checkin,checkout,guests,contactType,contact}) {
    const message = key => messages[key][window.BatumiI18n?.language||'ru'];
    function refresh() {
      const minimum=today();
      checkin.min=minimum;
      checkin.setCustomValidity(checkin.value && checkin.value<minimum ? message('past') : '');
      if(checkout) {
        checkout.min=addDays(checkin.value && checkin.value>=minimum ? checkin.value : minimum,1);
        checkout.setCustomValidity(checkout.value && checkout.value<checkout.min ? message('end') : '');
      }
      const count=Number(guests.value);
      guests.setCustomValidity(guests.value && (!Number.isSafeInteger(count)||count<1) ? message('guests') : '');
      const value=contact.value.trim();
      const valid=contactType.value==='telegram'
        ? /^(?:(?:https?:\/\/)?t\.me\/|@)?[A-Za-z][A-Za-z0-9_]{4,31}$/.test(value)
        : /^\+?[\d\s().-]+$/.test(value) && value.replace(/\D/g,'').length>=7 && value.replace(/\D/g,'').length<=15;
      contact.setCustomValidity(!valid ? message(contactType.value) : '');
    }
    function configureContact() {
      const telegram=contactType.value==='telegram';
      contact.type=telegram?'text':'tel';
      contact.inputMode=telegram?'text':'tel';
      contact.autocomplete=telegram?'off':'tel';
      contact.placeholder=telegram?'@username':'+995 555 123 456';
      refresh();
    }
    function validate() { refresh();return form.reportValidity(); }
    // Refresh before native form validation, including after a midnight rollover.
    form.addEventListener('click',event=>{if(event.target.closest('[type="submit"]'))refresh();},true);
    form.addEventListener('keydown',event=>{if(event.key==='Enter')refresh();},true);
    form.addEventListener('input',refresh);
    form.addEventListener('change',refresh);
    form.addEventListener('focusin',refresh);
    contactType.addEventListener('change',configureContact);
    document.addEventListener('visibilitychange',refresh);
    document.addEventListener('batumi:language',refresh);
    configureContact();
    return {refresh,validate};
  }
  window.BatumiBooking={today,addDays,setup};
})();
