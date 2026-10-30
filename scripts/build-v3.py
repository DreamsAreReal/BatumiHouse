"""Build the existing public catalogue into static pages; never touches D1."""
from pathlib import Path
import base64, html, json, re, shutil, sys

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'dist'
BASE = 'https://batumihouse.alexxstalkerxx.workers.dev'
e = lambda v: html.escape(str(v), quote=True)
items = json.loads((ROOT/'content/listings.json').read_text())

def icon(name):
    return f'<span class="icon i-{name}" aria-hidden="true"></span>'

def brand():
    return f'<a class="brand" href="/#top" aria-label="Batumi House — главная">{icon("building-skyscraper")}<span>Batumi House<small>НЕДВИЖИМОСТЬ В БАТУМИ</small></span></a>'

def header():
    return f'''<header class="site-header"><div class="wrap nav">{brand()}
    <nav class="navlinks" aria-label="Основная навигация"><a href="/#daily">Аренда посуточно</a><a href="/#apartments">Долгосрочно</a><a href="/#sale">Продажа</a><a href="/#benefits">О нас</a><a href="/#request">Контакты</a></nav>
    <div class="header-actions"><a class="icon-button header-favorite" href="/#favorites" aria-label="Избранное">{icon('heart')}</a><a class="icon-button telegram" href="https://t.me/alexeyrieltor97" target="_blank" rel="noopener" aria-label="Написать в Telegram">{icon('brand-telegram')}</a><button id="langToggle" class="lang-toggle" type="button">RU</button><a class="btn gold header-request" href="/#request">Оставить заявку</a><button class="icon-button menu-toggle" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="mobileMenu">{icon('menu-2')}</button></div></div>
    <nav id="mobileMenu" class="mobile-menu" aria-label="Мобильное меню" hidden><a href="/#daily">Посуточная аренда</a><a href="/#apartments">Долгосрочная аренда</a><a href="/#sale">Продажа квартир</a><a href="/#benefits">О Batumi House</a><a href="/#request">Оставить заявку</a></nav></header>'''

def footer():
    return '''<footer class="site-footer"><div class="wrap footer-inner"><div><strong>Batumi House</strong><p>Подбор недвижимости в Батуми · Алексей</p></div><nav aria-label="Контакты"><a href="https://t.me/alexeyrieltor97" target="_blank" rel="noopener">Telegram ↗</a><a href="/#request">Оставить заявку</a><a href="https://unsplash.com/photos/RCYC9Fa_wb0" target="_blank" rel="noopener">Панорама: Max / Unsplash</a></nav><small>Доступность, условия и стоимость подтверждаем перед бронированием.</small></div></footer>'''

def bottom():
    return '<nav class="bottom-nav" aria-label="Быстрая навигация">'+''.join(f'<a href="{url}">{icon(ic)}<span>{label}</span></a>' for url,ic,label in [('/#top','home','Главная'),('/#search','search','Поиск'),('/#favorites','heart','Избранное'),('/#request','message-circle','Заявка'),('/#benefits','user','О нас')])+'</nav>'

def head(title, path='/', description='Аренда квартир в Батуми: реальные фотографии, цены и условия. Посуточно и надолго. Подбор с Алексеем.'): 
    return f'''<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#071D30"><title>{e(title)} — Batumi House</title><meta name="description" content="{e(description)}"><link rel="canonical" href="{BASE+path}"><meta property="og:title" content="{e(title)} — Batumi House"><meta property="og:description" content="{e(description)}"><meta property="og:type" content="website"><meta property="og:url" content="{BASE+path}"><meta property="og:image" content="{BASE}/images/batumi-panorama-v3.webp"><link rel="stylesheet" href="/images/booking-calendar.css?v=20261029-3"><link rel="stylesheet" href="/images/bh3.css?v=3"><script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{{"token":"c5c9ac9359364a608262216ee8f4bb48"}}'></script></head>'''

def scripts(lead=False):
    return ('''<script src="/images/lead-submit.js?v=20261030-2"></script><script src="/images/marketing-attribution.js?v=20261030-1"></script><script src="/images/booking-validation.js?v=20261030-1"></script><script src="/images/lead-form-existing.js?v=3"></script>''' if lead else '')+'''<script src="/images/localization.js?v=3"></script><script src="/images/bh3.js?v=3"></script></body></html>'''

def price(a):
    raw=a['price'];parts=raw.split(' / ',1)
    return f'<strong>{e(parts[0])}</strong><small>/ {e(parts[1])}</small>' if len(parts)>1 else e(raw)

def clean(s):
    return re.sub(r'^[⌖▱⌂☼♧♨\s]+','',s)

def card(a):
    p=a['photos'][0];url='/apartment/'+a['id']+'/'
    details=' · '.join(clean(f) for f in a['features'][:2])
    return f'''<article class="property-card" id="{a['id']}" data-type="{a['type']}" data-price="{a['priceValue']}" data-rooms="{e(a['rooms'])}" data-kind="{a['kind']}" data-location="{e(a['location'])}" data-property-id="{a['id']}">
    <div class="property-photo"><a href="{url}" class="property-link"><img src="/{e(p['src'])}" alt="{e(p['alt'])}" loading="lazy" decoding="async" width="600" height="400"></a><span class="photo-badge">{e(a['imageLabel'] if 'Иллюстрация' in a['imageLabel'] else ('Посуточно' if a['type']=='daily' else 'Долгосрочно'))}</span><button class="favorite-button icon-button" type="button" data-favorite="{a['id']}" aria-label="Добавить в избранное" aria-pressed="false">{icon('heart')}</button></div>
    <div class="property-body"><h3><a href="{url}" class="property-link">{e(a['title'])}</a></h3><p class="card-facts">{icon('ruler-measure') if 'м²' in details else icon('bed')}{e(details)}</p><p class="card-address">{icon('map-pin')}{e(clean(a['location']))}</p><div class="card-bottom"><div class="card-price">{price(a)}</div><a class="btn navy property-link" href="{url}">Подробнее {icon('arrow-right')}</a></div></div></article>'''

def benefits():
    return '<section class="benefits" id="benefits"><div class="wrap"><h2>Почему выбирают Batumi House?</h2><div class="benefit-grid">'+''.join(f'<div>{icon(ic)}<span>{label}</span></div>' for ic,label in [('camera','Реальные фото<br>квартир'),('adjustments-horizontal','Подбор<br>по бюджету'),('user','Общение<br>напрямую'),('message-circle','Помощь<br>на русском языке')])+'</div></div></section>'

def hero():
    return f'''<section class="hero" id="top"><img class="hero-panorama" src="/images/batumi-panorama-v3.webp" alt="Панорама Батуми на закате" fetchpriority="high" width="2400" height="1600"><div class="hero-shade"></div><div class="wrap hero-content"><p class="eyebrow">МОРЕ · КОМФОРТ · ВАШ ДОМ</p><h1>Недвижимость<br><em>в Батуми</em><br>без суеты</h1><p class="hero-intro">Квартиры для отдыха и жизни<br>в лучших районах города</p><div class="hero-trust"><span>{icon('camera')}Реальные<br>фото</span><span>{icon('user')}Общение<br>напрямую</span><span>{icon('message-circle')}Помощь<br>с подбором</span></div></div>
    <form class="search-panel wrap" id="search" novalidate><div class="rental-tabs" role="group" aria-label="Тип недвижимости"><button type="button" data-rental="daily" class="active" aria-pressed="true">Аренда посуточно</button><button type="button" data-rental="long" aria-pressed="false">Аренда долгосрочно</button><button type="button" data-rental="sale" aria-pressed="false">Продажа</button></div><div class="search-fields">
    <label>{icon('map-pin')}<span>Локация<select id="searchLocation" aria-label="Локация"><option value="">Все районы</option><option value="Новый бульвар">Новый бульвар</option><option value="Orbi City">Orbi City</option><option value="Alliance">Alliance Marriott</option><option value="Ангиса">Ангиса</option><option value="Тодогаури">Тодогаури</option></select></span></label>
    <label>{icon('calendar')}<span>Заезд<input id="searchDate" type="date" aria-label="Дата заезда"></span></label>
    <label>{icon('users')}<span>Гости<select id="searchGuests" aria-label="Количество гостей"><option value="1">1 гость</option><option value="2">2 гостя</option><option value="3">3 гостя</option><option value="4">4 гостя</option><option value="5">5 гостей</option></select></span></label>
    <label class="search-budget">{icon('filter')}<span>Бюджет<select id="searchBudget" aria-label="Бюджет"><option value="">Любой</option><option value="70">До 70 ₾ / сутки</option><option value="150">До 150 ₾ / сутки</option></select></span></label><button class="btn gold" type="submit">Найти квартиры {icon('arrow-right')}</button></div><p class="search-note">Свободные даты и размещение гостей подтвердим перед бронированием.</p></form></section>'''

def categories():
    return '<div class="wrap category-grid">'+''.join(f'<a class="category" href="{url}"><img src="/{img}" alt="" loading="lazy"><span><strong>{title}</strong><small>{sub}</small></span><b>{icon("arrow-right")}</b></a>' for url,img,title,sub in [('#daily','images/alliance-02-living-sea-view.jpeg','Посуточная<br>аренда','От 60 ₾ в сутки'),('#apartments','images/batumi-view8-01.webp','Долгосрочная<br>аренда','От $350 в месяц'),('#sale','images/batumi-sunset-hero.webp','Продажа квартир','Подбор по вашему запросу')])+'</div>'

def home():
    lead=(ROOT/'content/lead-form.html').read_text().replace('<form ', '<form novalidate ')
    long=''.join(card(a) for a in items if a['type']=='long');daily=''.join(card(a) for a in items if a['type']=='daily')
    return head('Недвижимость в Батуми — аренда квартир')+f'''<body class="bh3 home-page"><a class="skip-link" href="#daily">Перейти к квартирам</a>{header()}<main>{hero()}{categories()}
    <div class="wrap search-results-note" id="searchResults" role="status" hidden></div>
    <section class="catalog-section wrap" id="daily"><div class="section-heading"><div><h2>Посуточная аренда</h2><p>Квартиры для отдыха и коротких поездок в Батуми</p></div><a class="text-link" href="#search">Подобрать по датам {icon('arrow-right')}</a></div><div class="property-grid">{daily}</div><p class="empty-state" hidden>Нет вариантов по этим фильтрам. Измените условия поиска.</p></section>
    <section class="catalog-section wrap" id="apartments"><div class="section-heading"><div><h2>Долгосрочная аренда</h2><p>Ваш дом у моря — на месяц и надолго</p></div><button type="button" class="text-link" id="resetSearch">Все квартиры {icon('arrow-right')}</button></div><div class="catalog-filters"><label>Комнаты<select id="filterRooms"><option value="">Любые</option><option value="0">Студия</option><option value="2">1+1 / 2 комнаты</option><option value="3">2+1 / 3 комнаты</option></select></label><label>Тип жилья<select id="filterKind"><option value="">Все</option><option value="apartment">Квартира</option><option value="house">Дом</option></select></label></div><div class="property-grid">{long}</div><p class="empty-state" hidden>Нет вариантов по этим фильтрам. Измените условия поиска.</p></section>
    {benefits()}<section class="sale-section wrap" id="sale"><div><p class="eyebrow">НЕДВИЖИМОСТЬ ДЛЯ ЖИЗНИ И ИНВЕСТИЦИЙ</p><h2>Продажа квартир<br>в Батуми</h2><p>Расскажите, какую квартиру хотите купить. Алексей уточнит ваш запрос и подберёт актуальные предложения.</p><a class="btn gold" href="https://t.me/alexeyrieltor97?text={e('Здравствуйте! Хочу подобрать квартиру для покупки в Батуми.')}" target="_blank" rel="noopener">Обсудить покупку {icon('arrow-right')}</a></div><img src="/images/batumi-view8-01.webp" alt="Вид на море из Batumi View" loading="lazy" width="960" height="1280"></section>
    <section class="request-section" id="request"><div class="wrap request-grid"><div><p class="eyebrow">НАЧНЁМ С ВАШИХ ПЛАНОВ</p><h2>Найдём квартиру,<br>которая вам подходит.</h2><p>Оставьте бюджет, даты и контакт. Алексей свяжется с вами и уточнит доступность выбранного варианта.</p><a class="text-link" href="https://t.me/alexeyrieltor97" target="_blank" rel="noopener">Или напишите в Telegram {icon('arrow-right')}</a></div>{lead}</div></section></main>{footer()}{bottom()}<span id="year" hidden></span><div id="uiStatus" class="ui-status" role="status" hidden></div>'''+scripts(True)

def detail(a):
    p=a['photos'][0];title=a['title'];url='/apartment/'+a['id']+'/'
    thumbs=''.join(f'<button type="button" class="gallery-thumb" data-photo="{n}" aria-label="{e(p["alt"])}"><img src="/{e(p["src"])}" alt="{e(p["alt"])}" loading="lazy" width="180" height="130"></button>' for n,p in enumerate(a['photos']))
    desc=''.join(a['description']) or '<p>'+e(' · '.join(clean(f) for f in a['features']))+'</p>'
    href=a['cta'].get('href','https://t.me/alexeyrieltor97');href='/'+href if not href.startswith('http') else href
    attrs=' '.join(f'{k}="{e(v)}"' for k,v in a['cta'].items() if k in ['data-apartment','target','rel'])
    feature=''.join(f'<span>{icon("ruler-measure" if "м²" in f else "stairs" if "этаж" in f else "bed" if any(w in f.lower() for w in ["студия","спаль","планировка","кровать"]) else "check")}{e(clean(f))}</span>' for f in a['features'])
    if 'Иллюстрация' in a['imageLabel']: desc='<p class="illustration-notice">Изображение — иллюстрация. Фотографии объекта уточняются.</p>'+desc
    location=clean(a['location']);mapurl='https://www.google.com/maps/search/?api=1&query='+__import__('urllib.parse',fromlist=['quote']).quote(location)
    monthly=a['monthlyHtml'].replace('href="daily-booking.html','href="/daily-booking.html')
    structured={'@context':'https://schema.org','@type':'Apartment' if a['kind']!='house' else 'House','name':title,'description':re.sub('<[^>]+>',' ',desc),'url':BASE+url,'image':[BASE+'/'+p['src'] for p in a['photos']]}
    return head(title,url, re.sub('<[^>]+>',' ',desc).strip()[:180])+f'''<body class="bh3 detail-page" data-current-property="{a['id']}">{header()}<main class="property-detail wrap"><div class="detail-topbar"><a class="back-link" href="/{'#daily' if a['type']=='daily' else '#apartments'}">{icon('arrow-left')} Все квартиры</a><div><button class="icon-button" type="button" data-favorite="{a['id']}" aria-label="Добавить в избранное" aria-pressed="false">{icon('heart')}</button><button class="icon-button" type="button" id="shareProperty" aria-label="Поделиться квартирой">{icon('share')}</button></div></div>
    <div class="detail-layout"><div><div class="detail-hero"><button class="detail-main-photo" type="button" data-photo="0" aria-label="Открыть фотографии квартиры"><img src="/{e(p['src'])}" alt="{e(p['alt'])}" width="1200" height="800" fetchpriority="high"></button><button class="btn gold photo-count" type="button" data-photo="0">{icon('camera')} <span>Фото</span> · {len(a['photos'])}</button></div><div class="detail-thumbnails">{thumbs}</div>
    <div class="detail-heading"><h1>{e(title)}</h1><p class="detail-address">{icon('map-pin')}{e(location)}</p></div><div class="detail-mobile-price"><div class="card-price">{price(a)}</div><a class="btn gold" href="{e(href)}" {attrs}>Оставить заявку</a></div><div class="detail-features">{feature}</div><section class="description"><h2>Описание</h2>{desc}</section><section class="location-section"><div class="section-heading"><h2>Расположение</h2>{f'<a class="text-link" href="{e(mapurl)}" target="_blank" rel="noopener">Показать на карте {icon("arrow-right")}</a>' if 'уточняется' not in location else ''}</div><p>{e(location)}</p></section></div>
    <aside class="property-enquiry"><p class="eyebrow">ВАША КВАРТИРА В БАТУМИ</p><div class="card-price">{price(a)}</div><p>Наличие и условия подтвердим перед бронированием.</p><a class="btn gold property-cta" href="{e(href)}" {attrs}>{e(a['ctaText'])}</a>{monthly}<hr><h2>Остались вопросы?</h2><p>Алексей поможет с подбором квартиры.</p><a class="btn navy" href="https://t.me/alexeyrieltor97" target="_blank" rel="noopener">{icon('brand-telegram')} Написать в Telegram</a><a class="text-link" href="/#request">Оставить общий запрос {icon('arrow-right')}</a></aside></div></main>{footer()}{bottom()}
    <dialog id="propertyGallery" class="gallery-dialog" aria-label="Фотографии квартиры"><button class="icon-button gallery-close" type="button" aria-label="Закрыть фото">{icon('x')}</button><button class="icon-button gallery-prev" type="button" aria-label="Предыдущее фото">{icon('chevron-left')}</button><img class="gallery-image" alt=""><button class="icon-button gallery-next" type="button" aria-label="Следующее фото">{icon('chevron-right')}</button><div class="gallery-tools"><span id="galleryCounter"></span><button class="icon-button gallery-zoom" type="button" aria-label="Увеличить фото">{icon('arrows-maximize')}</button></div></dialog><div id="uiStatus" class="ui-status" role="status" hidden></div><script type="application/ld+json">{json.dumps(structured,ensure_ascii=False).replace('</','<\\/')}</script>'''+scripts()

def build():
    if OUT.exists():shutil.rmtree(OUT)
    OUT.mkdir(exist_ok=True)
    shutil.copytree(ROOT/'images', OUT/'images',dirs_exist_ok=True)
    photos=sum([json.loads((ROOT/f'images/orbi-c-gallery-{i}.json').read_text()) for i in [1,2]],[])
    for n,data in enumerate(photos):
        (OUT/f'images/orbi-c-v3-{n+1:02}.webp').write_bytes(base64.b64decode(data.split(',',1)[1]))
    (ROOT/'index.html').write_text(home())
    (OUT/'index.html').write_text(home())
    for f in ['daily-booking.html','photo-catalog.html','admin.html']:shutil.copy2(ROOT/f,OUT/f)
    for a in items:
        d=OUT/'apartment'/a['id'];d.mkdir(parents=True,exist_ok=True);(d/'index.html').write_text(detail(a))
    urls=['/']+['/apartment/'+a['id']+'/' for a in items]
    (OUT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+BASE+u+'</loc></url>' for u in urls)+'</urlset>')
    (OUT/'robots.txt').write_text('User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin.html\nDisallow: /iphone-preview.html\nSitemap: '+BASE+'/sitemap.xml\n')
    if '--preview' in sys.argv:
        (OUT/'iphone-preview.html').write_text('''<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Batumi House 3 · mobile QA</title><style>body{margin:0;background:#dce2e7;font:14px system-ui;padding:12px}nav{margin-bottom:12px;display:flex;gap:12px}iframe{display:block;border:0;height:852px;background:white;border-radius:14px}a{color:#071d30}</style><nav><a href="?w=375">375px</a><a href="?w=390">390px</a><a href="?w=430">430px</a><a href="?w=390&p=/apartment/daily-orbi-d2/">Квартира</a><a href="?w=390&p=/daily-booking?property=orbi-d2">Заявка</a></nav><iframe id="phone" title="Мобильный сайт"></iframe><script>const q=new URLSearchParams(location.search),f=document.querySelector('iframe');f.style.width=([375,390,430].includes(+q.get('w'))?q.get('w'):390)+'px';f.src=q.get('p')||'/';</script>''')
    if '--preview' in sys.argv:
        for page in OUT.rglob('*.html'):
            page.write_text(page.read_text().replace('</head>','<meta name="robots" content="noindex,nofollow"></head>',1))
    print(f'Built {len(items)} real apartment pages; existing photos and API preserved.')

if __name__=='__main__':build()
