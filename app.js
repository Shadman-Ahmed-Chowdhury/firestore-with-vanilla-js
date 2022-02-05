import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  getDoc,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

// Your firebase configuration
// const firesbaseConfig={
//     Purt your credentials here.
// };
import { firebaseConfig } from "./firebase.js";

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore();

// Flag variables:
var userCount = 0;
var id;
var editing = false;

const userForm = document.getElementById("user-form");
const tableBody = document.getElementById("table-body");
if (!editing) {
  userForm.reset();
}
window.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  getUsers();
});

// Get data from firestore.
async function getUsers() {
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
            <td> 
                <button class="btn btn-info btn-edit" data-id="${doc.id}">Edit</button> 
                <button class="btn btn-danger btn-delete" data-id="${doc.id}>Delete</button> 
            </td>
        </tr>
    `;
  });

  const btnsEdit = tableBody.querySelectorAll(".btn-edit");
  btnsEdit.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      try {
        id = e.target.dataset.id;
        editing = true;
        const userData = await getDoc(doc(db, "users", id));
        const user = userData.data();
        userForm["first-name"].value = user.firstName;
        userForm["last-name"].value = user.lastName;
        userForm["email"].value = user.email;
        userForm["btn-user-form"].innerText = "Update";
      } catch (error) {
        console.log(error);
      }
    });
  });
}

userForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = userForm["first-name"];
  const lastName = userForm["last-name"];
  const email = userForm["email"];

  try {
    if (!editing) {
      // Create operation.
      await addDoc(collection(db, "users"), {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
      });
    } else {
      // Update operation.
      await updateDoc(doc(db, "users", id), {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
      });
      editing = false;
      id = "";
      userForm["btn-user-form"].innerText = "Save";
    }
    userForm.reset();
    firstName.focus();
    location.reload();
  } catch (error) {
    console.log(error);
  }
});
