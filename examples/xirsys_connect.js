// 'ident' and 'secret' should ideally be passed server-side for security purposes.
// If secureTokenRetrieval is true then you should remove these two values.

// Insecure method
var xirsysConnect = {
	secureTokenRetrieval : false,
	data : {
		domain : '<your-domain>',
		application : '<application-name>',
		room : '<room-name>',
		ident : '<your-ident>',
		secret : '<your-secret>'
	}
};

// Secure method
/*var xirsysConnect = {
	secureTokenRetrieval : true,
	server : '../getToken.php',
	info : {
		domain : '<your-domain>',
		application : '<application-name>',
		room : '<room-name>'
	}
};*/

