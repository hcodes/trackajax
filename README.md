trackajax
===

Cкрипт позволяет отслеживать серверные аякс-ошибки (4xx-5xx) с помощью Яндекс.Метрики.

На данный момент поддерживается в XMLHttpRequest и JSONP.

## Подключение на странице
  ```HTML
  <script src="trackajax.js"></script>
  <script>
    TrackAjax.start(123); // 123 - номер счётчика Метрики
  </script>
  ```
Также на странице должен быть установлен код счётчика Метрики.

## Отчёт
Данные об ошибках находятся в отчёте "Параметры визитов".

Для обычного аякс-запроса:
 ```
 + Xhr errors
    + page url
        + http code: ajax url
 ```
 
Для кроссдоменного аякс-запроса:
 ```
 + Crossdomain xhr errors
    + page url
        + http code: ajax url
 ```

 Для JSONP-запроса:
```
 + JSONP errors
    + page url
        + jsonp url
```
(Пример отчёта)[...]

## Лицензия
MIT License
