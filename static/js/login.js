// document.addEventListener("DOMContentLoaded", function (event) {


// 	// try {
// 	// 	loadFromBimserver(address, account, password);
// 	// } catch (e) {
// 	// 	console.log(e);
// 	// }
// });
var token, poid, lastRevisionId; // 这三个是在模型加载时需要用到的
var metadata; // 这是右侧元数据
var address = "http://localhost:6666"
define([], function () {
	function login(address, account, password, projectName) {
		return new Promise((resolve, reject) => {
			var client = new BimServerClient(address);
			client.init(function () {
				client.login(account, password, function () {
					// 根据项目名称获取该项目的模型场景
					client.call("ServiceInterface", "getAllProjects", {
						onlyTopLevel: true,
						onlyActive: true
					}, function (projects) {
						projects.forEach(function (project) {
							if (project.name === projectName) {
								token = client.token;
								poid = project.oid;
								lastRevisionId = project.lastRevisionId;
							}
						});
						resolve()
					});
				}, function (error) {
					console.error(error);
					reject()
				});
			});
		})
	}
	return login
})