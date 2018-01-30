
export const fetchWikiPage = (title, callback) => {
  var wikiRequest = new XMLHttpRequest();

    wikiRequest.open(
      "GET",
      "https://en.wikipedia.org/w/api.php?action=query&prop=revisions" +
        "%7Cpageimages&rvprop=content&piprop=original&" +
        "format=json&origin=*&titles=" + title
    );

  wikiRequest.onreadystatechange = () => {

    if (
      wikiRequest.readyState === XMLHttpRequest.DONE
      && wikiRequest.status === 200
    ) {
      let pages = formatResponse(wikiRequest, callback);
      if (!pages) {
        return;
      }

      let title,
          image;

      if (pages.length > 0) {
        image = pages[1];
        pages = pages[0];
        title = pages.pop();
      }

      callback(pages, title, image);
    } else if (wikiRequest.readyState === XMLHttpRequest.DONE) {
      alert("error");
    }
  };

  wikiRequest.send();
};

const formatResponse = (response, callback) => {
  let rjson = JSON.parse(response.responseText);
  if (pageDNE(rjson)) {
    console.log("page DNE");
    return [];
  }
  let pages = Object.keys(rjson.query.pages),
      image = false;
  pages = pages[0];

  if (rjson.query.pages[pages].original) {
    image = rjson.query.pages[pages].original.source;
    let preload = new Image();
    preload.src = image;
  }

  let title = rjson.query.pages[pages].title;
  pages = rjson.query.pages[pages].revisions[0]["*"];

  if (pages.slice(0, 9).toLowerCase() === "#redirect") {
    pages = pages.match(/\[(.*?)\]/g);
    pages = pages[0];
    fetchWikiPage(pages.slice(2, pages.length - 1), callback);
    return;
  }

  let Wiktionary = (pages.slice(2,12).toLowerCase() === "wiktionary");
  Wiktionary = (Wiktionary || pages.match(/may refer to/g) !== null);
  Wiktionary = (Wiktionary || pages.match(/most commonly refers to/g) !== null);
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
  pages.push(title);
  return [pages, image];
};

const pageDNE = (response) => {
  let pageIdx = Object.keys(response.query.pages);
  pageIdx = pageIdx[0];
  return (pageIdx === "-1");
};
