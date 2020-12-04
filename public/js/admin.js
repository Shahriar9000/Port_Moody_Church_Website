
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
        const role = users[i].role;

        var user_table = document.createElement("tbody");
        var user_row = user_table.insertRow();
        var user_cell1 = user_row.insertCell(0);
        var user_cell2 = user_row.insertCell(1);
        var user_cell3 = user_row.insertCell(2);
        var user_cell4 = user_row.insertCell(3);
        var user_cell5 = user_row.insertCell(4);
        
        user_cell1.innerHTML = name;
        user_cell2.innerHTML = email;
        user_cell3.innerHTML = role;

        var delete_button = document.createElement("form");
        delete_button.setAttribute("method", "post");
        delete_button.classList.add("btn", "btn-outline-secondary", "mt-2");
        delete_button.id = "delete_user_" + user_id;
        delete_button.setAttribute("onclick", "deleteUser(" + user_id + ")");
        delete_button.innerHTML = "Delete";

        var role_form = document.createElement("form");
        role_form.setAttribute("method", "post");
        role_form.id = "role_form_" + user_id;
        var selectList = document.createElement("select");
        selectList.name = "mySelect" + user_id;
        // selectList.name = user_id;
        selectList.classList.add(user_id);
        role_form.appendChild(selectList);
        var option1 = document.createElement("option");
        option1.value = role;
        option1.text = role;
        selectList.appendChild(option1);
        if(role == "regular"){
            var option2 = document.createElement("option");
            option2.value = "admin";
            option2.text = "admin";
            selectList.appendChild(option2);
        } else{
            var option2 = document.createElement("option");
            option2.value = "regular";
            option2.text = "regular";
            selectList.appendChild(option2);
        }
        role_form.setAttribute("onchange", "changeRole(" + user_id + ")");

        user_cell4.appendChild(delete_button);
        user_cell5.appendChild(role_form);
        table.appendChild(user_table);

    }
}

function deleteUser(user_id){
    var form = document.getElementById("delete_user_" + user_id);
    form.action = "/admin/delete_user/" + user_id;
    form.submit();
}

function changeRole(user_id) {
    var form = document.getElementById("role_form_" + user_id);
    form.action = "/admin/changeRole/" + user_id;
    form.submit();
}