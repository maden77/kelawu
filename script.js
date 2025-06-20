const board = document.getElementById("board");
const info = document.getElementById("info");
let posisi = 0;
const total = 100;
const ular = { 99: 78, 70: 55, 52: 42, 25: 5 };
const tangga = { 3: 22, 6: 25, 20: 59, 36: 75 };

function updateBoard() {
  board.innerHTML = "";
  for (let i = 1; i <= total; i++) {
    const cell = document.createElement("div");
    let isi = "";
    if (i === posisi) isi += "🎯";
    else if (ular[i]) isi += "🐍";
    else if (tangga[i]) isi += "🪜";
    cell.textContent = isi || i;
    board.appendChild(cell);
  }
}

function lemparDadu() {
  let dadu = Math.floor(Math.random() * 6) + 1;
  info.textContent = `🎲 Kamu dapat: ${dadu}`;
  posisi += dadu;
  if (ular[posisi]) {
    info.textContent += ` 🐍 Turun ke ${ular[posisi]}`;
    posisi = ular[posisi];
  } else if (tangga[posisi]) {
    info.textContent += ` 🪜 Naik ke ${tangga[posisi]}`;
    posisi = tangga[posisi];
  }
  if (posisi >= total) {
    posisi = total;
    info.textContent = "🎉 Kamu Menang!";
  }
  updateBoard();
}

document.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "l") {
    lemparDadu();
  }
});

updateBoard();
