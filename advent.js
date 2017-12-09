if (window.location.hash == "#reset") {
  localStorage.removeItem("advent_open");
  window.location.hash="";
}

/**
 * load the randomised order from local storage, if it has been set.
 * and if it's not set, create and store it.
 */
let order = JSON.parse(localStorage.getItem("advent_order"));
if (!order) {
  order = [];
  for (let i=0; i<24; i+=1) order[i]=Math.floor(Math.random()*10000);
  localStorage.setItem("advent_order", JSON.stringify(order));
}

/**
 * load the list of open windows, if it has been set.
 * and if it's not set, create and store it.
 */
let open = JSON.parse(localStorage.getItem("advent_open"));
if (!open) {
  open = [];
  localStorage.setItem("advent_open", JSON.stringify(open));
}

/*
 * Create 24 boxes, one for each day of advent
 */
for (let i = 1; i<=24; i++) {
  prepareDoor(i);
}


function prepareDoor(i) {
  let frag = document.importNode(window.door.content, true);
  let box = frag.children[0];
  let door = box.querySelector(".door")

  box.id=`door${i}`;
  box.style=`order: ${order[i-1]}`;
  box.querySelector(".pic").src = `i/${i}.jpg`;

  door.textContent = i;
  door.dataset.door = i;

  if (open.includes(i)) {
    door.classList.add('open');
  }

  door.addEventListener('click', doorClicked);
  window.advent.appendChild(frag);
}


function doorClicked(e) {
  let doorNumber = parseInt(e.target.dataset.door);
  if (doorNumber <= new Date().getDate()) {
    if (!open.includes(doorNumber)) {
      new Audio(`a/${doorNumber}.ogg`).play();
      open.push(doorNumber);
      e.target.classList.add('open');
    }
    localStorage.setItem("advent_open", JSON.stringify(open));
  }
}

function adjustDoorBackgrounds() {
  for (let i = 1; i<25; i++) {
    let inDoc = document.querySelector("#door"+i)
    let rect = inDoc.getBoundingClientRect();
    // acount for border width
    inDoc.querySelector(".door").setAttribute("style", `background-position: -${rect.x+1}px -${rect.y+1}px `);
  }
}

adjustDoorBackgrounds();

window.addEventListener('resize', adjustDoorBackgrounds);
