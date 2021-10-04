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

