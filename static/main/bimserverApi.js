requirejs.config({
    baseUrl: "static",
    paths: {
        axios: "./js/cusAxios",
    }
})
var BASEPATH = "http://localhost:6666/json"

var bodyParams = {
    request: {
        interface: "org.bimserver.ServiceInterface",
        method: "getAllProjects",
        parameters: {
            onlyActive: true,
            onlyTopLevel: false
        },
    }
}

define(["axios"], function (axios) {
    function bimserverApi() {
        this.getProjectList = async function (token) {
            let { data: res } = await axios.post(BASEPATH, { ...bodyParams, token })
            return res
        }
    }
    return new bimserverApi()
})