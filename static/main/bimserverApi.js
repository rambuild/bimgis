requirejs.config({
	baseUrl: "static",
	paths: {
		axios: "./js/cusAxios",
		utils: "./main/utils"
	}
})
var BASEPATH = BIMSERVER_URL + "/json"

var bodyParams = {
	request: {
		interface: "org.bimserver.ServiceInterface",
		method: "getAllProjects",
		parameters: {
			onlyActive: true,
			onlyTopLevel: false
		}
	}
}

define(["axios", "utils"], function (axios, utils) {
	function bimserverApi() {
		this.getProjectList = async function (token) {
			let { data: res } = await axios.post(BASEPATH, { ...bodyParams, token })
			return res
		}
	}
	return new bimserverApi()
})
