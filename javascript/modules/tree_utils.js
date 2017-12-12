import * as d3 from "d3";


// a big thank you to the following sources for help
// designing a dynamic d3 tree

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

    this.tree = d3.tree().size([height - 100, width - 100]);

    this.canvas = d3.select("body")
      .append("svg")
      .attr("width", width)
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

    this.nodes.forEach((d) => {
      d.y = d.depth * 180;
    });

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
      .text(d => d.title);

    nodeEnter.append("circle")
      .attr("r", 2);

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

  addLeaf(node) {

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

  drawTree() {
  }

  drawCurve(a, b) {

    debugger

    return `M${a.y},${a.x} ` +
      `C${(a.y + b.y) / 2}, ${a.x} ` +
      `${(a.y + b.y) / 2},${b.x} ` +
      `${b.y},${b.x}`;

  }

  clear() {
    this.tree = null;
    this.canvas = null;

    let existing = document.getElementsByTagName("svg");
    if (existing.length > 0){
      existing = existing[0];
      let body = document.getElementsByTagName("body");
      body[0].removeChild(existing);
    }
  }
}
