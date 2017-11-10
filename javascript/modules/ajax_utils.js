
export const fetchWikiPage = (
  title,
  callback,
  reverse = false,
  fetched = []
) => {
  var wikiRequest = new XMLHttpRequest();

  // if (!reverse) {
  //   wikiRequest.open(
  //     "GET",
  //     `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=links&pllimit=max&titles=${title}`
  //   );
  // } else {
  //   wikiRequest.open(
  //     "GET",
  //     `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=links&pllimit=max&titles=${title}&pldir=descending`
  //   );
  // }
    wikiRequest.open(
      "GET",
      `https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&origin=*&titles=${title}`
    );

  wikiRequest.onreadystatechange = () => {

    if (
      wikiRequest.readyState === XMLHttpRequest.DONE
      && wikiRequest.status === 200
    ) {
      let rjson = JSON.parse(wikiRequest.responseText);
      let pages = Object.keys(rjson.query.pages);
      pages = pages[0];
      pages = rjson.query.pages[pages].revisions[0]["*"];
      pages = pages.match(/\[(\w+)/g).map((word) => word.slice(1));
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


//https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=jsonfm&titles=${}
