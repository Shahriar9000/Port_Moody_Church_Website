get_all_sermons();

function activeAllSermons() {
    document.getElementById("subRecording").style.display = "block";
    document.getElementById("sermonsNotes").style.display = "none";

    document.getElementById("allSermonNav").classList.add("active");
    document.getElementById("sermonNoteNav").classList.remove("active");

}

function activeSermonsNote() {
    document.getElementById("subRecording").style.display = "none";
    document.getElementById("sermonsNotes").style.display = "block";

    document.getElementById("sermonNoteNav").classList.add("active");
    document.getElementById("allSermonNav").classList.remove("active");

}

function get_all_sermons() {
    var request = new XMLHttpRequest();
    var requestURL = '/sermons/get_sermons'
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        var all_sermons = request.response;
        displaySermons(all_sermons);
    }
}

function displaySermons(all_sermons) {
    var table = document.getElementById("sermons_table");

    if (Object.keys(all_sermons).length == 0) {
        var msg = document.createElement("h5");
        msg.style.margin = "5px auto";
        msg.innerHTML = "No sermons available. Please go to More Sermons.";
        table.appendChild(msg);
    }

    for (var i in all_sermons) {
        const sermon_id = all_sermons[i].sermon_id;
        const file_name = all_sermons[i].file_name;

        var sermon_card = document.createElement("div");
        sermon_card.classList.add("m-2");

        var sermon_name = document.createElement("h5");
        sermon_name.classList.add("card-title");
        sermon_name.id = "sermon_name" + i;
        sermon_name.innerHTML = "Sermon " + sermon_id + ": " + file_name;

        var sermon_audio = document.createElement("audio");
        sermon_audio.setAttribute("controls", "true");
        sermon_audio.innerHTML = "Your browser does not support the audio element.";

        var sermon_source = document.createElement("source");
        sermon_source.setAttribute("src", "../sermons/"+file_name);
        sermon_source.setAttribute("type", "audio/mpeg");

        sermon_audio.appendChild(sermon_source);

        var show_button = document.createElement("button");
        show_button.classList.add("btn", "btn-secondary", "float-right", "m-2");
        show_button.setAttribute("onclick", "open_display_note_form(" + sermon_id + ")");
        show_button.id = "show_note_" + i;
        show_button.innerHTML = "See Notes";

        var add_button = document.createElement("button");
        add_button.classList.add("btn", "btn-secondary", "float-right", "m-2");
        add_button.setAttribute("onclick", "open_add_note_form(" + sermon_id + ")");
        add_button.id = "add_note_" + i;
        add_button.innerHTML = "Add Notes";

        sermon_card.appendChild(sermon_name);
        sermon_card.appendChild(sermon_audio);
        sermon_card.appendChild(show_button);
        sermon_card.appendChild(add_button);
        table.appendChild(sermon_card);
    }
}


function open_display_note_form(sermon_id) {
    // in case add form is open
    closeAddForm();

    document.getElementById("display_sermon_note_container").style.display = "block";
    document.getElementById("display_sermon_note_header").innerHTML = "Notes for Sermon ID: " + sermon_id;

    // empty the table before diplaying notes
    var notes_table = document.getElementById("display_sermon_note_table");
    while (notes_table.hasChildNodes()) {  
        notes_table.removeChild(notes_table.firstChild);
    }
    
    var request = new XMLHttpRequest();
    var requestURL = '/sermons/get_notes/'+sermon_id;
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        var all_notes = request.response;
        displayNotes(all_notes);
    }
}


function displayNotes(all_notes) {
    var table = document.getElementById("display_sermon_note_table");

    if (Object.keys(all_notes).length == 0) {
        var msg = document.createElement("p");
        msg.classList.add("card-title");
        msg.innerHTML = "No notes. Please go to add notes.";

        table.appendChild(msg);
    }
    else {
        for (var i in all_notes) {
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

            note_card.appendChild(note_title);
            note_card.appendChild(note_content);
            table.appendChild(note_card); 
        }
    }

    var close_button = document.createElement("button");
    close_button.classList.add("btn", "btn-secondary", "float-right", "mt-2");
    close_button.setAttribute("onclick", "close_sermon_note_table()");
    close_button.innerHTML = "Close";

    table.appendChild(close_button);
}


function close_sermon_note_table() {
    document.getElementById("display_sermon_note_container").style.display = "none";

    var notes_table = document.getElementById("display_sermon_note_table");
    while (notes_table.hasChildNodes()) {  
        notes_table.removeChild(notes_table.firstChild);
    }
}


function open_add_note_form(sermon_id) {
    // in case display table is open
    close_sermon_note_table();

    document.getElementById("add_sermon_note_container").style.display = "block";
    document.getElementById("add_sermon_note_header").innerHTML = "Add Notes for Sermon ID: " + sermon_id;

    document.getElementById("save_add_sermon_note_btn").setAttribute("onclick", "add_note(" + sermon_id + ")");
    document.getElementById("close_add_sermon_note_btn").setAttribute("onclick", "closeAddForm()");
}


function closeAddForm() {
    document.getElementById("add_sermon_note_title").value = "";
    document.getElementById("add_sermon_note_content").value = "";

    document.getElementById("add_sermon_note_container").style.display = "none";
}


function add_note(sermon_id) {
    var form = document.getElementById("add_sermon_note_form");
    form.action = "/sermons/add_note/" + sermon_id;
    form.submit();
    closeAddForm();
}