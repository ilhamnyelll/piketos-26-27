/* =====================================================
   KONFIGURASI PILKETOS
===================================================== */

const CONFIG = {

  DPT: 100,

  ADMIN_PASSWORD: "admin123",

  candidates: [

    {
      no: 1,
      ketua: "Andi Pratama",
      wakil: "Siti Aulia",

      foto: "https://placehold.co/500x500/6c5ce7/ffffff?text=PASLON+1",

      visi:
        "Mewujudkan OSIS yang aktif, kreatif, berprestasi, dan menjadi wadah aspirasi seluruh siswa.",

      misi: [
        "Mengembangkan kegiatan siswa yang kreatif.",
        "Meningkatkan prestasi akademik dan non-akademik.",
        "Membangun budaya sekolah yang positif."
      ]
    },

    {
      no: 2,
      ketua: "Bima Saputra",
      wakil: "Nadia Putri",

      foto: "https://placehold.co/500x500/a855f7/ffffff?text=PASLON+2",

      visi:
        "Membangun OSIS yang inovatif, inklusif, dan mampu memberikan ruang bagi kreativitas siswa.",

      misi: [
        "Meningkatkan kegiatan ekstrakurikuler.",
        "Membuka ruang aspirasi siswa.",
        "Mengadakan program sosial dan edukatif."
      ]
    },

    {
      no: 3,
      ketua: "Raka Wijaya",
      wakil: "Dinda Maharani",

      foto: "https://placehold.co/500x500/0891b2/ffffff?text=PASLON+3",

      visi:
        "Menciptakan organisasi siswa yang aspiratif, transparan, dan bertanggung jawab.",

      misi: [
        "Menampung dan menyampaikan aspirasi siswa.",
        "Meningkatkan kolaborasi antarorganisasi.",
        "Menciptakan kegiatan siswa yang bermanfaat."
      ]
    }

  ]

};


/* =====================================================
   STORAGE
===================================================== */

function getLogs(){

  return JSON.parse(
    localStorage.getItem("pilketos_logs") || "[]"
  );

}

function saveLogs(logs){

  localStorage.setItem(
    "pilketos_logs",
    JSON.stringify(logs)
  );

}


/* =====================================================
   VOTING
===================================================== */

let currentVoter = null;
let selectedCandidate = null;


function loginVoter(){

  const input =
    document.getElementById("voterId");

  if(!input) return;

  const id =
    input.value.trim();

  const msg =
    document.getElementById("loginMsg");

  if(!id){

    msg.innerHTML =
      `<div class="alert alert-danger mt-3">
        NISN / Token wajib diisi.
      </div>`;

    return;
  }

  const logs = getLogs();

  const alreadyVoted =
    logs.some(
      item => item.voterId === id
    );

  if(alreadyVoted){

    msg.innerHTML =
      `<div class="alert alert-warning mt-3">
        ⚠️ NISN / Token ini sudah digunakan.
      </div>`;

    return;
  }

  currentVoter = id;

  const login =
    document.getElementById("login");

  const vote =
    document.getElementById("voteSection");

  if(login) login.classList.add("d-none");

  if(vote){

    vote.classList.remove("d-none");

    renderCandidates();

    vote.scrollIntoView({
      behavior:"smooth"
    });

  }

}


/* =====================================================
   CANDIDATE
===================================================== */

function renderCandidates(){

  const container =
    document.getElementById("candidateList");

  if(!container) return;

  container.innerHTML =
    CONFIG.candidates.map(
      candidate => `

      <div class="col-lg-4 col-md-6">

        <div class="candidate-card">

          <div class="candidate-number">
            ${candidate.no}
          </div>

          <div class="text-center">

            <img
              src="${candidate.foto}"
              class="candidate-photo"
              alt="Paslon ${candidate.no}"
            >

            <div class="candidate-name">
              ${candidate.ketua}
              <br>
              <small>& ${candidate.wakil}</small>
            </div>

          </div>

          <div class="vision-box">

            <strong>💡 Visi</strong>

            <p class="mb-0 mt-2">
              ${candidate.visi}
            </p>

          </div>

          <strong>🎯 Misi</strong>

          <ul class="mission-list mt-2">

            ${candidate.misi
              .map(
                mission =>
                  `<li>${mission}</li>`
              )
              .join("")}

          </ul>

          <button
            onclick="openConfirm(${candidate.no})"
            class="btn btn-primary w-100 mt-3">

            Pilih Paslon ${candidate.no}
            →

          </button>

        </div>

      </div>

      `
    ).join("");

}


/* =====================================================
   CONFIRMATION
===================================================== */

function openConfirm(no){

  selectedCandidate =
    CONFIG.candidates.find(
      c => c.no === no
    );

  const element =
    document.getElementById(
      "confirmCandidate"
    );

  element.innerHTML = `

    <div class="candidate-number mx-auto mb-3">
      ${selectedCandidate.no}
    </div>

    <h3>
      ${selectedCandidate.ketua}
      <br>
      <small>& ${selectedCandidate.wakil}</small>
    </h3>

  `;

  const modal =
    new bootstrap.Modal(
      document.getElementById(
        "confirmModal"
      )
    );

  modal.show();

}


/* =====================================================
   SAVE VOTE
===================================================== */

function confirmVote(){

  if(
    !currentVoter ||
    !selectedCandidate
  ) return;

  const logs = getLogs();

  if(
    logs.some(
      x => x.voterId === currentVoter
    )
  ) return;

  logs.push({

    voterId:
      currentVoter,

    candidate:
      selectedCandidate.no,

    timestamp:
      new Date().toISOString()

  });

  saveLogs(logs);

  const modal =
    bootstrap.Modal.getInstance(
      document.getElementById(
        "confirmModal"
      )
    );

  if(modal) modal.hide();

  setTimeout(() => {

    const vote =
      document.getElementById(
        "voteSection"
      );

    const thank =
      document.getElementById(
        "thankSection"
      );

    if(vote)
      vote.classList.add("d-none");

    if(thank){

      thank.classList.remove("d-none");

      thank.scrollIntoView({
        behavior:"smooth"
      });

    }

    updateHeroStats();

  },300);

}


/* =====================================================
   HERO STATISTICS
===================================================== */

function updateHeroStats(){

  const logs =
    getLogs();

  const dpt =
    document.getElementById(
      "heroDpt"
    );

  const votes =
    document.getElementById(
      "heroVotes"
    );

  if(dpt)
    dpt.textContent =
      CONFIG.DPT;

  if(votes)
    votes.textContent =
      logs.length;

}


/* =====================================================
   PUBLIC RESULTS
===================================================== */

function renderPublicResults(){

  const container =
    document.getElementById(
      "publicResults"
    );

  if(!container) return;

  const logs =
    getLogs();

  const total =
    logs.length;

  const dpt =
    CONFIG.DPT;

  const participation =
    dpt > 0
      ? (total / dpt) * 100
      : 0;

  const resultDpt =
    document.getElementById(
      "resultDpt"
    );

  const resultVotes =
    document.getElementById(
      "resultVotes"
    );

  const resultParticipation =
    document.getElementById(
      "resultParticipation"
    );

  const participationText =
    document.getElementById(
      "participationText"
    );

  const participationBar =
    document.getElementById(
      "participationBar"
    );

  if(resultDpt)
    resultDpt.textContent =
      dpt;

  if(resultVotes)
    resultVotes.textContent =
      total;

  if(resultParticipation)
    resultParticipation.textContent =
      participation.toFixed(1) + "%";

  if(participationText)
    participationText.textContent =
      participation.toFixed(1) + "%";

  if(participationBar)
    participationBar.style.width =
      Math.min(participation,100) + "%";


  container.innerHTML =
    CONFIG.candidates.map(
      candidate => {

        const votes =
          logs.filter(
            x =>
              x.candidate ===
              candidate.no
          ).length;

        const percentage =
          total > 0
            ? (votes / total) * 100
            : 0;

        return `

        <div class="col-lg-4">

          <div class="result-candidate">

            <div class="d-flex align-items-center gap-3">

              <div class="result-number">
                ${candidate.no}
              </div>

              <div>

                <strong>
                  Paslon ${candidate.no}
                </strong>

                <div class="text-muted">
                  ${candidate.ketua}
                  & ${candidate.wakil}
                </div>

              </div>

            </div>

            <div class="d-flex justify-content-between mt-4">

              <strong>
                ${votes} suara
              </strong>

              <strong>
                ${percentage.toFixed(1)}%
              </strong>

            </div>

            <div class="result-bar">

              <div
                style="width:${percentage}%">
              </div>

            </div>

          </div>

        </div>

        `;

      }
    ).join("");


  const update =
    document.getElementById(
      "lastUpdate"
    );

  if(update){

    update.textContent =
      new Date().toLocaleTimeString(
        "id-ID"
      );

  }

}


/* =====================================================
   ADMIN LOGIN
===================================================== */

function adminLogin(){

  const input =
    document.getElementById(
      "adminPassword"
    );

  const msg =
    document.getElementById(
      "admin
