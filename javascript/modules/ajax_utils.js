
export const fetchWikiPage = (
  title,
  callback,
  reverse = false,
  fetched = []
) => {
  var wikiRequest = new XMLHttpRequest();

    wikiRequest.open(
      "GET",
      `https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&origin=*&titles=${title}`
    );

  wikiRequest.onreadystatechange = () => {

    if (
      wikiRequest.readyState === XMLHttpRequest.DONE
      && wikiRequest.status === 200
    ) {
      let pages = formatResponse(wikiRequest);
      if (pages.length === 500) {
        if (reverse) {
          pages = mergeResult(fetched, pages);
          callback(pages);
        } else {
          fetchWikiPage(title, callback, true, pages);
        }
      } else if (pages.length > 0) {
        callback(pages);
      } else {
        callback([]);
        return false;
      }
    } else if (wikiRequest.readyState === XMLHttpRequest.DONE) {
      alert("error");
    }
  };

  wikiRequest.send();
};

const mergeResult = (fetched, pages) => {
  pages.reverse();
  let count = 0;
  let last = fetched[499].title;
  while (pages[count].title <= last) {
    count ++;
  }
  pages = pages.slice(count);
  return fetched.concat(pages);
};

const formatResponse = (response) => {
  let rjson = JSON.parse(response.responseText);
  if (pageDNE(rjson)) {
    console.log("page DNE");
    return [];
  }
  let pages = Object.keys(rjson.query.pages);
  pages = pages[0];
  pages = rjson.query.pages[pages].revisions[0]["*"];
  let Wiktionary = (pages.slice(2,12).toLowerCase() === "wiktionary");

  pages = pages.match(/\[(.*?)\]/g).map(
    (word) => {
      if (
        word.includes(":") ||
        word.includes("#") ||
        word.includes(".")
      ){
        return "";
      }
      word = word.slice(2, word.length - 1);
      if (word.includes("|")) {
        word = word.split("|");
        word = word[0];
      }
      return word;
    }).filter((word) => word.length > 0);

  if (Wiktionary){
    pages.push("Wiktionary");
  }
  return pages;
};

const pageDNE = (response) => {
  let pageIdx = Object.keys(response.query.pages);
  pageIdx = pageIdx[0];
  return (pageIdx === "-1");
};
