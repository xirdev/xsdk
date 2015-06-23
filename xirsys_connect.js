// Ident and secret should ideally be passed from a server for security purposes.
// If serverAuthentication is true then you should remove these two values.

var xirsysConnect = {
	secure : false,
	data : {
		domain : 'www.your-domain.com',
		application : 'default',
		room : 'default',
		ident : 'your-ident',
		secret : 'your-secret'
	}
};

// Secure method
/*var xirsysConnect = {
	secure : true,
	server : '/getToken.php',
	info : {
		domain : 'www.your-domain.com',
		application : 'default',
		room : 'default'
	}
};*/

