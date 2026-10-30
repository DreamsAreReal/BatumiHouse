
document.getElementById('year').textContent=new Date().getFullYear();
const filters=document.querySelectorAll('.filter');
const leadForm=document.getElementById('leadForm');
if(leadForm){const leadRentType=document.getElementById('rentType');const showStayOptions=()=>{document.getElementById('leadStayOptions').hidden=leadRentType.value!=='Посуточная аренда';};leadRentType.addEventListener('change',showStayOptions);showStayOptions();const leadValidation=BatumiBooking.setup({form:leadForm,checkin:document.getElementById('moveDate'),guests:document.getElementById('leadGuests'),contactType:document.getElementById('leadContactType'),contact:document.getElementById('leadContact')});leadForm.addEventListener('submit',async function(e){
 e.preventDefault();if(!leadValidation.validate())return;
 const i18n=window.BatumiI18n, lang=i18n?.language||'ru', t=text=>i18n?.t(text)||text;
 const val=id=>document.getElementById(id).value.trim();
 const labels={ru:['Здравствуйте, Алексей! Ищу квартиру в Батуми.','Тип аренды','Бюджет','Дата заезда','Срок / ночей','Район и пожелания','не указано'],en:['Hello Alexey! I am looking for an apartment in Batumi.','Rental type','Budget','Move-in date','Duration / nights','Area and preferences','not provided'],ka:['გამარჯობა, ალექსეი! ვეძებ ბინას ბათუმში.','ქირის ტიპი','ბიუჯეტი','შესვლის თარიღი','ვადა / ღამეების რაოდენობა','უბანი და სურვილები','მითითებული არ არის']}[lang];
 const fields=[t(val('rentType')),t(val('budget')),val('moveDate'),val('duration'),val('area')];
 const guestLabel={ru:'Количество гостей',en:'Number of guests',ka:'სტუმრების რაოდენობა'}[lang];
 const contactLabel=val('leadContactType')==='telegram'?'Telegram':t('Телефон');
 const daily=document.getElementById('rentType').value==='Посуточная аренда';
 const stay=daily?[t('Стандартный заезд: с 15:00; выезд: до 12:00.'),...(document.getElementById('leadEarlyCheckin').checked?[t('Запрос: ранний заезд (по согласованию).')]:[]),...(document.getElementById('leadLateCheckout').checked?[t('Запрос: поздний выезд (по согласованию).')]:[])]:[];
 const message=[labels[0],...stay,guestLabel+': '+val('leadGuests'),contactLabel+': '+val('leadContact'),...fields.map((value,index)=>labels[index+1]+': '+(value||labels[6]))].join('\n');
 window.BatumiAttribution?.track('lead_form_ready',{rental:daily?'daily':'long'});
 const trackedMessage=message+'\nИсточник заявки: '+(window.BatumiAttribution?.getSource()||'direct');
 await BatumiLeads.submit(leadForm,{property:'general',rental:daily?'daily':'long',checkin:val('moveDate'),checkout:'',guests:Number(val('leadGuests')),contactType:val('leadContactType'),contact:val('leadContact'),budget:val('budget'),duration:val('duration'),wishes:val('area'),earlyCheckin:daily&&document.getElementById('leadEarlyCheckin').checked,lateCheckout:daily&&document.getElementById('leadLateCheckout').checked},trackedMessage);
});}
document.querySelectorAll('.card-img img,.hero-photo img,.about-photo img').forEach(img=>{img.addEventListener('error',()=>{img.style.display='none';});});


