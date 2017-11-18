export const titleCase = (string) => {
  string = string.split(" ");
  string = string.map((word) => {
    word = word.toLowerCase();
    return word[0].toUpperCase() + word.slice(1);
  });

  return string.join(" ");
};
