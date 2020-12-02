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

    get_all_sermons();
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
        show_button.setAttribute("onclick", "displayNotes(" + sermon_id + ")");
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


function displayNotes(sermon_id) {

}

function open_add_note_form(sermon_id) {
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