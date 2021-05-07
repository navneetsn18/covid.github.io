function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

async function vaccinate() {
  var pinString = document.getElementById("pincode").value;
  var dateString = document.getElementById("dateOfBooking").value;
  var pincodes = pinString.split(",");
  var dateArr = [dateString];

  const sleepNow = (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay));
  console.log("Script Initialising");

  for (i = 0; i < pincodes.length; i++) {
    for (j = 0; j < dateArr.length; j++) {
      url =
        "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByPin?pincode=" +
        pincodes[i] +
        "&date=" +
        dateArr[j];
      await sleepNow(1000);
      a = httpGet(url);
      try {
        a = JSON.parse(a);
      } catch (e) {
        continue;
      }
      for (c in a.centers) {
        for (s in a.centers[c].sessions) {
          if (
            a.centers[c].sessions[s].min_age_limit < 45 &&
            a.centers[c].sessions[s].available_capacity > 0
          ) {
            document.getElementById("temp").innerHTML = "<p>Location Found</p>";
            console.log(
              "Trying Booking for",
              a.centers[c].pincode,
              a.centers[c].name,
              a.centers[c].sessions[s].available_capacity
            );
            var text = `Try Booking for ${a.centers[c].name} with ${a.centers[c].sessions[s].available_capacity} slots.`;
            var node = document.createElement("li");
            var textnode = document.createTextNode(text);
            node.appendChild(textnode);
            document.getElementById("myList").appendChild(node);
            var audio = new Audio(
              "https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3"
            );
            audio.play();
          }
        }
      }
    }
  }
  await sleepNow(10000);
  return false;
}

function run() {
  var pinString = document.getElementById("pincode").value;
//   var dateString = document.getElementById("dateOfBooking").value;
//   var today = new Date();
//   var month = today.getMonth();
//   var day = today.getDay();
//   var year = today.getFullYear();
//   var todayString =
//     day.toString() + "-" + month.toString() + "-" + year.toString();
//   var date = new Date(todayString);

//   mydate = new Date(dateString);
//   console.log(date);
//   console.log(pinString);
//   if (mydate < date) {
//     alert("Please enter a valid date!");
//   } else 
if (
    pinString.length != 6 &&
    /^(\d{4}|\d{6})$/.test(pinString) == false
  ) {
    alert("Enter valid pincode!");
  } else {
    document.getElementById("temp").innerHTML =
      "<p>Searching For Locations!!</p>";
    var trialCounter = 1;
    vaccinate();
    const interval = setInterval(function () {
      vaccinate();
      console.log("Check: ", trialCounter++);
    }, 10000);
  }
}
