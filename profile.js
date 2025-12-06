document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form from refreshing page

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Dummy check (for now)
  if (email === "anjali@example.com" && password === "123456") {
    alert("Login successful!");
    localStorage.setItem("userEmail", email);
    window.location.href = "profile.html"; // Redirect to profile page
  } else {
    alert("Invalid credentials! Please try again.");
  }
});