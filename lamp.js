// 🔧 Налаштування Firebase
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
const db = firebase.database();

const lampImage = document.getElementById("lampImage");
const toggleButton = document.getElementById("toggleButton");

// 🔁 Відслідковуємо зміни в базі
db.ref("lamp/status").on("value", (snapshot) => {
  const status = snapshot.val();
  if (status === "on") {
    lampImage.src = "https://raw.githubusercontent.com/SavielGGT/Lump-status/main/ON.png";
    toggleButton.textContent = "Вимкнути";
  } else {
    lampImage.src = "https://raw.githubusercontent.com/SavielGGT/Lump-status/main/OFF.png";
    toggleButton.textContent = "Увімкнути";
  }
});

<!-- Обов'язково встав Firebase SDK перед твоїм скриптом -->
<script src="https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"></script>
<script>
  const firebaseConfig = {
    apiKey: "ТУТ_ТВОЄ",
    authDomain: "ТУТ_ТВОЄ",
    projectId: "ТУТ_ТВОЄ",
    storageBucket: "ТУТ_ТВОЄ",
    messagingSenderId: "ТУТ_ТВОЄ",
    appId: "ТУТ_ТВОЄ"
  };
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  function signUp() {
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    auth.createUserWithEmailAndPassword(email, password)
      .then(user => alert("Користувача створено!"))
      .catch(error => alert(error.message));
  }

  function signIn() {
    const email = document.getElementById("signinEmail").value;
    const password = document.getElementById("signinPassword").value;
    auth.signInWithEmailAndPassword(email, password)
      .then(user => alert("Вхід успішний!"))
      .catch(error => alert(error.message));
  }
</script>


// 📤 Кнопка змінює стан
toggleButton.addEventListener("click", () => {
  db.ref("lamp/status").once("value").then((snapshot) => {
    const current = snapshot.val();
    const newStatus = (current === "on") ? "off" : "on";
    db.ref("lamp/status").set(newStatus);
  });
});
