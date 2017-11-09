export const hideHeader = () => {
  let header = document.getElementsByTagName('header');
  header = header[0];
  header.style.top = "-200px";
};

export const showHeader = () => {
  let header = document.getElementsByTagName('header');
  header = header[0];
  header.style.top = "50px";
};
