trackajax
===

Cкрипт позволяет отслеживать на странице ошибки (4XX-5XX) в аякс-запросах (XMLHttpRequest и JSONP) с помощью Яндекс.Метрики.

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

Для ошибок в обычных аякс-запросах:
 ```
 + Xhr errors
    + page url
        + http code: ajax url
 ```
 
Для кроссдоменных аякс-запросов:
 ```
 + Crossdomain xhr errors
    + page url
        + http code: ajax url
 ```

 Для JSONP-запросов:
```
 + JSONP errors
    + page url
        + jsonp url
```
[Пример отчёта](...) TODO

## Лицензия
MIT License
