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
					pathList: [],
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
					projectList: []
				}
			},
			mounted() {
				// 引入Jquery方法
				initJqMethods()
				// 登录获取token
				login(BIMSERVER_URL, BIMSERVER_UNAME, BIMSERVER_PWD, "a").then(() => {
					// 加载模型
					initModel()
					// 获取项目列表
					this.getProjectList()
				})
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
						url: "ModelBusiness/AddModelDirectoryTreeData",
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
					let canvas = $("canvas")[0]
					// let a = canvas2image.convertToImage(canvas, 112, 100, "png").src
					canvas.toBlob(
						function (blob) {
							const eleLink = document.getElementById('downlll')
							eleLink.download = 'aa' + ".png"
							eleLink.style.display = "none"
							// 字符内容转变成blob地址
							eleLink.href = URL.createObjectURL(blob)
							// 触发点击
							eleLink.click()
						},
						"image/png",
						1
					)

					// console.log(canvas.toDataURL())
					// console.log(a)

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
				}
			}
		})
	}

	$(function () {
		initVUEAPP()
	})
})
