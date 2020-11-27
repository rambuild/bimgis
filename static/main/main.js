// slider滑动控制camera

let eyeX = -20
let eyeY = 0
let eyeZ = 20
let targetX = 0
let targetY = 10
let targetZ = 0
let upX = 0
let upY = 1
let upZ = 0
function setCamera() {
	bimSurfer.setCamera({
		eye: [eyeX, eyeY, eyeZ],
		target: [targetX, targetY, targetZ],
		up: [upX, upY, upZ]
	})
}

// eye
function sliderEyeX(v) {
	$("#eyeX").text(v)
	eyeX = v
	setCamera()
}
function sliderEyeY(v) {
	$("#eyeY").text(v)
	eyeY = v
	setCamera()
}
function sliderEyeZ(v) {
	$("#eyeZ").text(v)
	eyeZ = v
	setCamera()
}
// target
function sliderTargetX(v) {
	$("#targetX").text(v)
	targetX = v
	setCamera()
}
function sliderTargetY(v) {
	$("#targetY").text(v)
	targetY = v
	setCamera()
}
function sliderTargetZ(v) {
	$("#targetZ").text(v)
	targetZ = v
	setCamera()
}
// up
function sliderUpX(v) {
	$("#upX").text(v)
	upX = v
	setCamera()
}
function sliderUpY(v) {
	$("#upY").text(v)
	upY = v
	setCamera()
}
function sliderUpZ(v) {
	$("#upZ").text(v)
	upZ = v
	setCamera()
}

// ************* 正交设置 **********************

function setOrthoNum(v) {
	$("#orthoNum").text(v)
	bimSurfer.setCamera({
		type: "ortho",
		scale: v
	})
}

// *********** 透视配置 ************
function setPerspNum(v) {
	$("#fovyNum").text(v)
	bimSurfer.setCamera({
		type: "persp",
		fovy: v
	})
}

// ************** 保存配置相机位置 **************
function getCameraPos(camera) {
	// 将当前配置存储到变量
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

$(function () {
	// 全选
	$("#toggleAll").click(function () {
		if (this.checked) {
			$('input[name="IfcAttr"]').prop("checked", true)
		} else {
			$('input[name="IfcAttr"]').prop("checked", false)
		}
	})
	// 构件隐藏与显示
	$("#testHide").click(() => {
		let attrArr = []
		$('input[name="IfcAttr"]:checked').each(function () {
			attrArr.push($(this).val())
		})
		console.log(attrArr)
		bimSurfer.setVisibility({
			types: attrArr,
			visible: false
		})
	})
	$("#testShow").click(() => {
		let attrArr = []
		$('input[name="IfcAttr"]:checked').each(function () {
			attrArr.push($(this).val())
		})
		console.log(attrArr)
		bimSurfer.setVisibility({
			types: attrArr,
			visible: true
		})
	})
	// 查看当前已选择的构件ID
	$("#querySelected").click(() => {
		let id = bimSurfer.getSelection()
		console.log(id)
	})
	// 通过ID选择构件
	$("#testSelection").click(() => {
		bimSurfer.viewFit({
			ids: ["917507:551093014"],
			animate: true
		})
		bimSurfer.setSelection({
			ids: ["917507:551093014"],
			clear: true,
			selected: true
		})
	})
	// 显示当前选择构件
	$("#setVisibleByIds").click(() => {
		let id = bimSurfer.getSelection() // id是一个数组
		bimSurfer.setVisibility({
			ids: id,
			visible: true
		})
	})
	// 隐藏当前选择构件
	$("#setInVisibleByIds").click(() => {
		let id = bimSurfer.getSelection() // id是一个数组
		bimSurfer.setVisibility({
			ids: id,
			visible: false
		})
	})
	// 通过ID改变构件的颜色
	$("#changeColorById").click(() => {
		let curId = bimSurfer.getSelection()
		console.log(curId)
		bimSurfer.setColor({
			ids: curId,
			color: [1, 0, 0, 0.8] // RGB
		})
	})
	// 相机
	let cameraMove = null
	let pers = -20
	$("#testCameraMove").click(() => {
		cameraMove = setInterval(() => {
			bimSurfer.setCamera({
				eye: [pers, 0, 20],
				target: [0, 10, 0],
				up: [0, 1, 0]
			})
			pers++
		}, 30)
	})
	$("#testCameraHold").click(() => {
		clearInterval(cameraMove)
	})
	$("#setOrtho").click(() => {
		bimSurfer.setCamera({
			type: "ortho",
			scale: 50
		})
	})
	// 查询相机状态
	$("#queryCameraStatus").click(() => {
		var camera = bimSurfer.getCamera()
		console.log(camera)
		getCameraPos(camera)
	})

	// 设置为正交
	$("#setOrtho").click(() => {
		bimSurfer.setCamera({
			type: "ortho"
		})
	})
	// 设置为透视
	$("#setPersp").click(() => {
		bimSurfer.setCamera({
			type: "persp"
		})
	})

	let cameraRecords = []
	let recordInterval = null
	let playInterval = null
	let playTimes = 0
	// 相机开始录制
	$("#startRecord").click(() => {
		spop({
			template: "正在录制。。。",
			group: "submit-satus",
			style: "warn",
			autoclose: false
		})
		recordInterval = setInterval(() => {
			var camera = bimSurfer.getCamera()
			cameraRecords.push(camera)
			// console.log(cameraRecords)
		}, 50)
		console.log("正在录制...")
	})
	// 暂停录制
	$("#pauseRecord").click(() => {
		clearInterval(recordInterval)
		spop({
			template: `暂停录制,当前已录制：${cameraRecords.length / 20}秒`,
			group: "submit-satus",
			style: "warn",
			autoclose: false
		})
		console.log(`暂停录制，当前长度：${cameraRecords.length}`)
		console.log(cameraRecords)
	})
	// 播放录制
	$("#playRecord").click(() => {
		console.log(`总长度：${cameraRecords.length / 20}秒`)
		spop({
			template: `正在播放。。。总长度：${cameraRecords.length / 20}秒`,
			group: "submit-satus",
			style: "warn",
			autoclose: false
		})
		clearInterval(recordInterval)

		playInterval = setInterval(() => {
			bimSurfer.setCamera(cameraRecords[playTimes])
			getCameraPos(cameraRecords[playTimes])
			playTimes++
			if (playTimes >= cameraRecords.length) {
				// 播放完成
				console.log("play ok!")
				spop({
					template: `播放完成`,
					group: "submit-satus",
					style: "success",
					autoclose: 2000
				})
				clearInterval(playInterval)
				playTimes = 0
			}
		}, 50)
	})
	// 漫游配置配置缓存变量
	let savedConf = []
	// 保存漫游配置
	$("#saveOptions").click(() => {
		let conf = bimSurfer.saveReset({ camera: true })
		savedConf.push(conf)
		spop({
			template: `保存成功，当前保存${savedConf.length}组`,
			group: "submit-satus",
			style: "success",
			autoclose: 1500
		})
		console.log(savedConf)
	})

	// 恢复漫游配置
	$("#optionsReset").click(() => {
		// bimSurfer.reset({ cameraPosition: false });
		// bimSurfer.reset({ visible: false });
		bimSurfer.reset({ camera: true })
	})
	// 自定义恢复漫游配置
	$("#cusReset").click(() => {
		let num = $("#confNum").val()

		let flag = bimSurfer.resetByConf(savedConf[num], {
			camera: true,
			selected: true,
			visible: true,
			colors: true
		})
		if (flag) {
			spop({
				template: `恢复第${parseInt(num) + 1}组成功`,
				group: "submit-satus",
				style: "success",
				autoclose: 1500
			})
		} else {
			spop({
				template: `恢复失败`,
				group: "submit-satus",
				style: "error",
				autoclose: 1500
			})
		}
	})
	// getVisibility
	$("#getVisibility").click(() => {
		let a = bimSurfer.destroy()
		console.log(a)
	})
	// getTypes
	$("#getTypes").click(() => {
		let a = bimSurfer.getTypes()
		console.log(a)
	})
	$("#aaa").click(() => {
		let id = ["196611:5636539"]
		bimSurfer.setVisibility({
			ids: id,
			visible: false
		})
	})
})
