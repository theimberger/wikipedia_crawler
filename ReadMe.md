# Wikipedia Crawler
[Check Out the Live Demo](https://theimberger.github.io/wikipedia_crawler/)

## About
Wikipedia Crawler is a bot which finds a path between two pages on Wikipedia as given by a user.
This path is created by selecting sequential links on each page.  The path is then visualized as a node tree.  Note: there is a
setTimeout on API queries for wikipedia in the lifecycle file (line 153) because without this short break the app can feel
pretty jarring.

## Notable Code
The Crawler uses a custom data structure called a PolyHash (see this file in the javascript/modules folder) to ensure constant speed look-up
and addition.  Notable methods for this structure are `get()` and `add()` shown below.

```JavaScript
class PolyHash{

  ...

  add(title, parent = this.currentParent, children = [], image = false) {
    if (this.origin === "") {
      this.origin = title;
      this.currentParent = title;
    }

    let addition = {
      title,
      parent,
      children,
      image,
    };

    let bucket = Math.floor(this.hashString(title) % this.map.length);
    if (this.map[bucket] === null) {
      this.map[bucket] = [];
    }
    this.map[bucket].push(addition);
    this.count ++;
    if (this.count > this.map.length) {
      this.resizeMap();
    }
  }

  ...

  get(string) {
    let bucket = Math.floor(this.hashString(string) % this.map.length);
    let match;

    if (this.map[bucket] === null) return false;

    this.map[bucket].forEach((node) => {
      if (node.title === string) {
        match = node;
      }
    });

    return match || false;
  }

  ...

}

```

Other notable code includes the RunFactory method, which manages AJAX requests.  Queries are stored in the FetchQue
and then are fired off sequentially using a setTimeout.

``` JavaScript

  const RunFactory = (title) => () => {
    LinkMap.currentParent = title;
    AjaxUtils.fetchWikiPage(title, Run);
    FetchQue.shift();
  };
```
