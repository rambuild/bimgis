var VUEAPP
requirejs.config({
	baseUrl: "static",
	paths: {
		utils: "./main/utils",
		axios: "./js/cusAxios",
		zTree: "./main/handleZTree",
		initJqMethods: "./main/initJqMethods",
		initModel: "./js/loadModel",
		bimserverApi: "./main/bimserverApi",
		login: "./js/login",
		canvas2image: "./js/lib/canvas2image",
		allTypes: "./main/allTypes"
	}
})
require([
	"utils",
	"axios",
	"zTree",
	"initJqMethods",
	"initModel",
	"bimserverApi",
	"login",
	"canvas2image",
	"allTypes"
], function (utils, axios, zTree, initJqMethods, initModel, bimserverApi, login, canvas2image, allTypes) {
	Vue.prototype.$msg = utils.cusMessage
	function initVUEAPP() {
		VUEAPP = new Vue({
			el: "#app",
			data() {
				return {
					curRoamingTime: "",
					roamingBoxShow: false,
					treeBoxShow: false,
					typeBoxShow: false,
					settingBoxShow: false,
					treeLoadComplete: false,
					treeData: [],
					searchTreeText: "",
					searchFocusFlag: false,
					searchNodesList: [],
					typeTreeData: [],
					timeLine: -1,
					propSettings: {
						visible: 100,
						color: "#409EFF"
					},
					projectList: [],
					tabActiveName: "newPath",
					roamingPath: {
						pathList: []
					},
					cachedRoamingPath: []
				}
			},
			mounted() {
				// 引入Jquery方法
				initJqMethods()
				// 登录获取token
				login(BIMSERVER_URL, BIMSERVER_UNAME, BIMSERVER_PWD, INIT_PROJRCT_NAME).then(() => {
					// 加载模型
					initModel()
					// 获取项目列表
					this.getProjectList()
				})
				// 插入构建类型
				this.typeTreeData.push(allTypes)
			},
			methods: {
				// 获取所有的模型列表
				async getProjectList() {
					let list = await bimserverApi.getProjectList(token)
					this.projectList = list.response.result
					console.log(list)
				},
				// 切换模型
				projectItemClick(projectName) {
					// 先移除当前项目的canvas节点
					$("canvas").remove()
					login(BIMSERVER_URL, BIMSERVER_UNAME, BIMSERVER_PWD, projectName).then(res => {
						// 加载模型
						initModel()
					})
				},
				// 切换主视角
				swithchMainView() {
					// 提交目录树数据方法
					this.submitTreeData()
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
						url: `ModelBusiness/AddModelDirectoryTreeData?lastRevisionId=${lastRevisionId}`,
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
					let length = this.roamingPath.pathList.length
					let conf = bimSurfer.saveReset({ camera: true })
					// 如果输入的不是数字则默认为1
					let duration = isNaN(parseFloat(this.curRoamingTime)) ? 1 : parseFloat(this.curRoamingTime)
					this.roamingPath.pathList.push({
						title: `漫游点${length + 1}（${duration}s）`,
						conf: {
							camera: {
								...conf.camera,
								duration
							}
						}
					})
					console.log(this.roamingPath.pathList)
				},
				// 播放漫游
				playRoaming() {
					if (this.pathList.length > 1) {
						// 执行漫游路径
						utils.execAction(this.pathList, 0)
					}
				},
				// 保存当前漫游路径组
				saveRoaming() {
					if (this.roamingPath.pathList.length > 0) {
						this.$prompt("请输入漫游路径组名称：", "", {
							inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
							inputErrorMessage: "名称不能为空且只能是中文，英文字母和数字及下划线"
						})
							.then(({ value }) => {
								console.log(this.roamingPath.keyId)
								let params = {
									lastRevisionId: lastRevisionId,
									pathList: JSON.stringify(this.roamingPath.pathList),
									name: value
								}
								if (this.roamingPath.keyId) {
									params.keyId = this.roamingPath.keyId
									axios({
										method: "POST",
										url: "ModelRoam/RoamCreateOrUpdate",
										data: params
									})
								} else {
									axios({
										method: "POST",
										url: "ModelRoam/RoamCreateOrUpdate",
										data: params
									})
									console.log(params)
								}
							})
							.catch(() => {})
					}
				},
				// 播放单项漫游路径
				playRoamingItems(index) {
					bimSurfer.resetByConf(this.pathList[index].conf, { camera: true })
				},
				// 编辑单项漫游路径
				editRoamingItems(index, type) {
					if (type == "del") {
						this.pathList.splice(index, 1)
					} else {
						console.log("eidt")
					}
				},
				// 设置构件可见性
				visibleSliderInput(val) {
					try {
						let selItems = zTree.getBimSelectedNodes()
						bimSurfer.setOpacity({
							ids: selItems,
							opacity: val / 100 // RGBA
						})
					} catch (e) {}
				},
				// 设置构件颜色
				colorPickerChange(val) {
					let selItems = zTree.getBimSelectedNodes()
					val = val
						.replace("(", "")
						.replace(")", "")
						.replace("rgba", "")
						.replace(/\s*/g, "")
						.split(",")
						.map(i => parseInt(i))
					for (let i in val) {
						if (val[i] > 1) {
							val[i] = (val[i] / 255).toFixed(4)
						}
					}
					console.log(val)
					bimSurfer.setColor({
						ids: selItems,
						color: val // RGBA [1,0,1,1]
					})
				},
				// 漫游路径tab栏点击事件
				async handleTabClick(e) {
					if (e.name == "cachedPath") {
						let { data: res } = await axios({
							method: "POST",
							url: `/ModelRoam/GetModelRoamList?lastRevisionId=${lastRevisionId}`
						})
						this.cachedRoamingPath = res
					}
				},
				// 缓存的路径项目设为当前漫游路径
				cachedPath2Local(i) {
					this.roamingPath = i
					if (typeof this.roamingPath.pathList == "string") {
						this.roamingPath.pathList = JSON.parse(this.roamingPath.pathList)
					}
					this.tabActiveName = "newPath"
				}
			}
		})
	}

	$(function () {
		initVUEAPP()
	})
})
