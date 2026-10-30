# Batumi Home: защищённая панель заявок

Адрес после публикации: `/admin.html`.

## Безопасность
API `GET /api/admin/leads` и `PATCH /api/admin/leads/status` **отказывают всем** до настройки Cloudflare Access. Нельзя включать публичный доступ к контактам. Worker проверяет подпись JWT по публичным ключам Cloudflare Access, сроки действия и audience. Не используйте простой заголовок email как авторизацию.

## Настроить перед использованием
1. В Cloudflare Zero Trust → Access → Applications создайте self-hosted приложение для хоста `batumihouse.alexxstalkerxx.workers.dev` с путями `/admin.html` и `/api/admin/*` (при необходимости две заявки/приложения).
2. Allow policy только для вашего административного email; включите одноразовый код или другой безопасный провайдер входа.
3. В Worker `batumihouse` добавьте `ACCESS_TEAM_DOMAIN` (например `yourteam.cloudflareaccess.com`) и `ACCESS_AUD` (Application AUD tag, точное значение для защищённого API). Сохраняйте параметры в защищённых настройках Cloudflare. Если защищаете оба пути разными Access-приложениями, для API используйте именно AUD API-приложения.
4. Опубликуйте весь проект из GitHub через Wrangler; убедитесь, что `admin.html` попал в `dist`. Сохраните текущие D1 и Telegram bindings.
5. Проверка без авторизации: `/api/admin/leads` должен отвечать 403. После входа с разрешённого email: 200. Неверный/истёкший JWT: 403.
6. Проверьте изменение статуса тестовой заявки и убедитесь, что старые заявки остаются в базе.

## Данные
Существующая таблица `leads` уже имеет `status`; новые таблицы и миграции не нужны. Статусы: `new`, `working`, `closed`, `lost`. Таблица и служебные secrets не экспортируются в браузер до проверки JWT. Публичная форма `POST /api/leads` остаётся без изменений. Telegram-уведомления сохраняются.
