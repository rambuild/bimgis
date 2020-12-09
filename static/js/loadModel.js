var treeData = {
	data: [],
	flag: false
}

// bimserver地址和账号配置
let dev_environment = "local"
let configs = {
	local: {
		url: "http://localhost:6666",
		uname: "276822603@qq.com",
		pwd: "qwer1236",
		initProjectName: "b"
	},
	online: {
		url: "http://101.133.234.110:9998",
		uname: "276822603@qq.com",
		pwd: "123456",
		initProjectName: "a"
	}
}
var BIMSERVER_URL = configs[dev_environment].url
var BIMSERVER_UNAME = configs[dev_environment].uname
var BIMSERVER_PWD = configs[dev_environment].pwd
var INIT_PROJRCT_NAME = configs[dev_environment].initProjectName
var tools = {}

define([
	"../../dependency/bimsurfer/src/BimSurfer",
	"../../dependency/bimsurfer/src/BimServerModelLoader",
	"../../dependency/bimsurfer/src/StaticTreeRenderer",
	"../../dependency/bimsurfer/src/MetaDataRenderer",
	"../../static/main/handleZTree",
	"../../dependency/bimsurfer/lib/domReady!"
], function (BimSurfer, BimServerModelLoader, StaticTreeRenderer, MetaDataRenderer, zTree) {
	function initModel() {
		async function processBimSurferModel(bimSurferModel) {
			treeData.data = await bimSurferModel.getTree()
			console.log(bimSurferModel)
			treeData.flag = true
			console.log(await bimSurferModel.getTree())

			metadata = new MetaDataRenderer({
				domNode: "dataContainer"
			})
			metadata.addModel({
				name: "",
				id: lastRevisionId,
				model: bimSurferModel
			})
			bimSurfer.on("selection-changed", function (selected) {
				// domtree.setSelected(selected, domtree.SELECT_EXCLUSIVE)
				// 加载构件详细信息
				metadata.setSelected(selected)
				if (selected.length > 0) {
					let curId = selected[0].split(":")[1]
					// 先在ztree里根据ID查找节点，再选中
					let curNodes = zTree.getNodeByID(curId)
					zTree.selTreeNode(curNodes[0])
				}
			})
		}
		// 模型的渲染节点
		var bimSurfer = new BimSurfer({
			domNode: "viewerContainer"
		})

		window.bimSurfer = bimSurfer

		// 加载及加载完成事件
		bimSurfer.on("loading-started", function () {
			console.time("加载模型用时")
		})
		bimSurfer.on("loading-finished", function () {
			console.timeEnd("加载模型用时")
			// 加载成功提示信息
			Vue.prototype.$msg("success", "加载成功", 1000)
			// 保存初始相机位置
			tools.primaryCamera = bimSurfer.saveReset({ camera: true }).camera
			// 初始化zTree目录树
			zTree.initZTree()
		})

		var bimServerClient = new BimServerClient(BIMSERVER_URL, null)
		// 客户端初始化
		bimServerClient.init(function () {
			bimServerClient.setToken(token, function () {
				var modelLoader = new BimServerModelLoader(bimServerClient, bimSurfer)

				var models = {} // roid -> Model

				var nrProjects

				function loadModels(models, totalBounds) {
					var center = [
						(totalBounds.min[0] + totalBounds.max[0]) / 2,
						(totalBounds.min[1] + totalBounds.max[1]) / 2,
						(totalBounds.min[2] + totalBounds.max[2]) / 2
					]
					var globalTransformationMatrix = [
						1,
						0,
						0,
						0,
						0,
						1,
						0,
						0,
						0,
						0,
						1,
						0,
						-center[0],
						-center[1],
						-center[2],
						1
					]
					for (var roid in models) {
						var model = models[roid]
						modelLoader.setGlobalTransformationMatrix(globalTransformationMatrix)
						modelLoader.loadFullModel(model).then(function (bimSurferModel) {
							processBimSurferModel(bimSurferModel)
							//填充下拉框
							getModelOidAndName(bimSurferModel)
						})
					}
				}

				function getModelOidAndName(thisModel) {
					var modelObj = thisModel.apiModel.objects
					console.log("modelObj-------------", Object.keys(modelObj).length)
					// load2Local("demo.txt", JSON.stringify(modelObj))

					Object.keys(modelObj).forEach(function (key) {
						if (modelObj[key].object.hasChildren === undefined) {
							var option = document.createElement("option")
							$(option).val(key)
							if (modelObj[key].object.Name === undefined || modelObj[key].object.Name === "") {
								$(option).text(key)
							} else {
								$(option).text(modelObj[key].object.Name)
							}
							$("#select").append(option)
						}
					})
				}

				bimServerClient.call("ServiceInterface", "getAllRelatedProjects", { poid: poid }, function (projects) {
					nrProjects = projects.length
					var totalBounds = {
						min: [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE],
						max: [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE]
					}

					projects.forEach(function (project) {
						if (project.lastRevisionId !== -1) {
							//lastRevisionId
							bimServerClient.getModel(
								project.oid,
								project.lastRevisionId,
								project.schema,
								false,
								function (model) {
									models[project.lastRevisionId] = model

									bimServerClient.call(
										"ServiceInterface",
										"getModelMinBounds",
										{ roid: project.lastRevisionId },
										function (minBounds) {
											bimServerClient.call(
												"ServiceInterface",
												"getModelMaxBounds",
												{
													roid: project.lastRevisionId
												},
												function (maxBounds) {
													if (minBounds.x < totalBounds.min[0]) {
														totalBounds.min[0] = minBounds.x
													}
													if (minBounds.y < totalBounds.min[1]) {
														totalBounds.min[1] = minBounds.y
													}
													if (minBounds.z < totalBounds.min[2]) {
														totalBounds.min[2] = minBounds.z
													}
													if (maxBounds.x > totalBounds.max[0]) {
														totalBounds.max[0] = maxBounds.x
													}
													if (maxBounds.y > totalBounds.max[1]) {
														totalBounds.max[1] = maxBounds.y
													}
													if (maxBounds.z > totalBounds.max[2]) {
														totalBounds.max[2] = maxBounds.z
													}
													nrProjects--
													if (nrProjects === 0) {
														loadModels(models, totalBounds)
													}
												}
											)
										}
									)
								}
							)
						} else {
							nrProjects--
							if (nrProjects === 0) {
								loadModels(models, totalBounds)
							}
						}
					})
				})
			})
		})
	}
	return initModel
})
