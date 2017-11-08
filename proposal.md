# Wikipedia Crawler

## Background
Wikipedia crawler is a automation of a game I used to play in high school in which students were given two links on Wikipedia and "raced" to connect them via a series of link traversals.  For the purpose of this data visualization the following functionalities will be considered the requirements for a minimum viable product.

##MVPs

- [ ] Users must be able to specify end and start points of the crawl
- [ ] The route should appear as a series of nodes representing connecting links
- [ ] The automatic process should be visualized live
- [ ] Each link added as it is queried

Additionally
- [ ] There should be an introductory modal to explain the purpose of the app to the user
- [ ] A production style ReadMe

## Technologies

* Javascript for basic logic and driving engine
* Canvas for creating the display
* Webpack for bundling the visualization's files

## Implementation Timeline

### Day 1
Create user interface, research methods of querying wikipedia.  Establish basic visual methods, such as creating and linking nodes.

### Day 2
Create functionality for querying wikipedia, be able to return the first article from a user query within the game window.

### Day 3
Create methods for searching through each article and querying each link

### Day 4
Map links to node net, allow users to inspect links by hovering, style
