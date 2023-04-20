const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

let engine, world;
let boy, tree;
let mangoes = [];
let stones = [];

function preload() {
  boyImg = loadImage('boy.png');
  mangoImg = loadImage('mango.png');
  treeImg = loadImage('tree.png');
  stoneImg = loadImage('stone.png');
}

function setup() {
  createCanvas(800, 600);
  engine = Engine.create();
  world = engine.world;

  boy = new Boy(100, 500);
  tree = new Tree(600, 300);

  _.each(_.range(10), function() {
    let mango = new Mango(_.random(500, 700), _.random(200, 400));
    mangoes.push(mango);
  });
}

function draw() {
  background(200, 220, 255);
  Engine.update(engine);

  tree.draw();
  boy.draw();

  _.each(stones, function(stone, index) {
    stone.draw();
    stone.launch();
    if (stone.body.position.y > height) {
      stones.splice(index, 1);
      World.remove(world, stone.body);
    }
  });

  _.each(mangoes, function(mango, index) {
    mango.draw();
    if (stoneHitsMango(mango)) {
      World.remove(world, mango.body);
      mangoes.splice(index, 1);
    }
  });
}

function mouseDragged() {
  Body.setPosition(boy.body, { x: mouseX, y: mouseY });
}

function mouseReleased() {
  boy.throwStone();
}

function stoneHitsMango(mango) {
  let distance = dist(
    mango.body.position.x,
    mango.body.position.y,
    stones[stones.length - 1].body.position.x,
    stones[stones.length - 1].body.position.y
  );
  return distance < 40;
}

class Boy {
  constructor(x, y) {
    this.body = Bodies.rectangle(x, y, 50, 50);
    this.image = boyImg;
    World.add(world, this.body);
  }

  draw() {
    let pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    image(this.image, 0, 0, 50, 50);
    pop();
  }

  throwStone() {
    let stone = new Stone(this.body.position.x, this.body.position.y);
    stones.push(stone);
  }
}

class Mango {
  constructor(x, y) {
    this.body = Bodies.circle(x, y, 20);
    this.image = mangoImg;
    World.add(world, this.body);
  }

  draw() {
    let pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    image(this.image, 0, 0, 40, 40);
    pop();
  }
}

class Tree {
  constructor(x, y) {
    this.body = Bodies.rectangle(x, y, 300, 300);
    this.image = treeImg;
    World.add(world, this.body);
  }

  draw() {
    let pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    image(this.image, 0, -150, 300, 300);
    pop();
  }
}

class Stone {
  constructor(x, y) {
    let options = {
      restitution: 0,
      friction: 1,
      density: 1,
    };
    this.body = Bodies.circle(x, y, 
