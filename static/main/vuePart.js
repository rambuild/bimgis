var VUEAPP
requirejs.config({
	baseUrl: "static",
	paths: {
		utils: "./main/utils",
		axios: "./js/cusAxios",
		zTree: "./main/handleZTree",
		initJqMethods: "./main/initJqMethods"
	}
})
require(["utils", "axios", "zTree", "initJqMethods"], function (utils, axios, zTree, initJqMethods) {
	Vue.prototype.$msg = utils.cusMessage
	function initVUEAPP() {
		VUEAPP = new Vue({
			el: "#app",
			data() {
				return {
					pathList: [],
					curRoamingTime: "",
					detailBoxShow: false,
					roamingBoxShow: false,
					treeBoxShow: false,
					typeBoxShow: false,
					treeLoadFlag: false,
					treeData: [],
					searchTreeText: "",
					searchFocusFlag: false,
					searchNodesList: [],
					typeTreeData: [
						{
							label: "所有类型构件",
							desc: "所有类型构件",
							children: [
								{
									label: "板坯 (IfcSlab)",
									desc: "IfcSlab"
								},
								{
									label: "墙体 (IfcWall)",
									desc: "IfcWall"
								},
								{
									label: "标准墙 (IfcWallStandardCase)",
									desc: "IfcWallStandardCase"
								},
								{
									label: "家具元素 (IfcFurnishingElement)",
									desc: "IfcFurnishingElement"
								},
								{
									label: "梁 (IfcBeam)",
									desc: "IfcBeam"
								},
								{
									label: "建筑元素代理 (IfcBuildingElementProxy)",
									desc: "IfcBuildingElementProxy"
								},
								{
									label: "柱 (IfcColumn)",
									desc: "IfcColumn"
								},
								{
									label: "门 (IfcDoor)",
									desc: "IfcDoor"
								},
								{
									label: "流体终端 (IfcFlowTerminal)",
									desc: "IfcFlowTerminal"
								},
								{
									label: "开放元素 (IfcOpeningElement)",
									desc: "IfcOpeningElement"
								},
								{
									label: "栏杆 (IfcRailing)",
									desc: "IfcRailing"
								},
								{
									label: "坡道 (IfcRamp)",
									desc: "IfcRamp"
								},
								{
									label: "空间 (IfcSpace)",
									desc: "IfcSpace"
								},
								{
									label: "楼梯 (IfcStair)",
									desc: "IfcStair"
								},
								{
									label: "运输元素 (IfcTransportElement)",
									desc: "IfcTransportElement"
								},
								{
									label: "窗户 (IfcWindow)",
									desc: "IfcWindow"
								},
								{
									label: "遮盖物 (IfcCovering)",
									desc: "IfcCovering"
								},
								{
									label: "IfcStairFlight",
									desc: "IfcStairFlight"
								},
								{
									label: "IfcMember",
									desc: "IfcMember"
								}
							]
						}
					],
					timeLine: -1,
					propSettings: {
						visible: 100,
						color: "#409EFF"
					}
				}
			},
			mounted() {
				// 引入Jquery方法
				initJqMethods()
			},
			methods: {
				// 切换主视角
				swithchMainView() {
					// this.submitTreeData()
					bimSurfer.resetByConf(
						{ camera: tools.primaryCamera },
						{
							camera: true,
							selected: true,
							visible: true,
							colors: true
						}
					)
				},
				// 切换目录树
				toggleTree() {
					this.treeBoxShow = true
					// 只加载一次目录树
					if (!this.treeLoadFlag) {
						this.treeLoadFlag = true
						// utils.load2Local('testea',JSON.stringify(treeData.data))
					}
				},
				submitTreeData() {
					axios({
						method: "POST",
						url: "ModelBusiness/AddModelDirectoryTreeData?isForceImport=true",
						// url:"praise",
						data: [treeData.data]
					})
				},
				// 搜索目录树
				onTreeSearchInput(val) {
					val = val || "undefined"
					// 控制抖动
					clearTimeout(this.timeLine)
					this.timeLine = setTimeout(() => {
						let searchNodesList = zTree.getNodesByParamFuzzy(val)
						this.searchNodesList = searchNodesList
						// axios({
						// 	method: "POST",
						// 	url: `HomeBusiness/SearchBuildingList?modelKey=08d89769-3f30-78fa-b8d1-f799c49ddb4e&keyWord=${val}`,
						// })
					}, 300)
				},
				// 选择目录树单项操作
				selNodesItem(i) {
					console.log(i)
					// 选择目录树节点
					zTree.selTreeNode(i)
					// 选择构件并移到视图
					let curItem = [`${lastRevisionId}:${i.id}`]
					try {
						bimSurfer.viewFit({
							ids: curItem,
							animate: true // 设置是否有动画效果
						})
						bimSurfer.setSelection({
							ids: curItem,
							clear: true,
							selected: true
						})
					} catch (e) {}
				},
				// 构件筛选器目录树选中事件
				typeTreeOnCheck(curItem, allItem) {
					let { checkedKeys } = allItem
					// 删除构件类型父节点的key
					for (let i in checkedKeys) {
						if (checkedKeys[i] == "所有类型构件") {
							checkedKeys.splice(i, 1)
						}
					}
					// 先隐藏所有类型的构件
					bimSurfer.hideAll()
					// 再显示当前勾选的构件类型
					bimSurfer.setVisibility({
						types: checkedKeys,
						visible: true
					})
				},
				// 添加漫游路径
				addRoamingPath() {
					let length = this.pathList.length
					let conf = bimSurfer.saveReset({ camera: true })
					// 如果输入的不是数字则默认为1
					let duration = isNaN(parseFloat(this.curRoamingTime)) ? 1 : parseFloat(this.curRoamingTime)
					this.pathList.push({
						title: `漫游点${length + 1}（${duration}s）`,
						conf: {
							camera: {
								...conf.camera,
								duration
							}
						}
					})
					console.log(this.pathList)
				},
				// 播放漫游
				playRoaming() {
					if (this.pathList.length > 1) {
						// 执行漫游路径
						utils.execAction(this.pathList, 0)
					}
				},
				// 播放单项漫游路径
				playRoamingItems(index) {
					bimSurfer.resetByConf(this.pathList[index].conf, { camera: true })
				},
				// 删除单项漫游路径
				delRoamingItems(index) {
					this.pathList.splice(index, 1)
				},
				// 设置构件可见性
				visibleSliderInput(val) {
					let selItems = zTree.getBimSelectedNodes()
					bimSurfer.setOpacity({
						ids: selItems,
						opacity: val / 100 // RGBA
					})
				},
				// 设置构件颜色
				colorPickerChange(val) {
					let selItems = zTree.getBimSelectedNodes()
					val = val.replace("(", "").replace(")", "").replace("rgba", "").split(",")
					val = val.map(i => {
						return parseInt(i)
					})
					console.log(val)
					bimSurfer.setColor({
						ids: selItems,
						color: val // RGBA
					})
				}
			}
		})
	}

	$(function () {
		initVUEAPP()
	})
})
