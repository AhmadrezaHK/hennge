# Report

Project stack is including:

- [Vue.js v3](https://v3.vuejs.org/)
- [Vite](https://github.com/vitejs/vite)
- [Typescript](https://www.typescriptlang.org/)
- [SCSS](https://sass-lang.com/)
- [Bootstrap CSS](https://getbootstrap.com/)
- [Vue Router](https://router.vuejs.org/)
- [dayjs](https://day.js.org/)
- [flatpickr](https://flatpickr.js.org/)

The project is using dayjs and faltpickr due to their small bundle sizes without any jQuery.
for haveing all kind of dates (past mounth, past year, ...) for emails, i generate dates randomly on runtime. (src/emailList.ts).