const board = document.getElementById("board");
const info = document.getElementById("info");
let posisi = 1;
const total = 100;
const ular = { 99: 78, 70: 55, 52: 42, 25: 5 };
const tangga = { 3: 22, 6: 25, 20: 59, 36: 75 };

function updateBoard() {
  board.innerHTML = "";
  for (let i = 1; i <= total; i++) {
    const cell = document.createElement("div");
    let isi = "";
    if (i === posisi) isi += "🧸";
    else if (ular[i]) isi += "🐍";
    else if (tangga[i]) isi += "🪜";
    cell.textContent = isi || i;
    board.appendChild(cell);
  }
}

function animasiJalan(jumlahLangkah, callback) {
  let langkah = 0;
  const jalan = setInterval(() => {
    if (langkah < jumlahLangkah && posisi < total) {
      posisi++;
      updateBoard();
      langkah++;
    } else {
      clearInterval(jalan);
      if (ular[posisi]) {
        info.textContent += ` 🐍 Turun ke ${ular[posisi]}`;
        posisi = ular[posisi];
        updateBoard();
      } else if (tangga[posisi]) {
        info.textContent += ` 🪜 Naik ke ${tangga[posisi]}`;
        posisi = tangga[posisi];
        updateBoard();
      }
      if (posisi >= total) {
        posisi = total;
        info.textContent = "🎉 Kamu Menang!";
      }
      if (callback) callback();
    }
  }, 400); // jeda antar langkah
}

function lemparDadu() {
  let dadu = Math.floor(Math.random() * 6) + 1;
  info.textContent = `🎲 Kamu dapat: ${dadu}`;
  animasiJalan(dadu);
}

document.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "l") {
    lemparDadu();
  }
});

document.getElementById("lemparBtn").addEventListener("click", lemparDadu);

updateBoard();
