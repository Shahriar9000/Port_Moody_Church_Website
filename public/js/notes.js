get_notes()

function get_notes() {
    var request = new XMLHttpRequest();
    var requestURL = '/notes/get_notes'
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        var all_notes = request.response;
        printNotes(all_notes);
    }
}

function printNotes(all_notes) {
    var table = document.getElementById("notes_table");

    for (var i in all_notes) {
        const note_id = all_notes[i].note_id;
        const title = all_notes[i].title;
        const content = all_notes[i].content;

        var note_card = document.createElement("div");
        note_card.classList.add("mb-2");

        var note_title = document.createElement("h5");
        note_title.classList.add("card-title");
        note_title.id = "note_title_" + i;
        note_title.innerHTML = title;

        var note_content = document.createElement("textarea");
        note_content.classList.add("card-text", "px-2", "mr-2", "form-control");
        note_content.id = "note_content" + i;
        note_content.setAttribute("rows", "3");
        note_content.setAttribute("disabled", "true");
        note_content.innerHTML = content;

        var update_button = document.createElement("button");
        update_button.classList.add("btn", "btn-secondary", "float-right", "mt-2", "mr-2");
        update_button.setAttribute("onclick", "openUpdateForm(" + note_id + ")");
        update_button.id = "update_note_" + i;
        update_button.innerHTML = "Update";

        var delete_button = document.createElement("button");
        delete_button.classList.add("btn", "btn-secondary", "float-right", "mt-2");
        delete_button.setAttribute("onclick", "deleteNote(" + note_id + ")");
        delete_button.id = "delete_note_" + i;
        delete_button.innerHTML = "Delete";

        note_card.appendChild(note_title);
        note_card.appendChild(note_content);
        note_card.appendChild(delete_button);
        note_card.appendChild(update_button);
        table.appendChild(note_card);
    }
}

function openUpdateForm(note_id) {

    var request = new XMLHttpRequest();
    var requestURL = '/notes/get_notes/' + note_id;
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        var note = request.response;

        document.getElementById("update_note_title").value = note[0].title;
        document.getElementById("update_note_content").value = note[0].content;
        document.getElementById("update_note_container").style.display = "block";

        document.getElementById("update_note_btn").setAttribute("onclick", "updateNote(" + note[0].note_id + ")");
        document.getElementById("close_update_note_btn").setAttribute("onclick", "closeUpdateForm()");
    }
        
}

function closeUpdateForm() {
    document.getElementById("update_note_container").style.display = "none";
}

function updateNote(note_id) {
    var form = document.getElementById("update_note_form");
    form.action = "/notes/update_note/" + note_id;
    form.submit();
    closeUpdateForm();
}

function deleteNote(note_id) {
    var form = document.getElementById("delete_note_form");
    form.action = "/notes/detele_note/" + note_id;
    form.submit();
}
