// fetchWikiPage is tricky -
//because the wiki api only lets me get 500 links per request,
//if a page has > 500 links, I'll miss some, so I make the same request
//but in decending order.  This does mean I'll miss any links between the two
//if the page has > 1,000 links


export const fetchWikiPage = (PageArray, title, reverse = false, fetched = []) => {

  // title - the name of the page we're getting links from
  // reverse - whether we're getting a second batch of links from the same pages
  //    in reverse order
  // fetched - stores the links from the first query

  var wikiRequest = new XMLHttpRequest();

  if (!reverse) {
    wikiRequest.open(
      "GET",
      `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=links&pllimit=max&titles=${title}`
    );
  } else {
    wikiRequest.open(
      "GET",
      `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=links&pllimit=max&titles=${title}&pldir=descending`
    );
  }

  wikiRequest.onreadystatechange = () => {

    if (
      wikiRequest.readyState === XMLHttpRequest.DONE
      && wikiRequest.status === 200
    ) {
      let rjson = JSON.parse(wikiRequest.responseText);
      let pages = Object.keys(rjson.query.pages);
      pages = pages[0];
      pages = rjson.query.pages[pages].links;
      if (pages.length === 500) {
        if (reverse) {
          pages = mergeResult(fetched, pages);
          console.log(pages);
          PageArray.push(pages);
        } else {
          console.log(pages);
          fetchWikiPage(PageArray, title, true, pages);
        }
      } else if (pages.length > 0) {
        console.log(pages);
        PageArray.push(pages);
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
