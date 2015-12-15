
var currentAQI;

var getData = function(){
	$.ajax({
	url: 'https://breezometer.p.mashape.com/location/?lang=en&location=Beijing',
	headers: { 'X-Mashape-Key': 'x9H6c3KIZdmsh4ViEX0i7klHJMbnp12H3rejsnbxR0mNCIE5aD',
			'Accept':'application/json'}
	}).done(function(data){
		currentAQI = data.breezometer_aqi;
		document.getElementById('aqi').innerHTML = currentAQI;
	});
}();

setInterval(getData,1000 * 60 * 15);






// var getData = function () {

// 	return 0;
// };