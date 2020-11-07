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
        note_title.innerHTML = title;

        var note_content = document.createElement("textarea");
        note_content.classList.add("card-text", "px-2", "mr-2", "form-control");
        note_content.setAttribute("rows", "3");
        note_content.setAttribute("disabled", "true");
        note_content.innerHTML = content;

        delete_button = document.createElement("button");
        delete_button.classList.add("btn", "btn-secondary", "float-right", "mt-2");
        delete_button.setAttribute("onclick", "deleteNote(" + note_id + ")");
        delete_button.id = "delete_note";
        delete_button.innerHTML = "Delete";

        note_card.appendChild(note_title);
        note_card.appendChild(note_content);
        note_card.appendChild(delete_button);
        table.appendChild(note_card);
    }
}

function deleteNote(note_id) {
    var form = document.getElementById("delete_note_form")
    form.action = form.action + note_id;
    form.submit();
}
