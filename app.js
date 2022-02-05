import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

// Your firebase configuration
// const firesbaseConfig={
//     Purt your credentials here.
// };
import { firebaseConfig } from "./firebase.js";

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore();

const tableBody = document.getElementById("table-body");
var userCount = 0;
window.addEventListener("DOMContentLoaded", async (event) => {
  console.log("DOM fully loaded and parsed");
  // Get data from firestore.
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
    const user = doc.data();
    userCount++;
    tableBody.innerHTML += `
        <tr>
            <td> ${userCount} </td>
            <td> ${user.firstName} </td>
            <td> ${user.lastName} </td>
            <td> ${user.email} </td>
        </tr>
    `;
  });
});
