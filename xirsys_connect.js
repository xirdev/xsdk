// Ident and secret should ideally be passed from a server for security purposes.
// If serverAuthentication is true then you should remove these two values.

// Insecure method
var xirsysConnect = {
	secure : false,
	data : {
		domain : 'www.xirsys.com',
		application : 'default',
		room : 'default',
		ident : 'user-1',
		secret : '12345678-1234-1234-1234-123456789012'
	}
};

// Secure method
/*var xirsysConnect = {
	secure : true,
	server : '/getToken.php',
	info : {
		domain : 'www.xirsys.com',
		application : 'default',
		room : 'default'
	}
};*/

