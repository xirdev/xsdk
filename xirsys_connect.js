var xirsysConnect = {
	secure : false,
	// Server only needed if secure is true.
	server : '/getToken.php',
	domain : 'www.xirsys.com',
	application : 'default',
	room : 'default',
	// Ident and secret should ideally be passed from a server for security purposes.
	// If serverAuthentication is true then you can discard these two values.
	ident : 'user-1',
	secret : '12345678-1234-1234-1234-123456789012'
};
