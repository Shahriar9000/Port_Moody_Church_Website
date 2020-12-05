show_all_events()

function show_all_events() {
    if ($('#event_table tr').length == 0) {
        var request = new XMLHttpRequest();
        var requestURL = '/display_event/show_all_events'
        request.open('GET', requestURL);
        request.responseType = 'json';
        request.send();
        request.onload = function() {
            var all_events = request.response;
            display_events(all_events);
        }
        
    }
}

function display_events(all_events) {
    var table = document.getElementById("event_table");
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    

    for (var i in all_events) {
        const Id_ = all_events[i].Id
        const date_= all_events[i].Event_date;
        const time_ = all_events[i].Event_time;
        const type_ = all_events[i].Event_Type;

        console.log(type_);

        var date = new Date(date_);
        var finalDate = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

        var day_of_week = days[date.getDay()];


        var hours = tConvert(time_);
        
        var row = table.insertRow();
        var cell0 = row.insertCell(0);
        cell0.innerHTML = Id_;
        var cell1 = row.insertCell(1);
        cell1.innerHTML = day_of_week;

        var cell2 = row.insertCell(2);
        cell2.innerHTML = finalDate;
        var cell3 = row.insertCell(3);
        cell3.innerHTML = hours;
        var cell4 = row.insertCell(4);
        cell4.innerHTML = type_;
    }
}

function tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (' '); // return adjusted time or original string
  }
