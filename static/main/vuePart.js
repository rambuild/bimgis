var app
function initApp() {
	app = new Vue({
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
				treeProps: {
					label: "name",
					children: "children"
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
				bimSurfer.resetByConf(tools.primaryCamera, {
					camera: true,
					selected: true,
					visible: true,
					colors: true
				})
			},
			// 切换目录树
			toggleTree() {
				// 只加载一次目录树
				this.treeBoxShow = true
				if (!this.treeLoadFlag) {
					// if (treeData.flag) {
					// 	this.treeData.push(treeData.data)
					// 	this.treeLoadFlag = true
					// } else {
					// 	let pushTree = setInterval(() => {
					// 		if (treeData.flag) {
					// 			this.treeData.push(treeData.data)
					// 			this.treeLoadFlag = true
					// 			clearInterval(pushTree)
					// 		}
					// 	}, 1000)
					// }
					initZTree()
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
			},
			// 播放漫游
			playRoaming() {
				if (this.pathList.length > 0) {
					let i = 0
					let interval = setInterval(() => {
						if (i == this.pathList.length) {
							clearInterval(interval)
							return
						}
						bimSurfer.resetByConf(this.pathList[i].conf, { camera: true })
						i++
					}, this.pathList[i].conf.camera.duration * 1000)
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
