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
  const lampIdInput = document.getElementById("lampIdInput");

  const lampOnURL = "https://raw.githubusercontent.com/SavielGGT/Lump-status/main/ON.png";
  const lampOffURL = "https://raw.githubusercontent.com/SavielGGT/Lump-status/main/OFF.png";

  let lampRef = null;

  function showModal(message) {
    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modalMessage");
    const modalClose = document.getElementById("modalClose");

    modalMessage.textContent = message;
    modal.classList.remove("hidden");

    modalClose.onclick = () => modal.classList.add("hidden");
    window.onclick = (e) => { if (e.target === modal) modal.classList.add("hidden"); };
  }

  function updateLamp(state) {
    lampImg.src = (state === "on") ? lampOnURL : lampOffURL;
  }

  function toggleLamp() {
    if (!lampRef) return;
    lampRef.once("value").then(snapshot => {
      const currentState = snapshot.val();
      const newState = (currentState === "on") ? "off" : "on";
      lampRef.set(newState);
    });
  }

  function connectToLamp() {
    const lampId = lampIdInput.value.trim();
    if (!lampId) {
      showModal("Введіть ID лампочки.");
      return;
    }

    if (lampRef) lampRef.off();
    lampRef = db.ref("lamps/" + lampId);

    lampRef.on("value", snapshot => {
      const state = snapshot.val() || "off";
      updateLamp(state);
    });
  }

  function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.createUserWithEmailAndPassword(email, password)
      .catch(error => {
        showModal("Помилка реєстрації: перевірте email або пароль (не менше 6 символів).");
      });
  }

  function signin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        showModal("Помилка входу: перевірте email або пароль.");
      });
  }

  function logout() {
    auth.signOut();
  }

  auth.onAuthStateChanged(user => {
    if (user) {
      authDiv.style.display = "none";
      controlDiv.style.display = "block";
    } else {
      controlDiv.style.display = "none";
      authDiv.style.display = "block";
      if (lampRef) lampRef.off();
      lampRef = null;
    }
  });

  window.signup = signup;
  window.signin = signin;
  window.toggleLamp = toggleLamp;
  window.logout = logout;
  window.setLampId = setLampId;
});
