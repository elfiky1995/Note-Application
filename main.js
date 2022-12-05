const addBox = document.querySelector(".add-box"),
    popupBox = document.querySelector(".popup-box"),
    popupBoxTitle = popupBox.querySelector(".content header p"),
    closeAddNoteIcon = popupBox.querySelector("header i"),
    title = popupBox.querySelector(".title input"),
    description = popupBox.querySelector(".description textarea"),
    addButton = popupBox.querySelector("button");

//Create Array For Months to turn the number [index] of months to names
const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

//getting localStorage notes if exists and parsing them to the object
//else passing an empty array to notes.
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

let isUpdate = false,
    updateId;

//open popup box to create the note
addBox.addEventListener("click", () => {
    title.focus();
    popupBox.classList.add("show");
});

//close popeup to cancel the note
closeAddNoteIcon.addEventListener("click", () => {
    isUpdate = false;
    title.value = "";
    description.value = "";
    addButton.innerHTML = "Add Note";
    popupBoxTitle.innerHTML = "Add a New Note";
    popupBox.classList.remove("show");
});

//function to add localstorage obeject data to the body of page
function showNotes() {
    //remove all previous notes before adding new
    document.querySelectorAll(".note").forEach(note => note.remove());
    notes.forEach((note, index) => {
        let li = `
            <li class="note">
                <div class="details">
                    <p>${note.title}</p>
                    <span>${note.description}</span>
                </div>
                <div class="bottom-content">
                    <span>${note.date}</span>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="menu">
                            <li onclick= "updateNote(${index}, '${note.title}', '${note.description}')"><i class="uil uil-edit">Edit</i></li>
                            <li onclick="deleteNote(${index})"><i class="uil uil-trash">Delete</i></li>
                        </ul>
                    </div>
                </div>
            </li>
        `;
        addBox.insertAdjacentHTML("afterend", li);
    });
};
showNotes();

//showing the note option menu
function showMenu(ele) {
    ele.parentElement.classList.add("show");

    document.addEventListener("click", e => {
        //removing (.show) class from the settings menu on document click
        if (e.target.tagName != "I" || e.target != ele) {
            ele.parentElement.classList.remove("show");
        }
    });
};

//deleting the note by clicking on option (delete)
function deleteNote(noteId) {
    let deleteConfirmation = confirm("Are you sure that you want to delete this note?");
    if (!deleteConfirmation) return;
    notes.splice(noteId, 1); //remove selected note from array
    localStorage.setItem("notes", JSON.stringify(notes)); //save updated notes to local storage
    showNotes();
};

//editing the note by clicking on option (edit)
function updateNote(noteId, subTitle, subDescription) {
    isUpdate = true;
    updateId = noteId
    addBox.click();
    title.value = subTitle;
    description.value = subDescription;
    addButton.innerHTML = "Update Note";
    popupBoxTitle.innerHTML = "Edit Note";
    console.log(noteId, title, description);

}
addButton.addEventListener("click", (e) => {
    //prevent default of button to avoid auto close when button clicked
    e.preventDefault();
    //save the values of inputs in variables to make it easier to use
    let noteTitle = title.value,
        noteDescription = description.value;

    if (noteTitle || noteDescription) {
        //getting day, month and year from current dateObject
        let date = new Date(),
            day = date.getDate(),
            month = months[date.getMonth()],
            year = date.getFullYear();

        let noteDetails = {
            title: noteTitle,
            description: noteDescription,
            date: `${month} ${day}, ${year}.`,
        }

        if (!isUpdate) {
            notes.push(noteDetails); //adding new note to notes[]
        } else {
            isUpdate = false;
            notes[updateId] = noteDetails; //update speecified note
        }

        //passing the (noteDetails) object to local storage
        localStorage.setItem("notes", JSON.stringify(notes));

        //close popup after adding the note
        closeAddNoteIcon.click();
        showNotes();
    };
});