function getData(f) {
	var userInfo = {
		id: "798547670218447",
		last_name: "Кобзарь",
		name: "Валерий Кобзарь",
		email: 'kobzarvs@gmail.com',
		picture: {
			data: {
				url: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpf1/v/t1.0-1/s100x100/296422_382653581807860_132097568_n.jpg?oh=98847c035c3cd20be6a23129e095f743&oe=5555B5B1&__gda__=1432058505_5f4255a3ccbb59d55f1109d2f3ef36be"
			}
		}
	};

	var testData = {
		'__ttlList': f ? {'userInfo': ['SESSION_EXPIRED', 1000]} : {},
		'userInfo': userInfo
	}

	return testData;
}

module.exports = getData;
