
showAllUsers();

function showAllUsers() {
    var request = new XMLHttpRequest();
    var requestURL = '/admin/getTable'
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        var users = request.response;
        printUserTable(users);
    }
}

function printUserTable(users) {
    var table = document.getElementById('user_table');

    for (var i in users) {
        const user_id = users[i].id;
        const name = users[i].name;
        const email = users[i].email;

        var user_table = document.createElement("tbody");
        var user_row = user_table.insertRow();
        var user_cell1 = user_row.insertCell(0);
        var user_cell2 = user_row.insertCell(1);
        var user_cell3 = user_row.insertCell(2);
        
        user_cell1.innerHTML = name;
        user_cell2.innerHTML = email;

        var delete_button = document.createElement("form");
        delete_button.setAttribute("method", "post");
        delete_button.classList.add("btn", "btn-outline-secondary", "mt-2");
        delete_button.id = "delete_user_" + user_id;
        delete_button.setAttribute("onclick", "deleteUser(" + user_id + ")");
        
        delete_button.innerHTML = "Delete";

        user_cell3.appendChild(delete_button);
        table.appendChild(user_table);

    }
}

function deleteUser(user_id){
    var form = document.getElementById("delete_user_" + user_id);
    form.action = "/admin/delete_user/" + user_id;
    form.submit();
}