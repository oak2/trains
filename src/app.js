var UI = require('ui');
var ajax = require('ajax');

var main = new UI.Card({
  title: 'Induló vonatok',
	body: 'F-NY ^ \nNY-F ˇ',
	scrollable: false
});

var trainList = new UI.Card({
	scrollable: true
});

main.on('click', 'up', function() {
	function up() {
		trainList.body('');
		trainList.title('Fótújfalu-Nyugati');
		var params = {
			from: 'Fótújfalu',
			to: 'Budapest-Nyugati',
			wotransfer: true,
			fromtime: getHHmmMinusX(new Date(), 1)
		};
		showData(params);
	}
	trainList.on('click', 'select', function() {
		up();		
	});
	up();
});

main.on('click', 'down', function() {
	function down() {
		trainList.body('');
		trainList.title('Nyugati-Fótújfalu');
		var params = {
			from: 'Budapest-Nyugati',
			to: 'Fótújfalu',
			wotransfer: true,
			fromtime: getHHmmMinusX(new Date(), 1)
		};
		showData(params);
	}
	trainList.on('click', 'select', function() {
		down();		
	});
	down();
});


main.show();

function showData(params) {
	console.log(JSON.stringify(params));
	ajax({
			url: 'http://apiv2.oroszi.net/elvira?from=' + encodeURIComponent(params.from) + '&to=' + encodeURIComponent(params.to) +
			'&wotransfer:' + params.wotransfer + '&fromtime=' + encodeURIComponent(params.fromtime),
			method: 'GET',
			type: 'json',
			crossDomain: true
		},
		function(data) {
			success(data);
		},
		function(er) {
			error(er);
		}
	);
}

function success(data) {
	console.log(JSON.stringify(data));
	data.timetable.forEach(function(entry) {
		var body = typeof trainList.body() !='undefined'?trainList.body():'';
		trainList.body(body + '\n' + entry.details[0].dep_real);
	});
	trainList.show();
}

function error(er) {
	main.body('Sajnos hiba történt.');
	console.log(JSON.stringify(er));
}

function getHHmmMinusX(date, x) {
	var HH = date.getHours() - x;
	var mm = date.getMinutes();
	return HH + ':' + mm;
}