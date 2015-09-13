window.onload = function(){
	if(!(localStorage.getItem("nameStr")&&localStorage.getItem("F")&&localStorage.getItem("FM")&&localStorage.getItem("M")&&localStorage.getItem("UPTIME")))
	{
		restore();
	}
	showArg();
	showItem();
}
function addItem(){
	var keyIn = document.getElementById("keyIn");
	var keyInArr =keyIn.value.split(",");
	var display = document.getElementById("display");
	if (keyIn.value) {
		var nameStr = localStorage.getItem("nameStr");
		if (nameStr) {
			names = nameStr.split(",");
			window.localStorage.nameStr += ","+keyIn.value;
		}else{
			localStorage.setItem("nameStr",keyIn.value);
		};
		//localStorage nameStr去重
		var newName = localStorage.getItem("nameStr").split(",").unique().join(",");
		localStorage.setItem("nameStr",newName)
		showItem();
		keyIn.value = "";
	}else{
		showMsg("输入内容不能为空");
	}
	
}
//刷新同步展示框内内容
function showItem(){
	var color = ["#F4FCE8","#FFFFFF","#FFFEED","#FAF2F8"];
	var display = document.getElementById("display");
	display.innerHTML = "";
	var nameStr = localStorage.getItem("nameStr");
	if (nameStr) {
		names = nameStr.split(",");
		var card = [];
		for (var i = 0; i < names.length; i++) {
			card = document.createElement("div");
			card.className = "cards";
			card.style.backgroundColor = color[i%4];
			card.innerHTML = names[i];
			display.appendChild(card);
		};		
	}else{
		display.innerHTML = "内容为空";
	};
}
//同步转盘参数
function showArg () {
	var Finput = document.getElementById("F");
	var FMinput = document.getElementById("FM");
	var Minput = document.getElementById("M");
	var UPTIMEinput = document.getElementById("UPTIME");
	var MODEinput = document.getElementById("MODE");
	Finput.value = localStorage.getItem("F");
	FMinput.value = localStorage.getItem("FM");
	Minput.value = localStorage.getItem("M");
	UPTIMEinput.value = localStorage.getItem("UPTIME");
	MODEinput.value = localStorage.getItem("MODE");
}
//修改转盘参数
function editArg () {
	var Finput = document.getElementById("F");
	var FMinput = document.getElementById("FM");
	var Minput = document.getElementById("M");
	var UPTIMEinput = document.getElementById("UPTIME");
	var MODEinput = document.getElementById("MODE");
	localStorage.setItem("F",Finput.value);	
	localStorage.setItem("FM",FMinput.value);	
	localStorage.setItem("M",Minput.value);	
	localStorage.setItem("UPTIME",UPTIMEinput.value);	
	localStorage.setItem("MODE",MODEinput.value);
	showMsg("修改成功");
	showArg();
}
//恢复转盘参数默认值
function restore () {
	localStorage.setItem("F","80");
	localStorage.setItem("FM","30");
	localStorage.setItem("M","100");
	localStorage.setItem("UPTIME","3000");
	localStorage.setItem("MODE","0");
	localStorage.setItem("nameStr","测试数据1,测试数据2,测试数据3");
	showMsg("转盘参数已恢复默认值");
	showArg();
	showItem();
}
//清除全部记录
function clearAll(){
	localStorage.removeItem("nameStr");
	showItem();
}
function showMsg(msg){
	alert(msg);
}
//数组的去重方法
Array.prototype.unique = function()
{
	var n = []; //一个新的临时数组
	for(var i = 0; i < this.length; i++) //遍历当前数组
	{
		//如果当前数组的第i已经保存进了临时数组，那么跳过，
		//否则把当前项push到临时数组里面
		if (n.indexOf(this[i]) == -1) n.push(this[i]);
	}
	return n;
}