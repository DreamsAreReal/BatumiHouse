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
  function calendar(input, refresh) {
    const button=document.createElement('button'),panel=document.createElement('div'),error=document.createElement('p');
    const label=document.querySelector(`label[for="${input.id}"]`);
    const labelId=(label?.id || input.id+'Label');if(label)label.id=labelId;
    input.type='hidden';
    button.type='button';button.className='booking-date-button';button.id=input.id+'Picker';
    button.setAttribute('aria-labelledby',labelId+' '+button.id);button.setAttribute('aria-expanded','false');
    panel.className='booking-calendar';panel.id=input.id+'Calendar';panel.hidden=true;panel.setAttribute('role','group');
    button.setAttribute('aria-controls',panel.id);
    error.className='booking-date-error';error.id=input.id+'Error';error.setAttribute('aria-live','polite');error.hidden=true;
    button.setAttribute('aria-describedby',error.id);
    input.after(button,panel,error);
    let month='';
    const lang=()=>window.BatumiI18n?.language||'ru';
    const locale=()=>({ru:'ru-RU',en:'en-GB',ka:'ka-GE'}[lang()]);
    const text=(ru,en,ka)=>({ru,en,ka}[lang()]);
    function update() {
      button.textContent=input.value?new Intl.DateTimeFormat(locale(),{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(input.value+'T12:00:00Z')):text('Выберите дату','Choose a date','აირჩიეთ თარიღი');

    }
    function close() {panel.hidden=true;button.setAttribute('aria-expanded','false');}
    function render() {
      const min=input.min||today();if(month<min.slice(0,7))month=min.slice(0,7);
      panel.replaceChildren();
      const head=document.createElement('div');head.className='calendar-heading';
      const previous=document.createElement('button'),next=document.createElement('button'),title=document.createElement('strong');
      previous.type=next.type='button';previous.textContent='‹';next.textContent='›';
      previous.setAttribute('aria-label',text('Предыдущий месяц','Previous month','წინა თვე'));next.setAttribute('aria-label',text('Следующий месяц','Next month','შემდეგი თვე'));
      previous.disabled=month<=min.slice(0,7);
      title.textContent=new Intl.DateTimeFormat(locale(),{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(month+'-01T12:00:00Z'));
      const move=delta=>{const d=new Date(month+'-01T12:00:00Z');d.setUTCMonth(d.getUTCMonth()+delta);month=d.toISOString().slice(0,7);render();};
      previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));head.append(previous,title,next);panel.append(head);
      const grid=document.createElement('div');grid.className='calendar-days';
      const weekdays={ru:['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],en:['Mo','Tu','We','Th','Fr','Sa','Su'],ka:['ორ','სა','ოთ','ხუ','პა','შა','კვ']}[lang()];
      weekdays.forEach(name=>{const el=document.createElement('span');el.textContent=name;el.className='calendar-weekday';grid.append(el);});
      const first=new Date(month+'-01T12:00:00Z');const offset=(first.getUTCDay()+6)%7;
      for(let i=0;i<offset;i++)grid.append(document.createElement('span'));
      const last=new Date(Date.UTC(first.getUTCFullYear(),first.getUTCMonth()+1,0)).getUTCDate();
      for(let day=1;day<=last;day++) {
        const date=month+'-'+String(day).padStart(2,'0'),item=document.createElement('button');item.type='button';item.textContent=day;item.dataset.date=date;
        item.disabled=date<min;item.setAttribute('aria-label',new Intl.DateTimeFormat(locale(),{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z')));
        item.setAttribute('aria-pressed',String(date===input.value));
        if(date===today())item.classList.add('calendar-today');
        item.addEventListener('click',()=>{refresh();if(date<(input.min||today())){render();return;}input.value=date;error.hidden=true;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));close();update();button.focus();});grid.append(item);
      }
      panel.append(grid);
    }
    button.addEventListener('click',()=>{refresh();if(!panel.hidden){close();return;}month=(input.value||input.min||today()).slice(0,7);panel.hidden=false;button.setAttribute('aria-expanded','true');render();});
    panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();close();button.focus();}});
    document.addEventListener('click',event=>{if(!panel.contains(event.target)&&event.target!==button)close();});
    document.addEventListener('batumi:language',update);input.addEventListener('change',update);
    update();
    return {update,fail(message){error.textContent=message;error.hidden=false;button.setAttribute('aria-invalid','true');},focus(){button.focus();},clear(){error.hidden=true;button.removeAttribute('aria-invalid');}};
  }
  function setup({form,checkin,checkout,guests,contactType,contact}) {
    let startPicker,endPicker;
    const message = key => messages[key][window.BatumiI18n?.language||'ru'];
    function refresh() {
      const minimum=today();
      checkin.min=minimum;
      if(checkin.value&&checkin.value<minimum){checkin.value='';startPicker?.fail(message('past'));}
      startPicker?.update();
      checkin.setCustomValidity(checkin.value && checkin.value<minimum ? message('past') : '');
      if(checkout) {
        checkout.min=addDays(checkin.value && checkin.value>=minimum ? checkin.value : minimum,1);
        if(checkout.value&&checkout.value<checkout.min){checkout.value='';endPicker?.fail(message('end'));}
        endPicker?.update();
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
    function validate() {
      refresh();
      if(!checkin.value){startPicker.fail(message('past'));startPicker.focus();return false;}
      if(checkout&&!checkout.value){endPicker.fail(message('end'));endPicker.focus();return false;}
      return form.reportValidity();
    }
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
    startPicker=calendar(checkin,refresh);
    if(checkout)endPicker=calendar(checkout,refresh);
    refresh();
    return {refresh,validate};
  }
  window.BatumiBooking={today,addDays,setup};
})();
