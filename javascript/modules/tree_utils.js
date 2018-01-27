import * as d3 from "d3";

// a big thank you to the following sources for help
// designing a dynamic d3 tree

// D3 Tips and Tricks v4 by Malcolm Maclean

// this associated gist
// https://gist.github.com/d3noob/43a860bc0024792f8803bba8ca0d5ecd

// this js fiddle https://jsfiddle.net/a6pLqpxw/8/
// linked by Rohit Totala on Stack Overflow

// and Corey Ladovsky (https://github.com/coreyladovsky)
// for working through some examples with me

export default class TreeVisualization {
  constructor(origin = null) {

    this.idx = 0;
    this.count = 0;

    if (origin !== null) {
      this.origin = origin.title;
      this.plant(origin);
    }
  }

  plant(origin){
    this.origin = origin.title;
    this.clear();

    let width = window.innerWidth,
        height = window.innerHeight;

    this.tree = d3.tree().size([height - 100, width - 500]);

    this.canvas = d3.select("#main")
      .append("svg")
      .attr("width", 5000)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(50,50)`);

    let rootNode = Object.assign({}, origin);
    rootNode.count = rootNode.children.length;
    rootNode.children = [];

    this.root = d3.hierarchy(rootNode, d => d.children);
    this.root.x0 = height / 2;
    this.root.y0 = width / 2;



    this.currentNode = this.root;
    this.updateTree();
  }

  updateTree(leaf) {
    let newTree = this.tree(this.root);
    this.nodes = newTree.descendants();
    let links = newTree.descendants().slice(1);

    let link = this.canvas.selectAll("path.link")
        .data(links, d => d.id);

    let linkEnter = link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", (d) => {
        let cords = {
          x: this.currentNode.x0,
          y: this.currentNode.y0
        };
        return this.drawCurve(cords, cords);
      });

    let linkUpdate = linkEnter.merge(link);
    linkUpdate.transition()
      .duration(200)
      .attr("d", (d) => this.drawCurve(d, d.data.parent));

    linkUpdate.transition()
      .duration(500)
      .delay(150)
      .style("stroke", "#777");


    var linkExit = link.exit().transition()
      .duration(200)
      .attr("d", (d) => {
        let cords = {
          x: this.currentNode.x0,
          y: this.currentNode.y0
        };
        return this.drawCurve(cords, cords);
      })
      .remove();

    let node = this.canvas.selectAll("g.node")
      .data(this.nodes, d => d.id || (d.id = this.count++));

    let nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", d => (
        `translate(${this.currentNode.y0},${this.currentNode.x0})`
      ));

    nodeEnter.append("text")
      .attr("dy", "3px")
      .attr("x", d => d.children ? 10 : -10)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.title)
      .transition()
      .delay(200)
      .duration(1000)
      .style("fill", "#777");

    // nodeEnter.append("circle")
    //   .attr("r", 1);


    nodeEnter.on("mouseover", this.handleMouseOver);


    let nodeUpdate = nodeEnter.merge(node);


    nodeUpdate.transition()
      .duration(200)
      .attr("transform", d => (
        `translate(${d.y},${d.x})`
      ));

    this.nodes.forEach((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });

  }

  addLeaf(node, final=false) {

    if (this.currentNode.data.count === this.currentNode.data.children.length){
      this.updateTree(node);
      this.idx += 1;
      this.currentNode = this.nodes[this.idx];
      while (this.currentNode.data.count === 0) {
        if (this.idx >= this.nodes.length) {
          break;
        }
        this.idx += 1;
        this.currentNode = this.nodes[this.idx];
      }
    }



    let nodeObj = Object.assign({}, node);
    nodeObj.parent = this.currentNode;
    nodeObj.count = nodeObj.children.length;
    nodeObj.children = [];

    if (final){
      if (node.parent !== this.currentNode.data.title) {
        this.updateTree();
        this.currentNode = this.nodes.filter(d => d.data.title === node.parent);
        this.currentNode = this.currentNode[0];
        nodeObj.parent = this.currentNode;
      }

      let returnNode = d3.hierarchy(nodeObj);
      returnNode.depth = this.currentNode.depth + 1;
      returnNode.height = this.currentNode.height - 1;

      this.currentNode.children = [returnNode];
      this.currentNode.data.children = [returnNode];

      this.updateTree();
      return;
    }

    let returnNode = d3.hierarchy(nodeObj);
    returnNode.depth = this.currentNode.depth + 1;
    returnNode.height = this.currentNode.height - 1;


    if (!this.currentNode.children){
      this.currentNode.children = [];
      this.currentNode.data.children = [];
    }

    this.currentNode.children.push(returnNode);
    this.currentNode.data.children.push(returnNode.data);


  }

  handleMouseOver(d, i) {
    d3.select(this).append("image")
      .attr("xlink:href", function(d) { return "https://am22.akamaized.net/tms/cnt/uploads/2015/10/o-DISASTER-ARTIST-GREG-SESTERO-facebook.jpg"; })
      .attr("x", "-12px")
      .attr("y", "-12px")
      .attr("width", "100px");
  }

  drawTree() {
  }

  drawCurve(a, b) {
    return `M${a.y},${a.x} ` +
      `C${(a.y + b.y) / 2}, ${a.x} ` +
      `${(a.y + b.y) / 2},${b.x} ` +
      `${b.y},${b.x}`;
  }

  clear() {
    this.tree = null;
    this.canvas = null;
    this.idx = 0;
    this.count = 0;
    this.nodes =[];

    let existing = document.getElementsByTagName("svg");

    if (existing.length > 0){
      existing = existing[0];
      document.getElementById("main").removeChild(existing);
    }

  }
}
