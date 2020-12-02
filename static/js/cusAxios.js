let baseURL = "http://101.133.234.110:6060/"
// let baseURL = "https://api.rambuild.cn/tools/"

define(["../../static/js/lib/axios.min.js", "../../static/js/lib/nprogress.js"], function (axios, nprogress) {
	const http = axios.create({
		baseURL,
		timeout: 30000
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
