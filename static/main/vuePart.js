var app
function initApp() {
	app = new Vue({
		el: "#app",
		data: {
			pathList: [],
			detailBoxShow: false,
			roamingBoxShow: true,
			treeBoxShow: false,
			treeLoadFlag: false
		},
		mounted() {},
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
            addRoamingPath(){
                console.log('a')
            }
		}
	})
}

$(function () {
	initApp()
})
