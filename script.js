const board = document.getElementById("board");
const info = document.getElementById("info");
const giliranText = document.getElementById("giliran");
const daduDiv = document.getElementById("dadu");

let posisi = [1, 1]; // posisi pemain 1 dan 2
let giliran = 0; // 0 = pemain 1, 1 = pemain 2
const total = 100;
const ular = { 99: 78, 70: 55, 52: 42, 25: 5 };
const tangga = { 3: 22, 6: 25, 20: 59, 36: 75 };
const emojiPemain = ["🧸", "🐼"];

function updateBoard() {
  board.innerHTML = "";
  for (let i = 1; i <= total; i++) {
    const cell = document.createElement("div");
    let isi = "";
    if (posisi[0] === i) isi += "🧸";
    if (posisi[1] === i) isi += "🐼";
    if (!isi) {
      if (ular[i]) isi = "🐍";
      else if (tangga[i]) isi = "🪜";
      else isi = i;
    }
    cell.textContent = isi;
    board.appendChild(cell);
  }
}

function animasiDadu(callback) {
  let hitung = 0;
  const anim = setInterval(() => {
    let angkaAcak = Math.floor(Math.random() * 6) + 1;
    daduDiv.textContent = ["⚀","⚁","⚂","⚃","⚄","⚅"][angkaAcak - 1];
    hitung++;
    if (hitung >= 10) {
      clearInterval(anim);
      callback(angkaAcak);
    }
  }, 100);
}

function animasiJalan(jumlahLangkah, callback) {
  let langkah = 0;
  const jalan = setInterval(() => {
    if (langkah < jumlahLangkah && posisi[giliran] < total) {
      posisi[giliran]++;
      updateBoard();
      langkah++;
    } else {
      clearInterval(jalan);
      if (ular[posisi[giliran]]) {
        posisi[giliran] = ular[posisi[giliran]];
        info.textContent += ` 🐍 Turun ke ${posisi[giliran]}`;
        updateBoard();
      } else if (tangga[posisi[giliran]]) {
        posisi[giliran] = tangga[posisi[giliran]];
        info.textContent += ` 🪜 Naik ke ${posisi[giliran]}`;
        updateBoard();
      }
      if (posisi[giliran] >= total) {
        posisi[giliran] = total;
        updateBoard();
        info.textContent = `🎉 ${emojiPemain[giliran]} Menang!`;
        document.getElementById("lemparBtn").disabled = true;
        return;
      }
      giliran = 1 - giliran;
      giliranText.textContent = `Giliran: ${emojiPemain[giliran]} Pemain ${giliran + 1}`;
      if (callback) callback();
    }
  }, 400);
}

function lemparDadu() {
  info.textContent = `🎲 Lempar dadu untuk ${emojiPemain[giliran]}`;
  animasiDadu(dadu => {
    info.textContent = `${emojiPemain[giliran]} dapat: ${dadu}`;
    animasiJalan(dadu);
  });
}

document.getElementById("lemparBtn").addEventListener("click", lemparDadu);
document.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "l") {
    lemparDadu();
  }
});

updateBoard();
giliranText.textContent = `Giliran: ${emojiPemain[giliran]} Pemain 1`;
