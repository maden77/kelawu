const board = document.getElementById("board");
const info = document.getElementById("info");
const giliranText = document.getElementById("giliran");
const daduDiv = document.getElementById("dadu");
const tombolLempar = document.getElementById("lemparBtn");

let posisi = [1, 1];
let giliran = 0;
const total = 100;
const ular = { 99: 78, 70: 55, 52: 42, 25: 5 };
const tangga = { 3: 22, 6: 25, 20: 59, 36: 75 };
const emojiPemain = ["🧸", "🐼"];

let nama = ["", ""];
let skor = [0, 0];
let pemainLokal = 0;

// 🎲 Fungsi: ambil & simpan skor
function loadSkor() {
  const data = JSON.parse(localStorage.getItem("skorUlarTangga"));
  if (data) skor = data;
}

function simpanSkor() {
  localStorage.setItem("skorUlarTangga", JSON.stringify(skor));
}

function tampilkanSkor() {
  const skorText = `🏆 Skor ${emojiPemain[0]} ${nama[0]}: ${skor[0]} | ${emojiPemain[1]} ${nama[1]}: ${skor[1]}`;
  document.getElementById("skor").textContent = skorText;
}

// 🙋 Fungsi: setup nama & pemain lokal
function setupNama() {
  nama[0] = prompt("Masukkan nama Pemain 1 (🧸):", "Budi") || "Pemain 1";
  nama[1] = prompt("Masukkan nama Pemain 2 (🐼):", "Sari") || "Pemain 2";
  const siapa = prompt(`Kamu siapa?\n1. ${nama[0]} (🧸)\n2. ${nama[1]} (🐼)`, "1");
  pemainLokal = siapa === "2" ? 1 : 0;
  updateGiliranUI();
  tombolLempar.disabled = giliran !== pemainLokal;
}

// 🧱 Fungsi: update papan
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

// 🎲 Fungsi: animasi dadu acak
function animasiDadu(callback) {
  let hitung = 0;
  const anim = setInterval(() => {
    let angkaAcak = Math.floor(Math.random() * 6) + 1;
    daduDiv.textContent = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][angkaAcak - 1];
    hitung++;
    if (hitung >= 10) {
      clearInterval(anim);
      callback(angkaAcak);
    }
  }, 100);
}

// 🚶 Fungsi: animasi langkah demi langkah
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
        info.textContent = `🎉 ${emojiPemain[giliran]} ${nama[giliran]} Menang!`;
        skor[giliran]++;
        simpanSkor();
        tampilkanSkor();
        tombolLempar.disabled = true;
        return;
      }
      if (callback) callback(); // lanjutkan ke logika giliran
    }
  }, 400);
}

// 🔁 Fungsi: lempar dadu
function lemparDadu() {
  if (giliran !== pemainLokal) {
    alert("⛔ Bukan giliran kamu!");
    return;
  }

  tombolLempar.disabled = true;
  info.textContent = `🎲 Lempar dadu untuk ${emojiPemain[giliran]} ${nama[giliran]}...`;
  animasiDadu(dadu => {
    info.textContent = `${emojiPemain[giliran]} ${nama[giliran]} dapat: ${dadu}`;
    animasiJalan(dadu, () => {
      if (dadu === 6) {
        info.textContent += " 🎉 Dapat 6! Giliran lagi!";
        tombolLempar.disabled = false;
      } else {
        giliran = 1 - giliran;
        updateGiliranUI();
        tombolLempar.disabled = giliran !== pemainLokal;
      }
    });
  });
}

// 🧭 Fungsi: update UI giliran
function updateGiliranUI() {
  giliranText.textContent =
    `Giliran: ${emojiPemain[giliran]} ${nama[giliran]} | 👤 Kamu: ${nama[pemainLokal]} (${emojiPemain[pemainLokal]})`;
}

// ▶️ Inisialisasi game
updateBoard();
loadSkor();
setupNama();
tampilkanSkor();

document.getElementById("lemparBtn").addEventListener("click", lemparDadu);
document.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "l") lemparDadu();
});
