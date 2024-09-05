# Колесо Фортуны
Pet-project
React + Node.js + Postgres + Express.js

Создан для тренировки и развития навыков в указанном стэке.
Сайт позволяет создать собственные коллекции игр и использовать "Колесо Фортуны" для выбора игры из указанного списка в нескольких режимах.
Реализована авторизация (AccessToken хранится на клиенте с использованием Zustand, RefreshToken передается в куки) и личный кабинет пользователя.
Интерфейсы: Публичные коллекции, коллекции, список игр, Steam игры, авторизация, личный кабинет.
Есть интеграция со Steam API для получения списка всех игр и получения списка игр конкретного пользователя по Steam ID.
