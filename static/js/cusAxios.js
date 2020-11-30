const http = axios.create({
    baseURL: "https://api.rambuild.cn/tools/",
    timeout: 30000
})
http.interceptors.request.use(config => {
    config.headers["Content-Type"] = "application/json"
    return config
})