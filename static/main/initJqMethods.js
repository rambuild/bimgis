define([], function () {
	function initJqMethods() {
		$(".toolsBox .toolsItem,.treeIcon").hover(
			function () {
				$(this).css("color", "#CDCDCD")
			},
			function () {
				$(this).css("color", "#ABABAB")
			}
		)
		// 拖动元素的方法
		var _detailBox = $("#detailBox .detailTop")
		var detailBox_x = "80%"
		var detailBox_y = 10
		var _treeBox = $("#treeBox .treeTop")
		var treeBox_x = 10
		var treeBox_y = 10
		var _roamingPath = $("#roamingPath .top")
		var roamingPath_x = "60%"
		var roamingPath_y = 10
		var _typeBox = $("#typeBox .typeTop")
		var typeBox_x = "60%"
		var typeBox_y = 10

		var ids = [_detailBox, _treeBox, _roamingPath, _typeBox]
		var ids_x = [detailBox_x, treeBox_x, roamingPath_x, typeBox_x]
		var ids_y = [detailBox_y, treeBox_y, roamingPath_y, typeBox_y]

		$.each(ids, function (i, _this) {
			// _this.parents(".touchmove").css({
			// 	position: "absolute",
			// 	left: ids_x[i],
			// 	top: ids_y[i]
			// })
			_this.on("mousedown", function (e) {
				// 不点击关闭按钮的前提下再执行move方法
				if (!e.target.className.includes("icon-close")) {
					beginmove(e, _this)
				}
			})
		})
		// 计算容器的边缘范围
		var contWidth = $("#mainContainer")[0].offsetWidth
		var contHeight = $("#mainContainer")[0].offsetHeight
		var contleft = $("#mainContainer")[0].offsetLeft
		var contTop = $("#mainContainer")[0].clientTop
		var contRight = contleft + contWidth
		var contBottom = contTop + contHeight
		// 开始移动元素位置
		function beginmove(e, _this) {
			// 当前元素的位置
			var offset = _this.offset()
			var cx = offset.left
			var cy = offset.top

			// 当前鼠标的位置(移动前，鼠标按下)
			var sx = e.pageX
			var sy = e.pageY

			// 计算当前鼠标和元素之间位置的偏移量，让移动后的元素以鼠标按下时的位置为坐标。（默认以元素左上点为坐标）
			var px = sx - cx
			var py = sy - cy

			// 绑定鼠标的移动事件，因为光标在DIV元素外面也要有效果，所以要用doucment的事件，而不用DIV元素的事件
			$(document).on("mousemove", function (ev) {
				// 当前鼠标的位置（移动后，鼠标弹起）

				// 计算当前元素的边缘范围
				var offset = _this.offset()
				var cx = offset.left
				var cy = offset.top
				var cW = _this[0].offsetWidth
				var cH = _this.parents(".touchmove")[0].offsetHeight
				var cR = cx + cW
				var cB = cy + cH

				sx = ev.pageX
				sy = ev.pageY
				// 当前元素位置
				var _x = sx - px
				var _y = sy - py - 72
				// 设定元素位置
				_this.parents(".touchmove").css({
					left: _x,
					top: _y
				})
				// 元素超过边缘范围时的处理方法
				if (cx < contleft) {
					// console.log("左边超过范围")
					$(this).off("mousemove")
					_this.parents(".touchmove").css({
						left: contleft
					})
				}
				if (cR > contRight) {
					// console.log("右边超过范围")
					$(this).off("mousemove")
					_this.parents(".touchmove").css({
						left: contRight - cW - 20
					})
				}
				if (cy < contTop) {
					// console.log("上边超过范围")
					$(this).off("mousemove")
					_this.parents(".touchmove").css({
						top: contTop
					})
				}
				if (cB > contBottom) {
					// console.log("下边超过范围")
					$(this).off("mousemove")
					_this.parents(".touchmove").css({
						top: contBottom - cH - 200
					})
				}
				$.each(ids, function (i, _this) {
					// 当前元素的位置
					var offset = _this.offset()
					var cx = offset.left
					var cy = offset.top
					// 保存位置
					ids_x[i] = cx
					ids_y[i] = cy
				})
			})
			// 当鼠标按键弹起时，解除元素移动，让元素停留在当前位置
			$(document).on("mouseup", function () {
				$(this).off("mousemove")
				// 记录元素位置
				$.each(ids, function (i, _this) {
					// 当前元素的位置
					var offset = _this.offset()
					var cx = offset.left
					var cy = offset.top
					// 保存位置
					ids_x[i] = cx
					ids_y[i] = cy
				})
			})
		}
	}
	return initJqMethods
})
