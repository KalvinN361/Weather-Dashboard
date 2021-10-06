// created an arrary for the perv search events 
var searchHistory = [];

function getItems() {
    var storedCities = JSON.parse(localStorage.getItem("searchHistory"));
    if (storedCities !== null) {
        searchHistory = storedCities;
    };
     // a for loop so that there is a max number of 6 cities in the prev search bar 
    for (i = 0; i < searchHistory.length; i++) {
        if (i == 6) {
            break;
        }
        //  used the bootstrap function to add class
        cityListButton = $("<a>").attr({
            class: "list-group-item list-group-item-action",
            href: "#"
        });
        // adds searched histories to the end of the list 
        cityListButton.text(searchHistory[i]);
        $(".list-group").append(cityListButton);
    }
};

var city;
var mainContainer = $(".card-body");
getItems();
// main card
function getData() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6a7afcc840d3e1020b68003a1927f9e9"
    // this make sure that the main container is empty
    mainContainer.empty();
    // this makes sure that the 5 day forcast isempty
    $("#weeklyForecast").empty();
    // requests using jquery
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // using moment to craft the date
        var date = moment().format(" MM/DD/YYYY");
        // takes the icon code from the response and assigns it to iconCode
        var iconCode = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
        var name = $("<h3>").html(city + date);
        mainContainer.prepend(name);
    //   appends information onto main container
        mainContainer.append($("<img>").attr("src", iconURL));
        // converts K and removes decimals using Math.round
        var temp = Math.round((response.main.temp - 273.15) * 1.80 + 32);
        mainContainer.append($("<p>").html("Temperature: " + temp + " &#8457"));
        var humidity = response.main.humidity;
        mainContainer.append($("<p>").html("Humidity: " + humidity));
        var windSpeed = response.wind.speed;
        mainContainer.append($("<p>").html("Wind Speed: " + windSpeed));
        // var to use for uv index
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        // call for uv index needs a lat a long
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=6a7afcc840d3e1020b68003a1927f9e9&lat=" + lat + "&lon=" + lon,
            method: "GET"
        // uv along with btn warning for response. 
        }).then(function (response) {
            mainContainer.append($("<p>").html("UV Index: <span>" + response.value + "</span>"));
            // 
            if (response.value <= 2) {
                $("span").attr("class", "btn btn-outline-success");
            };
            if (response.value > 2 && response.value <= 5) {
                $("span").attr("class", "btn btn-outline-warning");
            };
            if (response.value > 5) {
                $("span").attr("class", "btn btn-outline-danger");
            };
        })
        
        // another call for the 5-day (forecast)
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=6a7afcc840d3e1020b68003a1927f9e9&units=imperial",
            method: "GET"
        // displays 5 separate columns from the forecast response
        }).then(function (response) {
            for (i = 0; i < 5; i++) {
                // creates the columns
                var weekContainers = $("<div>").attr("class", "col fiveDay bg-primary text-white rounded-lg p-2");
                $("#weeklyForecast").append(weekContainers);
                // uses moment for the date
                var myDate = new Date(response.list[i * 8].dt * 1000);
                // displays date
                weekContainers.append($("<h4>").html(myDate.toLocaleDateString()));
                // variable to put into api search 
                var iconCode = response.list[i * 8].weather[0].icon;
                // icons added to each card of week 
                var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
                weekContainers.append($("<img>").attr("src", iconURL));
                // temperature in farenheigh coverted
                var temp = response.list[i * 8].main.temp;
                weekContainers.append($("<p>").html("Temp: " + temp + " &#8457"));
                // var humidity to appened to list
                var humidity = response.list[i * 8].main.humidity;
                weekContainers.append($("<p>").html("Humidity: " + humidity));
            }
        })
    })
};
// searches and adds to history
$("#searchCity").click(function() {
    city = $("#city").val();
    getData();
    var checkArray = searchHistory.includes(city);
    if (checkArray == true) {
        return
    }
    else {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        var cityListButton = $("<a>").attr({
            // list-group-item-action keeps the search history buttons consistent
            class: "list-group-item list-group-item-action",
            href: "#"
        });
        cityListButton.text(city);
        $(".list-group").append(cityListButton);
    };
});
// listens for action on the history buttons
$(".list-group-item").click(function() {
    city = $(this).text();
    getData();
});

