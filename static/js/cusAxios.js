// let baseURL = "http://101.133.234.110:6060/api/"
let baseURL = "http://169.254.210.236:5000/api/"
// let baseURL = "https://api.rambuild.cn/tools/"

define(["../../static/js/lib/axios.min.js", "../../static/js/lib/nprogress.js"], function (axios, nprogress) {
	const http = axios.create({
		baseURL,
		timeout: 100000
	})
	http.interceptors.request.use(config => {
		nprogress.start()
		// config.headers["Content-Type"] = "application/json"
		config.headers["Content-Type"] = "application/json-patch+json"
		return config
	})
	http.interceptors.response.use(config => {
		nprogress.done()
		return config
	})
	return http
})
