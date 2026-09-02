const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login-voter.html";
}

async function loadDashboard() {
  const res = await fetch("http://your-ec2/api/voter-data", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  if (!res.ok) {
    alert("Unauthorized");
    window.location.href = "login-voter.html";
    return;
  }

  // render data
  document.getElementById("email").innerText = data.email;
}

loadDashboard();