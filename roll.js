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
	COLOR = ["red","yellow","blue"];
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
		face[i].style.width = CONTAINER_WIDTH + "px";
		face[i].style.border = "1px solid "+COLOR[Math.floor(Math.random()*COLOR.length)];
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
		alert(test[res]);
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
