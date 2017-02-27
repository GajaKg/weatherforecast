# weatherforecast

Can't go live because of cross origin privacy (if https) and Blocked loading mixed active content (if http).
On local works well with http.

25 line of code in app.js

function serverWeather(grad, dani=""){
    var api = "http://api.openweathermap.org/data/2.5/forecast/daily?";
    var grad = "q=" + grad;
    var jedinicaMere = "&units=metric";
    var tipPodataka = "&mode=json";
    var brojDana = dani; // za narednih 16 dana
    var apiId = "&appid=35ede1ec6538b11f89c7f92cc521bdb2";

    var url = api + grad + jedinicaMere + tipPodataka + brojDana + apiId;
    
    return getServiceData("GET", url, false);
}
