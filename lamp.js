document.addEventListener("DOMContentLoaded", () => {
  
const firebaseConfig = {
  apiKey: "AIzaSyBmWJow_9tpnOid4mPhiZBcIfNTdrpvuyA",
  authDomain: "lamp-control-fc1db.firebaseapp.com",
  databaseURL: "https://lamp-control-fc1db-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lamp-control-fc1db",
  storageBucket: "lamp-control-fc1db.firebasestorage.app",
  messagingSenderId: "281052206161",
  appId: "1:281052206161:web:c3209e52f10e8ea3351470"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

const authDiv = document.getElementById("auth");
const controlDiv = document.getElementById("control");
const lampImg = document.getElementById("lampImage");

const lampOnURL = "https://raw.githubusercontent.com/SavielGGT/Lump-status/main/ON.png";
const lampOffURL = "https://raw.githubusercontent.com/SavielGGT/Lump-status/main/OFF.png";

function updateLamp(state) {
  lampImg.src = (state === "on") ? lampOnURL : lampOffURL;
}

function toggleLamp() {
  db.ref("lampState").once("value").then(snapshot => {
    const currentState = snapshot.val();
    const newState = (currentState === "on") ? "off" : "on";
    db.ref("lampState").set(newState);
  });
}

function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    
    .catch(error => {
      alert("Помилка реєстрації " );
    });
}

// Вхід
function signin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    
    .catch(error => {
      alert("Помилка входу ");
    });
}

function logout() {
  auth.signOut();
}

auth.onAuthStateChanged(user => {
  if (user) {
    authDiv.style.display = "none";
    controlDiv.style.display = "block";
    db.ref("lampState").on("value", snapshot => {
      updateLamp(snapshot.val());
    });
  } else {
    controlDiv.style.display = "none";
    authDiv.style.display = "block";
  }
});

 window.signup = signup;
window.signin = signin;
window.toggleLamp = toggleLamp;
window.logout = logout;
 
  
});
