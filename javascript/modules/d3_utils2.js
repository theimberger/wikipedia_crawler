import * as d3 from "d3";

var bodyWidth = window.innerWidth;
var bodyHeight = window.innerHeight;

var canvas = d3.select("body").append("svg")
  .attr("width", bodyWidth)
  .attr("height", bodyHeight)
  .append('g')
  .attr('transform', 'translate(50, 50)')
  .attr('class', 'main');

var clock = 0;
var nodes = [];
var links = [];

export const render = (LinkMap) => {
  if (clock === 0) {
    clock = Date.now;
    addNode(LinkMap.currentParent);
  }

  var node = canvas.selectAll('.node')
    .data(LinkMap)
    .enter()
    .append('g')
    .attr('class', function(d) {
      return "node " + (d.children ? "node-internal" : "node-leaf");
    })
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
};

const addNode(LinkMap) {
  nodes.push(LinkMap.currentParent);
  links.push(LinkMap.get(currentParent).children);
}
//
// const drawTree = () => {
//   var node = canvas.selectAll('.node')
//     .data(LinkMap)
//     .enter()
//     .append('g')
//     .attr('class', function(d) {
//       return "node " + (d.children ? "node-internal" : "node-leaf");
//     })
//     .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
//
//
//
//
//   var link = canvas.selectAll('.link')
//   .data()
//   .enter()
//   .append('path')
//   .attr('class', 'link')
//   .attr('d', function(d) {
//     return "M" + d.y + "," + d.x
//     + "C" + (d.y + d.parent.y) / 2 + "," + d.x
//     + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
//     + " " + d.parent.y + "," + d.parent.x;
//   });
//
//   node.append("circle")
//   .attr("r", 1);
//
//   node.append("text")
//   .attr("dy", 3)
//   .attr("x", function(d) { return d.children ? -8 : 8; })
//   .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
//   .text(function(d) { return d.data.name; });
//
// };
