import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getFirestore, collection, getDocs, doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCpMvEzjvLYQKjUT2rN94jhVY5hHhQoyCk",
  authDomain: "muganga-app.firebaseapp.com",
  projectId: "muganga-app",
  storageBucket: "muganga-app.appspot.com",
  messagingSenderId: "964462059443",
  appId: "1:964462059443:web:e3e90226251b584db3079e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Wait for auth state
onAuthStateChanged(auth, async user => {
  if (!user) {
    // Let Firebase settle before redirecting
    setTimeout(() => {
      alert("You must be logged in.");
      window.location.href = "/login.html";
    }, 300);
    return;
  }

  try {
    const userDocRef = doc(db, "admins", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      alert("Access denied. You are not an admin.");
      await signOut(auth);
      window.location.href = "/login.html";
      return;
    }

    // User is admin: Proceed to load dashboard
    document.getElementById("loading").innerHTML = "";
    loadOverview(); // Optional: Or whichever is default
    // optionally show admin info
    const name = userDoc.data().name || "Admin";
    document.getElementById("adminName").innerText = name;

  } catch (error) {
    console.error("Error checking admin:", error);
    alert("Unexpected error. Please try again.");
  }
});

// Logout handler
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "/login.html";
  } catch (error) {
    console.error("Logout error:", error);
    alert("Failed to logout.");
  }
});

// Dummy function to load dashboard data
function loadOverview() {
  document.getElementById("content").innerHTML = "<h2>Welcome to Admin Dashboard</h2>";
}
