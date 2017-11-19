import * as d3 from "d3";

var bodyWidth = window.innerWidth;
var bodyHeight = window.innerHeight;
var data = {
  name: "",
  children: []
};
var count = 0,
    tree,
    canvas;

export const render = (LinkMap) => {
  if (data.name === "") {
    data["name"] = LinkMap.origin;
    data["children"] = LinkMap.get(LinkMap.origin).children.map(
      (child) => ({name: child})
    );
    count += 1;
  } else {
    let parentArray = LinkMap.trace(LinkMap.currentParent);
    let parent = data.children;
    let i = 2;
    parent = data.children.filter(
      (child) => child.name === parentArray[1])[0];

    while (i < parentArray.length) {
      if (parent.children.length > 0) {
        parent = parent.children.filter(
          (child) => child.name === parentArray[i])[0];
          i ++;
      }
    }
    if (parent === undefined){
      debugger;
    }
    parent.children = LinkMap.get(parent.name).children.map(
      (child) => ({name: child})
    );
    count += 1;
  }




};

export const drawTree = (LinkMap) => {
  //this function and associated css are heavily based on this codepen
  // https://codepen.io/netkuy/pen/qZGdoj
  // by Yuki Kodama


  canvas = d3.select("body").append("svg")
    .attr("width", bodyWidth)
    .attr("height", bodyHeight)
    .append('g')
    .attr('transform', 'translate(100, 100)')
    .attr('class', 'main');



  tree = d3.tree().size([bodyHeight -150, bodyWidth - 500]);
  var root = d3.hierarchy(data);

  tree(root);

  var link = canvas.selectAll('.link')
    .data(root.descendants().slice(1))
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', function(d) {
      return "M" + d.y + "," + d.x
      + "C" + (d.y + d.parent.y) / 2 + "," + d.x
      + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
      + " " + d.parent.y + "," + d.parent.x;

    });

  var node = canvas.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', function(d) {
      return "node " + (d.children ? "node-internal" : "node-leaf");
    })
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
    .on("mouseover", function(d) {
      d3.select(this).raise()
      .append("text")
        .attr('class', 'node_name')
        .attr("dy", 3)
        .attr("x", function(d) { return d.children ? -8 : 8; })
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .text(function(d) { return d.data.name; });
    })
    .on("mouseout", function(d){
      d3.selectAll("text.node_name").remove();
    });

  node.append("circle")
    .attr("r", 2);

  node.append("text")
      .attr('class', 'trace')
      .attr("dy", 3)
      .attr("x", function(d) { return d.children ? -8 : 8; })
      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) {
        if (LinkMap.trace(LinkMap.destination).includes(d.data.name)){
          return d.data.name;
        }
      });

};
