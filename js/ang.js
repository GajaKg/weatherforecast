
function getServiceData(method, url, bool){ // id, price, name
    try{
        var result;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.readyState == 4){
                if(xmlhttp.status == 200){
                    console.log("Success");
                    result = JSON.parse(xmlhttp.response);
                } else {
                    return console.log("Error");
                }
            }
        }
        xmlhttp.open(method, url, bool);
        xmlhttp.send();
        return result;
    }
    catch(err){
        return err;
    }
}

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

var gradovi = ["Kragujevac", "Nis", "Jagodina", "Valjevo", "Novi Sad", "Bor", "Svilajnac"];

//  ----------------------------  ANGULAR APP  ----------------------------- \\\
var app = angular.module('probaApp', []);
app.controller('probaCtrl', function($scope){
    
$("#datepicker").datepicker({   
    changeYear: true,
    changeMonth: true,
    dateFormat : 'dd-mm-yy'
}); 
    
//prikaz gradova na index.html
$scope.gradovi = gradovi;
$scope.mere = ["Celsius", "Kelvin", "Farenhajt"];


//prikaz vremenske prognoze
$scope.niz = [];
for(var i in gradovi){
    var prognoza = serverWeather(gradovi[i], dani="");
    $scope.niz.push(prognoza);
}   
    /*
var izabranGrad = $scope.nadjiGrad;//alert(izabranGrad);
if(izabranGrad == "Svi gradovi"){alert('');}
*/
$scope.pretragaPoParamterima = function(){
    var izborMere = $scope.izborMere; console.log(izborMere);
    var izabraniDatum = $scope.datepicker; console.log(izabraniDatum);
    
    //if(izabranGrad == "Svi gradovi"){alert('');}
    if(izborMere == "Celsius"){
        //izborMere = $scope.izborMere;
        $scope.niz = [];
        
        if(izabraniDatum != "" && izabraniDatum != undefined){
            
            for(var g in gradovi){
                
                var prognozaGrad = serverWeather(gradovi[g], dani=""); //console.log(prognozaGrad);
                var dnevnaPrognoza = prognozaGradaZaDatum(gradovi[g], izabraniDatum); //console.log(dnevnaPrognoza);
                
                prognozaGrad.list[0].temp.day = dnevnaPrognoza;
                prognozaGrad.list[0].weather[0].main = slicice(gradovi[g], izabraniDatum);
                
                $scope.niz.push(prognozaGrad);  
            }
        
        }             
        
        if(izabraniDatum == "" || izabraniDatum == undefined){
            
            for(var g in gradovi){
                var prognoza = serverWeather(gradovi[g], dani="");
                //var kon = konvertovanje(izborMere, prognoza.list[0].temp.day);
                
                //prognoza.list[0].temp.day = kon;
                //console.log(prognoza.list[0].temp.day);
                //prognoza.list[0].weather[0].main = slicice(gradovi[g], izabraniDatum);
                
                $scope.niz.push(prognoza);
            }   
            
        }

    }
  
    if(izborMere == "Farenhajt"){
        $scope.niz = [];
        
        if(izabraniDatum != "" && izabraniDatum != undefined){
            
            for(var g in gradovi){
                
                var prognoza = serverWeather(gradovi[g], dani="");
                var gradDatum = prognozaGradaZaDatum(gradovi[g], izabraniDatum);
                var kon = konvertovanje(izborMere, gradDatum);
                
                prognoza.list[0].temp.day = kon;
                prognoza.list[0].weather[0].main = slicice(gradovi[g], izabraniDatum);
               
                $scope.niz.push(prognoza);
            }
            
        }
        
        if(izabraniDatum == "" || izabraniDatum == undefined){
            
            $scope.niz = [];
            for(var i in gradovi){
                var prognoza = serverWeather(gradovi[i], dani=""); 
                var kon = konvertovanje(izborMere, prognoza.list[0].temp.day);
                prognoza.list[0].temp.day = kon;
                
                $scope.niz.push(prognoza);
            }  
            
        }
    }
    
    if(izborMere == "Kelvin"){
        $scope.niz = [];
        
        if(izabraniDatum != undefined && izabraniDatum != ""){
            
            for(var g in gradovi){
                
                var prognoza = serverWeather(gradovi[g], dani="");
                var gradDatum = prognozaGradaZaDatum(gradovi[g], izabraniDatum);
                var kon = konvertovanje(izborMere, gradDatum);
                
                prognoza.list[0].temp.day = kon;
                prognoza.list[0].weather[0].main = slicice(gradovi[g], izabraniDatum);
                
                $scope.niz.push(prognoza);
            }
            
        }
        
        if(izabraniDatum == undefined || izabraniDatum == ""){
            
            $scope.niz = [];
            for(var i in gradovi){
                var prognoza = serverWeather(gradovi[i], dani="");
                var kon = konvertovanje(izborMere, prognoza.list[0].temp.day);
                prognoza.list[0].temp.day = kon;
                
                $scope.niz.push(prognoza);
            }  
            
        }
    }
    
}

   
});

// na osnovu izabranog grada i datuma racuna temperaturu i kao rezultat vraca temperaturu za grad i datum 
function prognozaGradaZaDatum(grad, izabraniDatum){

    var prognoza = serverWeather(grad, "&cnt=16");    
    
    for(var dan=0; dan<=prognoza.list.length; dan++){
    //for(var dan in prognoza){
        //alert(prognoza.list[dan].dt);
        var dt = new Date(prognoza.list[dan].dt*1000);
        var prognozaZaDan = konvertujDatum(dt);
        
        if(izabraniDatum == prognozaZaDan){
            return(prognoza.list[dan].temp.day);
        }

    }
}

function slicice(grad, izabraniDatum){

    var prognoza = serverWeather(grad, "&cnt=16");    
    
    for(var dan=0; dan<=prognoza.list.length; dan++){
        
        for(var w=0; w<=prognoza.list[dan].weather.length; w++){
            
                    //list[0].weather[0].main
            var dt = new Date(prognoza.list[dan].dt*1000);
            var prognozaZaDan = konvertujDatum(dt);

            if(izabraniDatum == prognozaZaDan){
                return(prognoza.list[dan].weather[w].main);
            }
   
        }


    }
}

function konvertujDatum(datum){
    var dan = datum.getDate();
    var mesec = datum.getMonth()+1;
    var god = datum.getFullYear();
    if(dan<10) {
        dan='0'+dan;
    } 

    if(mesec<10) {
        mesec='0'+mesec;
    } 
    var punDatum = dan + "-" + mesec + "-" + god;
    
    return punDatum;
}

function konvertovanje(izborMere, stepeni){

    // 	°F = °C × 1.8 + 32
    if(izborMere == "Farenhajt"){

        var rez = stepeni * 1.8 + 32;
        return Math.round( rez * 10 )/ 100;;

    }

    //  K = °C + 273.15
    if(izborMere == "Kelvin"){

        var rez = stepeni + 273.15;
        return Math.round( rez * 10 )/ 100;;

    }
     
    if(izborMere == "Celsius"){

        return Math.round( stepeni * 10 )/ 100;

    }
        
}