"""Generate a phone-width QA harness for preview builds only, never production."""
from pathlib import Path

Path('dist/iphone-preview.html').write_text('''<!doctype html>
<html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Batumi House · проверка мобильной версии</title>
<style>body{margin:0;padding:16px;background:#e2e8f0;font:14px system-ui;color:#0f172a}nav{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}a{color:#0340c6;background:white;padding:10px;border-radius:8px}iframe{display:block;border:1px solid #cbd5e1;border-radius:18px;background:white;height:844px;max-width:100%}p{margin:0 0 12px}</style>
<nav><a href="?width=375">375px</a><a href="?width=390">390px</a><a href="?width=430">430px</a><a href="?width=390&route=booking">Бронирование</a></nav>
<p>Проверка адаптивной вёрстки: размеры экрана iPhone. Это не эмуляция Safari.</p>
<iframe id="phone" title="Мобильная версия Batumi House"></iframe>
<script>const q=new URLSearchParams(location.search),w=[375,390,430].includes(Number(q.get('width')))?Number(q.get('width')):390;const f=document.getElementById('phone');f.style.width=w+'px';f.src=q.get('route')==='booking'?'daily-booking?property=orbi-d2':'index.html';</script>
</html>''', encoding='utf-8')
