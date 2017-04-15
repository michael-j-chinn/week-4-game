var bootHelper = {
	createRow: function(columns) {
		var rowInfo = {
			row: $('<div class="row">'),
			columns: []
		};

		columns.forEach(function(col, index) {
			var col = $('<div>').addClass(col.class);
			rowInfo.row.append(col);
			rowInfo.columns.push(col);
		});

		return rowInfo;
	}
}