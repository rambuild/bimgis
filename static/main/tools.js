$(function () {
    let treeFlag = false
    
	$(".toolsBox .toolsItem,.treeIcon").hover(
		function () {
			$(this).css("color", "#CDCDCD")
		},
		function () {
			$(this).css("color", "#ABABAB")
		}
	)
	// 显示目录树
	$(".treeIcon").on("click", function () {
		$(this).hide()
        $("#legTreeBox").css("visibility", "visible")
        // 加载过tree之后再次点击树形icon就不执行加载动作了
		if (!treeFlag) {
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
				treeFlag = true
				spop({
					template: "加载完成",
					group: "legTree",
					style: "success",
					autoclose: 1500,
					position: "top-left"
				})
			}, 1000)
		}
	})
	// 目录树关闭按钮
	$("#legTreeBox .icon-close").on("click", function () {
		$("#legTreeBox").css("visibility", "hidden")
		$(".treeIcon").show()
	})
	// tools主视角恢复
	$(".toolsBox .mainPersp").on("click", function () {
		bimSurfer.resetByConf(tools.primaryCamera, {
			camera: true,
			selected: true,
			visible: true,
			colors: true
		})
    })
    // tools漫游路径
    // tools构件详情
    $('.toolsBox .icon-xiangqing').on('click',function(){
        $("#detailBox").show()
    })
    $("#detailBox .icon-close").on('click',function(){
        $("#detailBox").hide()
    })
})
