var VUEAPP
requirejs.config({
	baseUrl: "static",
	paths: {
		utils: "./main/utils",
		axios: "./js/cusAxios"
	}
})
require(["utils", "axios"], function (utils, axios) {
	Vue.prototype.$msg = utils.cusEleUI
	function initApp() {
		VUEAPP = new Vue({
			el: "#app",
			data() {
				return {
					pathList: [],
					curRoamingTime: "",
					detailBoxShow: false,
					roamingBoxShow: false,
					treeBoxShow: false,
					treeLoadFlag: false,
					treeData: [],
					searchTreeText: "",
					searchFocusFlag: false,
					searchLoading: true,
					timeLine: -1
				}
			},
			mounted() {
				// 引入Jquery方法
				initJqMethods()
			},
			methods: {
				// 切换主视角
				swithchMainView() {
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
						// 初始化加载zTree
						initZTree()
						this.treeLoadFlag = true
						axios({
							method: "POST",
							url: "api/ModelBusiness/AddModelDirectoryTreeData",
							// url:"praise",
							data: [treeData.data]
						})
					}
				},
				// 搜索目录树
				onTreeSearchInput(val) {
					if (val) {
						// 控制抖动
						clearTimeout(this.timeLine)
						this.timeLine = setTimeout(() => {
							console.log(val)
						}, 300)
					}
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
				}
			}
		})
	}

	$(function () {
		initApp()
	})
})
