var treeData = {}
var tools = {}
// 获取相机状态并保存
function queryCameraStatus() {
	var camera = bimSurfer.getCamera()
	if (!camera) {
		return
	} else {
		eyeX = camera.eye[0]
		eyeY = camera.eye[1]
		eyeZ = camera.eye[2]
		targetX = camera.target[0]
		targetY = camera.target[1]
		targetZ = camera.target[2]
		upX = camera.up[0]
		upY = camera.up[1]
		upZ = camera.up[2]
		// 改变显示的值
		$("#eyeX").text(eyeX.toFixed(2))
		$("#eyeY").text(eyeY.toFixed(2))
		$("#eyeZ").text(eyeZ.toFixed(2))
		$("#targetX").text(targetX.toFixed(2))
		$("#targetY").text(targetY.toFixed(2))
		$("#targetZ").text(targetZ.toFixed(2))
		$("#upX").text(upX.toFixed(2))
		$("#upY").text(upY.toFixed(2))
		$("#eyeZ").text(upZ.toFixed(2))
		// 改变滑块的值
		$("#sliderEyeX").val(eyeX)
		$("#sliderEyeY").val(eyeY)
		$("#sliderEyeZ").val(eyeZ)
		$("#sliderTargetX").val(targetX)
		$("#sliderTargetY").val(targetY)
		$("#sliderTargetZ").val(targetZ)
		$("#sliderUpX").val(upX)
		$("#sliderUpY").val(upY)
		$("#sliderUpZ").val(upZ)
	}
}

require([
	"../../dependency/bimsurfer/src/BimSurfer",
	"../../dependency/bimsurfer/src/BimServerModelLoader",
	"../../dependency/bimsurfer/src/StaticTreeRenderer",
	"../../dependency/bimsurfer/src/MetaDataRenderer",
	"../../dependency/bimsurfer/lib/domReady!"
], function (BimSurfer, BimServerModelLoader, StaticTreeRenderer, MetaDataRenderer) {
	async function processBimSurferModel(bimSurferModel) {
		treeData = await bimSurferModel.getTree()
		console.log(bimSurferModel)
		delete treeData.id
		for (var i of treeData.children) {
			if (i.children) {
				delete i.id
				for (var j of i.children) {
					if (j.children) {
						delete j.id
						for (var k of j.children) {
							if (k.children) {
								delete k.id
								for (var l of k.children) {
									if (l.children) {
										delete l.id
										l.open = false
									} else {
										k.open = false
									}
								}
							}
						}
					}
				}
			}
		}

		console.log(await bimSurferModel.getTree()) // **************************************************************************
		// bimSurferModel.getTree().then(function (tree) {
		//     // 传递创建左侧构件树的div_ID
		//     var domtree = new StaticTreeRenderer({
		//         domNode: "treeContainer",
		//     })
		//     domtree.addModel({ name: "ceshi", id: lastRevisionId, tree: tree })
		//     domtree.build()
		//     // 传递创建右侧构件头信息的div_ID
		//     metadata = new MetaDataRenderer({
		//         domNode: "dataContainer",
		//     })

		//     metadata.addModel({
		//         name: "",
		//         id: lastRevisionId,
		//         model: bimSurferModel,
		//     })

		//     // view层选择事件
		//     bimSurfer.on("selection-changed", function (selected) {
		//         domtree.setSelected(selected, domtree.SELECT_EXCLUSIVE)
		//         metadata.setSelected(selected)
		//     })

		//     // 左侧构件树的点击事件
		//     domtree.on("click", function (oid, selected) {
		//         if (selected.length) {
		//             bimSurfer.viewFit({
		//                 ids: selected,
		//                 animate: true, // 设置是否有动画效果
		//             })
		//         }
		//         bimSurfer.setSelection({
		//             ids: selected,
		//             clear: true,
		//             selected: true,
		//         })
		//     })
		// })
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
			metadata.setSelected(selected)
		})
		// tree点击事件
		$(".legTree").on("click", "a", function () {
			let curItem = $(this).siblings("input").val()
			// 判断是否为有数值的构件
			if (curItem > 0) {
				curItem = [`${lastRevisionId}:${curItem}`]
				console.log(curItem)
				bimSurfer.viewFit({
					ids: curItem,
					animate: true // 设置是否有动画效果
				})
				bimSurfer.setSelection({
					ids: curItem,
					clear: true,
					selected: true
				})
				// metadata.setSelected(curItem)
			}
		})
	}

	var bimSurfer = new BimSurfer({
		domNode: "viewerContainer"
	})

	window.bimSurfer = bimSurfer

	// 加载及加载完成事件
	bimSurfer.on("loading-started", function () {
		console.time("加载用时")
	})
	bimSurfer.on("loading-finished", function () {
		console.timeEnd("加载用时")
		// 加载成功提示信息
		spop({
			template: "加载成功",
			group: "submit-satus",
			style: "success",
			autoclose: 1500
		})
		tools.primaryCamera = bimSurfer.saveReset({ camera: true })
		// 获取相机状态并保存
		queryCameraStatus()
	})

	var bimServerClient = new BimServerClient(address, null)
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
				console.log("modelObj-------------", modelObj)
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
})
