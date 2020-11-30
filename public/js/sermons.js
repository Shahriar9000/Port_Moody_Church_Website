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