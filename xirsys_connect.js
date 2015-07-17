// Ident and secret should ideally be passed from a server for security purposes.
// If serverAuthentication is true then you should remove these two values.

// var xirsysConnect = {
// 	secure : false,
// 	data : {
// 		domain : 'www.your-domain.com',
// 		application : 'default',
// 		room : 'default',
// 		ident : 'your-ident',
// 		secret : 'your-secret'
// 	}
// };

// Secure method
var xirsysConnect = {
	secure : true,
	token_url : 'https://service.xirsys.com/signal/token',
	ice_url : 'https://service.xirsys.com/ice',
	data : {
		domain : 'www.xirsys.com',
		application : 'default',
		room : 'default',
		ident : '***REMOVED***',
		secret : '***REMOVED***'
	}
};

