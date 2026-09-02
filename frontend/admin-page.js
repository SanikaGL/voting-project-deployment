const renderedCandidates = new Set();
document.addEventListener("DOMContentLoaded", () => {
    preloadCandidates();
    showServerInfo();

});
console.log("Frontend origin:", window.location.origin);
const socket = io();
async function showServerInfo() {
    const res = await fetch("http://127.0.0.1:5000/instance-info");

    const data = await res.json();

    document.getElementById("serverInfo").textContent =
        `Running on ${data.instanceId} | ${data.az}`;
}

async function preloadCandidates() {

    try {


        const res = await fetch("http://127.0.0.1:5000/admin-preload/preload-candidate", {
            method: "GET",
            credentials: "include"
        });
        if (res.status === 401) {
    console.log("JWT expired or no token");

    window.location.href = "admin-login.html";
    return;
}

if (res.status === 403) {
    console.log("Access denied");
    window.location.href = "admin-login.html";
    return;
}

if (!res.ok) {
    const text = await res.text();
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



socket.on("pending-candidate-event", (data) => {
    createCandidateCard(data);//candidate creation when new candiadte registers  using pub sub and web socket
})
socket.on("reject_candidate_event", (id) => {
    removecard(id);
}
)
socket.on("accept_candidate_event", (id) => {
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
    card.className = "card";
    card.id = candidate._id;

    card.innerHTML = `
    <img src="${candidate.photo}" />
    
    <div class="info">
        <div class="id">Name: ${candidate.name}</div>
        <p>${candidate.description}</p>
    </div>

    <div class="buttons">
        <button onclick="acceptCandidate('${candidate._id}')">Accept</button>
        <button onclick="rejectCandidate('${candidate._id}')">Reject</button>
    </div>
  `;

    container.prepend(card);
}
async function acceptCandidate(candidate_id){
    const res = await fetch("http://127.0.0.1:5000/candidate-approval/accept", {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            candidate_id: candidate_id
        })
    });

    const data = await res.json();

    console.log(data.message);

    if (data.message === "status updated") {
        removecard(candidate_id);
    }
};
async function rejectCandidate(candidate_id){
    fetch("http://127.0.0.1:5000/candidate-approval/reject", {
        method: "POST",
        credentials: "include",
        headers: {
                "Content-Type": "application/json"
            },
        body: JSON.stringify({
        candidate_id: candidate_id
})
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "ok") {
            removecard(candidate_id);
        }
    });
};
async function logout(){

    const res = await fetch("http://127.0.0.1:5000/admin-logout/logout", {
        method: "POST",
        credentials: "include"
    });

    const data = await res.json();

    console.log(data.message);

    if (res.ok) {
        window.location.href = "admin-login.html";
    }

    alert("logged out successfully");
};