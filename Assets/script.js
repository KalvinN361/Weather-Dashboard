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
