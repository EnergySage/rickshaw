var Rickshaw = {

	namespace: function(namespace, obj) {

		var parts = namespace.split('.');

		var parent = Rickshaw;

		for(var i = 1, length = parts.length; i < length; i++) {
			var currentPart = parts[i];
			parent[currentPart] = parent[currentPart] || {};
			parent = parent[currentPart];
		}
		return parent;
	},

	keys: function(obj) {
		var keys = [];
		for (var key in obj) keys.push(key);
		return keys;
	},

	extend: function(destination, source) {

		for (var property in source) {
			destination[property] = source[property];
		}
		return destination;
	},

	clone: function(obj) {
		return JSON.parse(JSON.stringify(obj));
	},

    pmt2name: {
        'pur': 'Cash Purchase',
        'pln': 'Purchase with Loan',
        'zdl': '$0-down Lease',
        'ppl': 'Prepaid Lease',
        'cl': 'Custom Lease',
        'zdp': '$0-down PPA',
        'ppp': 'Prepaid PPA',
        'cp': 'Custom PPA'
    },

    pmt2color: {
        'pur': '#822a85',
        'zdl': '#ca6f20',
        'zdp': '#ca6f20',
        'zd':  '#ca6f20',
        'ppl': '#00a0df',
        'ppp': '#00a0df',
        'pp':  '#00a0df',
        'cl': '#61a543',
        'cp': '#61a543',
        'c':  '#61a543',
        'pln': '#275ba9',
        'baseline': '#264DEB'
    }

};

if (typeof module !== 'undefined' && module.exports) {
	var d3 = require('d3');
	module.exports = Rickshaw;
}


