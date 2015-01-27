var simpleStorage = jest.genMockFromModule('../simpleStorage');

simpleStorage.data = {};

simpleStorage.get.mockImplementation(function(key) {
	if (this.data[key]!==undefined) {
		//console.log("simpleStrorage.get("+key+") " + this.data[key] );
		return this.data[key];
	}
	else
	{
		//console.log("undefined");
		return undefined;
	}
});

simpleStorage.set.mockImplementation(function(key, value, ttl) {
	//console.log("simpleStrorage.get("+key+", "+value+", "+ttl+")" );
	this.data[key] = value;
});

simpleStorage.__set_data = function(data) {
	this.data = data;
};

module.exports = simpleStorage;
