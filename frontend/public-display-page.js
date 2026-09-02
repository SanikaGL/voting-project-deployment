document.addEventListener("DOMContentLoaded", () => {
    preloadCandidates();
});
console.log("Frontend origin:", window.location.origin);
const socket = io();
async function preloadCandidates() {

    try {


        const res = await fetch("http://127.0.0.1:5000/public-page-data", {
            method: "GET"
        });
        if (!res.ok) {
            const text = await res.text();
            alert(text);
            console.log("Error response:", text);
            return;
        }
        // credentials: "include"


        const candidates = await res.json();
        candidates.forEach(candidate => {
            createCandidateCard(candidate);
        });
        console.log("Status:", res.status);

        console.log(candidates);

    } catch (error) {
        console.log(error);
    }

}


const renderedCandidates = new Set();
socket.on("approved_candidate_event", (id)=>{
    createCandidateCard
}
)
socket.on("reject_candidate_event", (id) => {
    removecard(id);
}
)


function removecard(id) {
    const card = document.getElementById(id);
    if (card) {
        card.remove();
        renderedCandidates.delete(id);
    }
}





function createCandidateCard(candidate) {
    if (renderedCandidates.has(candidate._id)) {
        return;
    }

    renderedCandidates.add(candidate._id);

    const container = document.getElementById("candidateContainer");

    const card = document.createElement("div");
    card.className = "candidate-card";
    card.id = candidate._id;

    card.innerHTML = `
        <img src="${candidate.key}" alt="${candidate.name}" class="candidate-img" />

        <div class="candidate-info">
            <h3>${candidate.name}</h3>
            <p>${candidate.description}</p>
            <p class="vote-count">Votes: ${candidate.voteCount || 0}</p>
        </div>
    `;

    container.prepend(card);
}