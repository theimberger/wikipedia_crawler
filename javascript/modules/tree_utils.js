import * as d3 from "d3";

export default class TreeVisualization {
  constructor(origin = null) {
    this.bodyWidth = window.innerWidth;
    this.bodyHeight = window.innerHeight;
    if (origin !== null) {
      this.origin = origin.title;
      this.plant(origin);
    }
  }

  plant(origin){
    this.origin = origin.title;
    // get the start point for the tree and add a node
    if (origin === "" || origin === null) {
      return;
    }
    this.data = Object.assign({}, origin);
    this.data.parent = null;


    this.data = d3.hierarchy(this.data);

    //   .id((d) => d.title)
    //   .parentId((d) => d.parent)([this.data]);
    // this.data.each(function(d){ d.title = d.id; });

    // reset previous data, if any
    this.count = 0;
    this.tree = null;
    this.canvas = null;
    let existing = document.getElementsByTagName("svg");
    if (existing.length > 0){
      existing = existing[0];
      let body = document.getElementsByTagName("body");
      body[0].removeChild(existing);
    }

    // create tree and append new svg
    this.tree = d3.tree()
      .size([this.bodyHeight -150, this.bodyWidth - 500]);

    this.nodes = d3.hierarchy(this.data);
    this.nodes = this.tree(this.nodes);
    this.currentParent = this.nodes
    this.childCount = this.nodes.children.length;

    this.canvas = d3.select("body").append("svg")
      .attr("width", this.bodyWidth)
      .attr("height", this.bodyHeight);

    this.g = this.canvas.append("g")
      .attr("transform", "translate(100, 100)")
      .attr("class", "main");

    this.link = this.g.selectAll(".link")
      .data(this.nodes.descendants().slice(1))
      .enter().append("path")
        .attr("class", "link")
        .attr("d", (d) => {
          return `M${d.y},${d.x} ` +
            `C${(d.y + d.parent.y)/2},${d.x} ` +
            `${(d.y + d.parent.y / 2)},${d.parent.x} ` +
            `${d.parent.y}, ${d.parent.x}`;
        });

    this.node = this.g.selectAll(".node")
      .data(this.nodes.descendants())
      .enter().append("g")
        .attr("class", (d) => {
          return "node " +
            (d.children ? "internal_node" : "leaf_node");
        })
        .attr("transform", (d) => {
          return `translate(${d.y}, ${d.x})`;
        });
      this.node.append("circle")
        .attr("r", 2);
      this.node.on("mouseover", function(d) {
          d3.select(this).raise()
          .append("text")
            .attr("class", "node_name")
            .attr("dy", 3)
            .attr("x", function(d) { return d.children ? -8 : 8; })
            .style("text-anchor",
              function(d) { return d.children ? "end" : "start"; })
            .text(function(d) { return d.data.name; });
        })
        .on("mouseout", function(d){
          d3.selectAll("text.node_name").remove();
        });
  }

  addLeaf(node) {
    debugger
  }



  drawTree(LinkMap) {
    //this function and associated css are heavily based on this codepen
    // https://codepen.io/netkuy/pen/qZGdoj
    // by Yuki Kodama

    //
    // this.canvas = d3.select("body").append("svg")
    //   .attr("width", this.bodyWidth)
    //   .attr("height", this.bodyHeight)
    //   .append("g")
    //   .attr("transform", "translate(100, 100)")
    //   .attr("class", "main");



    // this.tree = d3.tree().size([this.bodyHeight -150, this.bodyWidth - 500]);
    // var root = d3.hierarchy(this.data);
    //
    // this.tree(root);
    //
    // var link = this.canvas.selectAll(".link")
    //   .data(root.descendants().slice(1))
    //   .enter()
    //   .append("path")
    //   .attr("class", "link")
    //   .attr("d", function(d) {
    //     return "M" + d.y + "," + d.x
    //     + "C" + (d.y + d.parent.y) / 2 + "," + d.x
    //     + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
    //     + " " + d.parent.y + "," + d.parent.x;
    //
    //   });
    //
    // var node = this.canvas.selectAll(".node")
    //   .data(root.descendants())
    //   .enter()
    //   .append("g")
    //   .attr("class", function(d) {
    //     return "node " + (d.children ? "node-internal" : "node-leaf");
    //   })
    //   .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
    //   .on("mouseover", function(d) {
    //     d3.select(this).raise()
    //     .append("text")
    //       .attr("class", "node_name")
    //       .attr("dy", 3)
    //       .attr("x", function(d) { return d.children ? -8 : 8; })
    //       .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
    //       .text(function(d) { return d.data.name; });
    //   })
    //   .on("mouseout", function(d){
    //     d3.selectAll("text.node_name").remove();
    //   });
    //
    // node.append("circle")
    //   .attr("r", 2);
    //
    // node.append("text")
    //     .attr("class", "trace")
    //     .attr("dy", 3)
    //     .attr("x", function(d) { return d.children ? -8 : 8; })
    //     .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
    //     .text(function(d) {
    //       if (LinkMap.trace(LinkMap.destination).includes(d.data.name)){
    //         return d.data.name;
    //       }
    //     });
  }

}
