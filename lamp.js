document.addEventListener("DOMContentLoaded", () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBmWJow_9tpnOid4mPhiZBcIfNTdrpvuyA",
    authDomain: "lamp-control-fc1db.firebaseapp.com",
    databaseURL: "https://lamp-control-fc1db-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "lamp-control-fc1db",
    storageBucket: "lamp-control-fc1db.appspot.com",
    messagingSenderId: "281052206161",
    appId: "1:281052206161:web:c3209e52f10e8ea3351470"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.database();

  const authDiv = document.getElementById("auth");
  const lampIdInputDiv = document.getElementById("lampIdInput");
  const controlDiv = document.getElementById("control");
  const lampImg = document.getElementById("lampImage");

  const lampOnURL = "https://raw.githubusercontent.com/SavielGGT/Lump-status/main/ON.png";
  const lampOffURL = "https://raw.githubusercontent.com/SavielGGT/Lump-status/main/OFF.png";

  let lampRef = null;

  function showModal(message) {
    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modalMessage");
    const modalClose = document.getElementById("modalClose");

    modalMessage.textContent = message;
    modal.classList.remove("hidden");

    modalClose.onclick = () => {
      modal.classList.add("hidden");
    };

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.classList.add("hidden");
      }
    };
  }

  function updateLamp(state) {
    lampImg.src = (state === "on") ? lampOnURL : lampOffURL;
  }

  window.toggleLamp = function () {
    if (!lampRef) return;
    lampRef.once("value").then(snapshot => {
      const currentState = snapshot.val();
      const newState = (currentState === "on") ? "off" : "on";
      lampRef.set(newState);
    });
  };

  window.signup = function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.createUserWithEmailAndPassword(email, password)
      .catch(error => {
        showModal("Помилка при реєстрації: " + error.message);
      });
  };

  window.signin = function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        showModal("Помилка входу: " + error.message);
      });
  };

  window.logout = function () {
    auth.signOut();
  };

  window.connectToLamp = function () {
    const lampId = document.getElementById("lampId").value.trim();
    if (!lampId) {
      showModal("Будь ласка, введіть ID лампочки.");
      return;
    }

    lampRef = db.ref("lamps/" + lampId);
    lampIdInputDiv.classList.add("hidden");
    controlDiv.classList.remove("hidden");

    lampRef.on("value", (snapshot) => {
      const state = snapshot.val() || "off";
      updateLamp(state);
    });
  };

  // Слухаємо зміну авторизації
  auth.onAuthStateChanged(user => {
    if (user) {
      // Після входу показуємо поле для вводу ID лампочки
      authDiv.classList.add("hidden");
      lampIdInputDiv.classList.remove("hidden");
      controlDiv.classList.add("hidden");
    } else {
      // Показуємо тільки авторизацію
      authDiv.classList.remove("hidden");
      lampIdInputDiv.classList.add("hidden");
      controlDiv.classList.add("hidden");

      if (lampRef) lampRef.off();
      lampRef = null;
    }
  });
});
