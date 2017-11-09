import * as Lifecycle from './modules/lifecycle';

const PageArray = [];

setInterval(() => {
  console.log(PageArray);
}, 10000);

document.addEventListener('DOMContentLoaded', () => {
  Lifecycle.Start(PageArray);
});
