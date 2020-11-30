
var app
function initApp() {
	app = new Vue({
		el: "#app",
		data: {
			pathList: [],
			detailBoxShow: false,
			roamingBoxShow: false,
			treeBoxShow: false,
			treeLoadFlag: false
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
					spop({
						template: `正在加载目录树。。。`,
						group: "legTree",
						style: "warn",
						autoclose: false,
						position: "top-left"
					})
					setTimeout(() => {
						// 生成项目树
						leg.tree({
							ele: ".legTree", //选者
							data: [treeData], //数据
							arrs: arrs, //选中的id
							cascade: true //级联
							// onAsync:true//暂无此
						})
						this.treeLoadFlag = true
						// load2Local("tree.txt", JSON.stringify(treeData))
						spop({
							template: "加载完成",
							group: "legTree",
							style: "success",
							autoclose: 1500,
							position: "top-left"
						})
					}, 1000)
				}
			},
			// 添加漫游路径
			addRoamingPath() {
				let a = bimSurfer.getSnapshot({
					width:200,
					height:200,
					format:"png"				
				})
				console.log(a)
				let length = this.pathList.length
				let conf = bimSurfer.saveReset({ camera: true })
				this.pathList.push({
					title: `漫游点${length + 1}`,
					conf
				})
				console.log(this.pathList)
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
						bimSurfer.resetByConf(this.pathList[i].conf, {
							camera: true,
							selected: true,
							visible: true,
							colors: true,
						})
						i++
					}, 1000);
				}
			},
			// 播放单项漫游路径
			playRoamingItems(index) {
				bimSurfer.resetByConf(this.pathList[index].conf, {
					camera: true,
					selected: true,
					visible: true,
					colors: true,
				})
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
