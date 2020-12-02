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
        const file_name = all_sermons[i].file_name;

        var sermon_card = document.createElement("div");
        sermon_card.classList.add("m-2");

        var sermon_name = document.createElement("h5");
        sermon_name.classList.add("card-title");
        sermon_name.id = "sermon_name" + i;
        sermon_name.innerHTML = file_name;

        var sermon_audio = document.createElement("audio");
        sermon_audio.setAttribute("controls", "true");
        sermon_audio.innerHTML = "Your browser does not support the audio element.";

        var sermon_source = document.createElement("source");
        sermon_source.setAttribute("src", "../sermons/"+file_name);
        sermon_source.setAttribute("type", "audio/mpeg");

        sermon_audio.appendChild(sermon_source);

        sermon_card.appendChild(sermon_name);
        sermon_card.appendChild(sermon_audio);
        table.appendChild(sermon_card);
    }
}