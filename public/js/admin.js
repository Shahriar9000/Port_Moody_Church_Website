
showAllUsers();

function showAllUsers() {
    var request = new XMLHttpRequest();
    var requestURL = '/admin/getTable'
    request.open('GET', requestURL);
    request.send();
    request.onload = function() {
        var users = request.response;
        printUserTable(users);
    }
}

function printUserTable(users) {
    var table = document.getElementById('tbMain');

    for (var i in users) {
        const name = users[i].name;
        const email = users[i].email;

        var user_card = document.createElement("div");
        user_card.classList.add("mb-2");

        var user_table = document.createElement("table");
        var user_row = user_table.insertRow(i);
        var user_cell = user_row.insertCell(i);
        
        user_cell = user_row.insertCell(i+1);
        user_table.classList.add("");
        user_table.id = "user_table_" + i;
        user_cell.innerHTML = name;
        user_cell = user_row.insertCell(i+1);
        user_cell.innerHTML = email;

        var c, r, t;
    t = document.createElement('table');
    r = t.insertRow(0); 
    c = r.insertCell(0);
    c.innerHTML = 123;
    c = r.insertCell(1);
    c.innerHTML = 456;
    document.getElementById("addtable").appendChild(t);

    }
}