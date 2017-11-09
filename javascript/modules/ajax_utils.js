export const fetchWikiPage = (title) => {
  var wikiRequest = new XMLHttpRequest();

  wikiRequest.open(
    "GET",
    `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=links&pllimit=max&titles=${title}`
  );

  wikiRequest.onreadystatechange = () => {
    if (
      wikiRequest.readyState === XMLHttpRequest.DONE
      && wikiRequest.status === 200
    ) {
      let rjson = JSON.parse(wikiRequest.responseText);
      let page = Object.keys(rjson.query.pages);
      page = page[0];
      console.log(rjson.query.pages[page].links);
      return rjson.query.pages[page].links;
    } else if (wikiRequest.readyState === XMLHttpRequest.DONE) {
      console.log("error");
    }
  };



  wikiRequest.send(null);
};
