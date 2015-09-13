if (!localStorage.getItem("nameStr")) {
	test = ["测试机1号","测试机2号","测试机3号"];
	F = 80;FM = 30; M = 100; MODE = 0;UPTIME = 3000;
}else{
	test = localStorage.getItem("nameStr").split(",");
	//初始拉力F、转盘阻力FM、转盘质量M、加速持续时间UPTIME(单位ms)
	F = localStorage.getItem("F");
	FM = localStorage.getItem("FM");
	M = localStorage.getItem("M");
	MODE = localStorage.getItem("MODE");
	UPTIME = localStorage.getItem("UPTIME");
}
function createRoll () {
	container.innerHTML = "";
	FACE_NUM = test.length;
	CONTAINER_HEIGHT = window.innerHeight*0.7;
	if (window.innerHeight > window.innerWidth) {
		CONTAINER_WIDTH = window.innerWidth*0.9;
	}else{
		CONTAINER_WIDTH = window.innerWidth*0.5;
	};
	FACE_HEIGHT = CONTAINER_HEIGHT*Math.cos((180-360/FACE_NUM)/360*Math.PI);
	COLOR = ["#F4FCE8","#FFFFFF","#FFFEED","#FAF2F8"];
	//定义初始偏转角
	D = [];
	for (var i = 0; i < FACE_NUM; i++) {
		D[i] = 360/FACE_NUM*i;
	};
	//定义每个面的z轴偏移translateZ值
	TRANSLATEZ = FACE_HEIGHT/2*Math.tan((180-360/FACE_NUM)/360*Math.PI);
	//加速减速控制量i,j
	SPDI=0;SPDJ=0;
	//加速阶段加速度A1、减速阶段加速度A2
	A1 = (F-FM)/M,A2 = -FM/M;VM = 0;XM = 0;
	container = document.getElementById("container");
	container.style.height = CONTAINER_HEIGHT + "px";
	container.style.width = CONTAINER_WIDTH + "px";
	container.style.marginLeft = -(CONTAINER_WIDTH/2) + "px";
	container.style.marginTop = -(CONTAINER_HEIGHT/2) + "px";	
	//创建面元素
	face = [];
	for (var i = 0;i < FACE_NUM;i++){
		face[i] = document.createElement("div");
		face[i].className = "face";
		face[i].id = "face"+i;
		face[i].innerHTML = test[i];
		//给每个面设置样式
		face[i].style.height = FACE_HEIGHT+ "px";
		face[i].style.lineHeight = FACE_HEIGHT+ "px";
		face[i].style.width = CONTAINER_WIDTH + "px";
		face[i].style.marginTop = CONTAINER_HEIGHT/2-FACE_HEIGHT/2 + "px";
		face[i].style.backgroundColor = COLOR[i%4];
		face[i].style.fontSize = CONTAINER_WIDTH/8+"px";
		face[i].style.transform = "rotateX("+D[i]+"deg) translateZ("+TRANSLATEZ+"px)";
		face[i].style.webkitTransform = "rotateX("+D[i]+"deg) translateZ("+TRANSLATEZ+"px)";
		face[i].style.mozTransform = "rotateX("+D[i]+"deg) translateZ("+TRANSLATEZ+"px)";
		container.appendChild(face[i]);
	}
}

LOCK = 1;
window.onload = function(){
	createRoll();
}
function start(A1,A2){
	if(LOCK == 1){
		LOCK = 0;
		document.getElementById("screen").style.display = "block";
		pushF = setInterval("speedUp("+A1+","+A2+")",50);
	}	
}
//旋转过程中改变各个面的旋转角度
function setDeg(obj,deg){
	obj.style.transform = "rotateX("+deg+"deg) translateZ("+TRANSLATEZ+"px)";
	obj.style.webkitTransform = "rotateX("+deg+"deg) translateZ("+TRANSLATEZ+"px)";
	obj.style.mozTransform = "rotateX("+deg+"deg) translateZ("+TRANSLATEZ+"px)";
}
//加速运动过程
function speedUp(A1,A2){
	var Ddeg = 0.5*A1*Math.pow(SPDI,2);
	var deg = [];
	for (var i = 0; i < FACE_NUM; i++) {
		deg[i] = (D[i] + Ddeg)%360;
		setDeg(face[i],deg[i]);
	};
	SPDI+=1;
	if(SPDI>=(UPTIME/50)){
		clearInterval(pushF);
		VM = A1*SPDI;
		XM = Ddeg;
		pullF = setInterval("speedDown("+A2+")",50);
		SPDI = 0;
	}
}
//减速运动过程
function speedDown(A2){
	var Ddeg = XM+VM*SPDJ+0.5*A2*Math.pow(SPDJ,2);
	var deg = [];
	for (var i = 0; i < FACE_NUM; i++) {
		deg[i] = (D[i] + Ddeg)%360;
		setDeg(face[i],deg[i]);
	};
	SPDJ+=1;
	if(SPDJ >= (-VM/A2)){
		clearInterval(pullF);
		degNow = deg;
		res = getResult(degNow);
		showResult(res);
		if (MODE == 1) {
			test.splice(res,1);
			createRoll();
		}else if(MODE == 0){
			for (var i = 0; i < FACE_NUM; i++) {
				D[i] = deg[i];
			};			
		}
		SPDJ = 0;	
		LOCK = 1;
	}
}
//返回正面朝外的索引值
function getResult(arr){
	var remain = [];
	for (var k = 0; k < arr.length; k++) {
		remain[k] = Math.min(arr[k],360-arr[k]);
	};
	minRe = Array.min(remain);
	for (var l in remain){
		if(remain[l] == minRe){
			return l;
		}
	}
}
Array.min = function(array){
	return Math.min.apply(Math,array);
}
//展示最终结果
function showResult (index) {
	//创建结果展示卡
	var msBox = document.createElement("div");
	msBox.style.width = window.innerWidth*0.5 + "px";
	msBox.style.height = window.innerHeight*0.5 + "px";
	msBox.style.margin = "20% auto";
	msBox.style.borderRadius = "10px";
	msBox.style.fontSize = window.innerHeight*0.1 + "px";
	msBox.style.textAlign = "center";
	msBox.style.color = "#474847";
	msBox.style.lineHeight = msBox.style.height;
	msBox.style.backgroundColor = face[index].style.backgroundColor;
	msBox.innerHTML = test[index];
	//创建继续按钮
	var goOn = document.createElement("div");
	goOn.className = "btn";
	goOn.innerHTML = "继续";
	//screen出现
	var theScreen = document.getElementById("screen");
	theScreen.appendChild(msBox);
	theScreen.appendChild(goOn);
	theScreen.style.display = "block";
	theScreen.style.backgroundColor = "rgba(0,0,0,0.8)";
	goOn.onclick = function(){
		theScreen.innerHTML = "";
		theScreen.style.backgroundColor = "transparent";
		theScreen.style.display = "none";
	}
}
