
//-------------------------------------------------------------------------------------------------------------------------------------
var memory=newFilledArray(100, 0);
//var words = newFilledArray(4,0);
//var stack = newFilledArray(100,newFilledArray(4,0));
var stack = newFilledArray(100,0);
var instrMem = newFilledArray(1000, "00000000000000000000000000000000");


var dataLabels = new Hash ();

//memory[0]=232323;

//data memory index

var stackPointer;
var countmem = 0;
var stackallocation;
var brancharg;

var registers=new Hash('r0',0,'r1',0,'r2',0,'r3',0,'r4',0,'r5',0,'r6',0,'r7',0,'r8',0,'r9',0,'r10',0,'r11',0,'r12',0,'sp',8, 'lr',234,'pc',0);

var convertRegName=new Hash('r0',"0000",'r1',"0001",'r2',"0010",'r3',"0011",'r4',"0100",'r5',"0101",'r6',"0110",'r7',"0111",'r8',"1000",'r9',"1001",'r10',"1010",'r11',"1011",'r12',"1100",'sp',"1101", 'lr',"1110",'pc',"1111");

var commands = new Hash('exfunction',new exfunction(),'sub',new sub(),'add',new add(),'str',new str(),'ldr',new ldr(),'bl',new bl(),'mov',new mov(), 'cmp', new cmp(), 'branch', new branch(), 'b' , new b());

//var addr = new Hash('0x000000','00 00 00 00','0x000018','00 00 00 00','0x000024','00 00 00 00');

var copyReg = new Hash();
var copyReg2 = new Hash();

var copyStack = newFilledArray();

var functionsHash = new Hash();
var instAddresses = new Hash();

//var data = new Hash ('=format',"The number is %d and letter is %c");

var labels = new Hash ();

var cmpResult = 0; //Stores the result of cmp. i.e. whether branch is taken or not
//--------------------------------------------------------------------------------------------------------------------------------
function exfunction(){

this.excec= function(num)
	{
		registers.setItem('sp',num);
	}

//sp++;
}

	

//----------------------------------------------------------------------------------------------------------------------------------

function sub(){ //------------------------> working
	this.excec= function(args){
		if(args.length<5){
			if(isInt(args[3])){
				registers.setItem(args[1],registers.getItem(args[2])-parseInt(args[3]));
				
				//-----------------------------
				var operand2 = signExtend(immediateToBin(args[3]),12);
				var I = "1";
				//-----------------------------

				currentInstruction = args[0] + " " + args[1] + ", " + args[2] + ", " + "#" + args[3] ;
				document.getElementById("currentInstr").value = currentInstruction;

				//------------------------------

				if (args[1]=="sp"){
					stackallocation = Math.pow(2, (args[3]*4)) - 1;
				}
			}
			else{
				registers.setItem(args[1],registers.getItem(args[2])-registers.getItem(args[3]));
				
				//-----------------------------
				var operand2 = signExtend(convertRegName.getItem(args[3]),12);
				var I = "0";
				//-----------------------------

				currentInstruction = args[0] + " " + args[1] + ", " + args[2] + ", "  + args[3] ;
				document.getElementById("currentInstr").value = currentInstruction;
			}
			
			//-----------------------------
			var Rn = convertRegName.getItem(args[2]);
			var Rd = convertRegName.getItem(args[1]);
					
			//instruction = instruction+args[2]+args[1]+args[3]
			instruction = dataProcess(I, Rn, Rd, operand2, "0010");
			instrMem[instCount] = instruction;
			updatePC(4);
			//-----------------------------
		}		
	}
}
//--------------------------------------------------------------------------------------------------------------------------------
function add(){	//------------------------> working

	this.excec= function(args){
	
		var instruction;	
	
		if(args.length<5){
			if(isInt(args[3])){
				registers.setItem(args[1],registers.getItem(args[2])+parseInt(args[3]));
				
				//-----------------------------------------
				var operand2 = signExtend(immediateToBin(args[3]),12);
				var I = "1";
				//-----------------------------------------
				currentInstruction = args[0] + " " + args[1] + ", " + args[2] + ", " + "#" + args[3] ;
				document.getElementById("currentInstr").value = currentInstruction;
			}
			else{
				registers.setItem(args[1],registers.getItem(args[2])+registers.getItem(args[3]));
				
				//-----------------------------------------
				var operand2 = signExtend(convertRegName.getItem(args[3]),12);
				var I = "0";
				//-----------------------------------------
				currentInstruction = args[0] + " " + args[1] + ", " + args[2] + ", " + args[3] ;
				document.getElementById("currentInstr").value = currentInstruction;
			}
			
				//-----------------------------------------
				var Rn = convertRegName.getItem(args[2]);
				var Rd = convertRegName.getItem(args[1]);
					
				//instruction = instruction+args[2]+args[1]+args[3]
				instruction = dataProcess(I, Rn, Rd, operand2, "0100");
				instrMem[instCount] = instruction;
				updatePC(4);
				//-----------------------------------------
		}		
	}
}
//----------------------------------------------------------------------------------------------------------------------------------
function str(){

	this.excec = function(args){
	
		//alert(registers.getItem(args[2]));
		//alert((args[3]));
		//alert(args[3]);
		if (args[2]=="sp"){
			//var index3 = dec2hex(args[3]);
			var index3 = registers.getItem("sp");
			stackPointer = index3;
			//alert(index3);
			//var wrd = newFilledArray(4,0);
			//if (args[3]==0){ wrd[0] = registers.getItem(args[1]);}
			//stack[index3]= wrd;
			stack[index3]=registers.getItem(args[1]);
			//alert(stack[index3]);
			currentInstruction = args[0] + " " + args[1] + ", " + "[" + args[2] + ", " + "#" + args[3] + "]" ;
			document.getElementById("currentInstr").value = currentInstruction;

			//--------------------------------------

					if (index3>stackallocation){
						alert("Stack overflow!!!");
					}

		}else{
			var index=parseInt(registers.getItem(args[2]))+parseInt(args[3]);
			memory[index]=registers.getItem(args[1]);

			currentInstruction = args[0] + " " + args[1] + ", " + args[2] + ", "  + args[3] ;
			document.getElementById("currentInstr").value = currentInstruction;
		}
		//memory[index]=registers.getItem(args[1]);
		
		//-----------------------------------------
		var Rn = convertRegName.getItem(args[1]);
		var Rd = convertRegName.getItem(args[2]);
		var operand2 = signExtend(immediateToBin(args[3]),12);
				
		instruction = dataTrans(Rn, Rd, operand2, "011001");
		instrMem[instCount] = instruction;
		updatePC(4);
		//-----------------------------------------
		
		
		//addr.setItem('0x000000',index);

		//alert(memory[index]);
	}

}
//-------------------------------------------------------------------------------------------------------------

function ldr(){

	
	this.excec = function(args){
		
		var instruction;
		
			if(isReg(args)){
				//document.getElementById("outputText").innerHTML ='this is reg';
				if(args[2]=="sp"){
					//alert(args[3]);	
					//var index4=parseInt(args[3]);	
					//alert(index4);
					registers.setItem(args[1],stack[stackPointer]);

					currentInstruction = args[0] + " " + args[1] + ", " + "[" + args[2] + ", " + "#" + args[3] +"]";
					document.getElementById("currentInstr").value = currentInstruction;

					//-----------------------------------------------------


				}else{
					var index1=parseInt(registers.getItem(args[2]))+parseInt(args[3]);
					registers.setItem(args[1],memory[index1]);
					//alert(registers.getItem(args[1]));
					//alert(index1);
					//addr.setItem('0x000018',index1);
					currentInstruction = args[0] + " " + args[1] + ", " + args[2] + ", "  + args[3] ;
					document.getElementById("currentInstr").value = currentInstruction;
				}
				
				//-----------------------------------------
				var Rn = convertRegName.getItem(args[2]);
				var Rd = convertRegName.getItem(args[1]);
				var operand2 = signExtend(immediateToBin(args[3]),12);
				
				//instruction = dataTrans(Rn, Rd, operand2, "011000");
				//instrMem[instCount] = instruction;
				//-----------------------------------------
			}


			else{
				//document.getElementById("outputText").innerHTML ='this is not reg';
				var index2=args[2];
				//alert(index2);
				memory[countmem]=(dataLabels.getItem(index2));

				//put the address of the data memory where the label is at into the register
				registers.setItem(args[1],countmem);

				//registers.setItem(args[1],dataLabels.getItem(index2));
				//alert(str2ascii(dataLabels.getItem(index2)));

				//addr.setItem('0x000024',index2);
				//memory[2]=str2hex(data.getItem(index2));
				//alert(data.getItem(index2));

				/*For load of a label, we consider it realtive to pc*/
				//ldr r2, [PC, #offset]
				//Calculating offset
				var ldrAddr = pcVal;
				var temp = (args[2].split("=").filter(Boolean));
				var regex = new RegExp(temp[0]);
				alert(regex);
				var destLine = findNextCommand(checkForLabel(regex));
				var destAddr = instAddresses.getItem(codeLines[destLine]);
				var offset =(destAddr-ldrAddr-8)/4;
				var operand2 = signExtend(dec2bin(offset).toString(), 12);
				
				var Rn = convertRegName.getItem('pc');
				var Rd = convertRegName.getItem(args[1]);

				//increment data memory hash for the next label
				countmem +=1;
				currentInstruction = args[0] + " " + args[1] + ", " + args[2] ;
				document.getElementById("currentInstr").value = currentInstruction;
				
			}			

				instruction = dataTrans(Rn, Rd, operand2, "011000");
				instrMem[pcVal] = instruction;
			
				updatePC(4);
	}
}
//-----------------------------------------------------------------------------------------------------
function mov(){   //------------------------> working

	this.excec = function(args){
	
		var instruction;
	
		if(isRegForMov(args)){
			//document.getElementById("outputText").innerHTML = args[2];
			registers.setItem(args[1],parseInt(registers.getItem(args[2])));
			//alert(registers.getItem(args[1]));
			
			//-----------------------------
			var operand2 = signExtend(convertRegName.getItem(args[2]),12);
			var I = "0";

			currentInstruction = args[0] + " " + args[1] + ", " + args[2] ;
			document.getElementById("currentInstr").value = currentInstruction;

			if(((args[1])== "pc")&&((args[2])=="lr")){
				
				disableExecution();
				
			}
			//-----------------------------
		}
		else{
			registers.setItem(args[1],parseInt(args[2]));
			
			//-----------------------------
			var operand2 = signExtend(immediateToBin(args[2]),12);
			var I = "1";
			//-----------------------------
			currentInstruction = args[0] + " " + args[1] + ", " + "#" + args[2] ;
			document.getElementById("currentInstr").value = currentInstruction;
		}

		//------------------------
		var Rd = convertRegName.getItem(args[1]);
		var Rn = "0000";
		instruction = dataProcess(I, Rn, Rd, operand2, "1101")
		instrMem[instCount] = instruction;
		if((!/pc/.test(args[1]))&&(!/lr/.test(args[2]))){ //Finally, value of lr is moved to pc
			updatePC(4);
		}
		//------------------------
	}

}
//-------------------------------------------------------------------------------------------------------------------------------
function bl(){

	this.excec = function(args){
	registers.setItem('lr', pcVal+4);
	//showRegisters();
	currentInstruction = args[0] + " " + "printf" ;
	document.getElementById("currentInstr").value = currentInstruction;
	printf();
	
	
	/*this.excec = function(args){
	var subCommands = new Hash('printf',new printf);
	
		var obj = subCommands.getItem(args);
		obj.excec();
	}*/
	}
}

//--------------------------------------------------------------------------------------------------------------------------------
function printf(){

	var regs=['r1','r2','r3','r4','r5'];

	//this.excec = function(){
		var indextoPrint=registers.getItem('r0');
		var toPrint = memory[indextoPrint];

		//var toPrint=registers.getItem('r0');

		//document.getElementById("outputText").innerHTML =toPrint;
		//calculate num of elements have to substitute
		var num = numOfFormats(toPrint);
		alert(num);

		if(haveFormats(toPrint)){				//if have to substitute
			var args = toPrint.split(/%[a-z]/);
			var string="";
			for(i=0;i<num;i++){
				alert(string);
				string=string+args[i]+" "+registers.getItem(regs[i+1])+" ";
				
			}
			//string = string+args[i];
			//var obj=document.getElementById("outputText");
			//	var txt=document.createTextNode(string);
			//	obj.appendChild(txt);
			document.getElementById("outputText").value = string;

			//var obj=document.getElementById("outputText");
			//var txt=document.createTextNode(string);
			//obj.appendChild(txt);
			
			
			
			//document.getElementById("outputText").innerHTML =string;
			//document.getElementById("outputText").innerHTML ='has formats' +num+args.length;
		}
		else{
			document.getElementById("outputText").innerHTML ='no formats'+num;
		}		
	//}
}

function scanf(){



}

//function to determine integers...
function isInt(x) {
   var y = parseInt(x, 10);
   return !isNaN(y) && x == y && x.toString() == y.toString();
}

//-----------------------------------------------------------------------------------------------------
//function to make a filled array 
function newFilledArray(len, val) {
    var rv = new Array(len);
    while (--len >= 0) {
        rv[len] = val;
    }
    return rv;
}
//-------------------------------------------------------------------------------
//function to determine whether have formats or not
function haveFormats(string){

	var myRegExp = /%[a-z]/;
	
	if(myRegExp.test(string)){
	    return true;
	}
	else{
		 return false;
	}
}
//-----------------------------------------------------------------------------------------------------------------------

function numOfFormats(text){  //---------------?????????????

	var args = text.split(/%[a-z]/);
	num = args.length-1; //-----------number 1 is not sure!!!!!..could be zero
	return num;
}
//-----------------------------------------------------------------------------------------------------------------------
function isReg(args){

	if (args.length<4){
		var myRegExp = /=/;
		if(myRegExp.test(args[2])){
	    		return false;
			//document.getElementById("outputText").innerHTML = '1';
		}
		else {
			return true;
			//document.getElementById("outputText").innerHTML = '2';
		}
	}
	else{
		return true;
		//document.getElementById("outputText").innerHTML = 'dddddfdf';
	}
}
//----------------------------------------------------------------------------------------------------------
//\W[slp][prc]\W/
//\W[r][0-9]\W/
function isRegForMov(args){
	var myRegExp1 = /[slp][prc]/;
	var myRegExp2 = /[r][0-9]/;

	if(myRegExp1.test(args[2])){
		return true;
		//document.getElementById("outputText").innerHTML = 'ela1';
	}
	else{
		if(myRegExp2.test(args[2])){
			return true;
			//document.getElementById("outputText").innerHTML = 'ela2';
		}
		else{
			return false;
			//document.getElementById("outputText").innerHTML = 'hapoi';
		}
	}
}

//------------------------------------------------------------------------------------------------------------------

//Returns true if branch is taken
function cmp(){	               //----------------> working

	this.excec= function(args){
	
		var instruction;
		var secondOp;
		
		
		if(args.length<4){		
			if(isInt(args[2])){	
				secondOp = parseInt(args[2]);
				
				//-----------------------------
				var operand2 = signExtend(immediateToBin(args[2]),12);
				var I = "1";
				//-----------------------------
				currentInstruction = args[0] + " " + args[1] + ", " + "#" + args[2] ;
				document.getElementById("currentInstr").value = currentInstruction;
				
			}else{
				secondOp = registers.getItem(args[2]);
				
				//-----------------------------
				var operand2 = signExtend(convertRegName.getItem(args[2]),12);
				var I = "0";
				//-----------------------------
				currentInstruction = args[0] + " " + args[1] + ", "  + args[2] ;
				document.getElementById("currentInstr").value = currentInstruction;
			}				
						
		if(/^beq$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])==secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
				//brancharg = "beq";
				//return true;
			}else{
				alert("branch not taken");
				//return false;
			}	
		}else if(/^bge$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])>=secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
				//brancharg ="bge";
				//return true;
		}else{
				alert("branch not taken");
				//return false;
		}
		}else if(/^ble$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])<=secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
				//brancharg ="ble";
				//return true;
			}else{
				alert("branch not taken");
				//return false;
			}		
		}else if(/^bne$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])!=secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
				//brancharg = "bne";
				//return true;
			}else{
				alert("branch not taken");
				//return false;
			}	
		}else if(/^bgt$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])>secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
				//brancharg ="bgt";
				//return true;
			}else{
				alert("branch not taken");
				//return false;
			}	
		}else if(/^blt$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])<secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
				//brancharg = "blt" ;
				//return true;
			}else{
				alert("branch not taken");
				//return false;
			}	
		}
		
			
		
		//-----------------------------
		var Rn = convertRegName.getItem(args[1]);
		var Rd = "0000";				
		instruction = dataProcess(I, Rn, Rd, operand2, "1010");
		instrMem[instCount] = instruction;
		updatePC(4);	
		//-----------------------------
		}		
	}
}
//----------------------------------------------------------------------------------------------------------------------------------

//Conditional branch
function branch(){   //------------------------> working
	
	this.excec= function(args){
	
		var nextLine;
		var regex = new RegExp(args[1]);

		var cond;
		
		if(/^beq$/.test(functionsHash.getItem(lineNum))){
			cond = "0000";
			brancharg = "beq";
		}else if(/^bne$/.test(functionsHash.getItem(lineNum))){
			cond = "0001";
			brancharg = "bne";
		}else if(/^bgt$/.test(functionsHash.getItem(lineNum))){
			cond = "1100";
			brancharg = "bgt";
		}else if(/^blt$/.test(functionsHash.getItem(lineNum))){
			cond = "1011";
			brancharg = "blt";
		}else if(/^bge$/.test(functionsHash.getItem(lineNum))){
			cond = "1010";
			brancharg = "bge";
		}else if(/^ble$/.test(functionsHash.getItem(lineNum))){
			cond = "1101";
			brancharg = "ble";
		}
		
		alert(args[0]);
		var instruction = branchFormat(cond, "0", "1", args[1]);
		instrMem[pcVal] = instruction;

		//alert("okay");
		if(cmpResult == 1){
			nextLine = checkForLabel(regex)+1;
			state = nextLine-startLine;
			var destLine = findNextCommand(checkForLabel(regex));
			var destAddr = instAddresses.getItem(codeLines[destLine]);

			updatePC(destAddr-pcVal); //New destination is not the immediate next instruction.
		
			//alert(state);
			lineByLine();
			state-=1;  //When control passes back to original lineByLine() call, state is incremented by 1 again. So 1 must be deducted to avoid double increment
			//alert(args[0]);
			instCount-=1;
			instIncrement-=4;
			currentInstruction = brancharg + " " + args[1] ;
			document.getElementById("currentInstr").value = currentInstruction;
			
		}else{ 
			state+=1;
			updatePC(4);
			lineByLine();
			state-=1;
			//pcVal-=4;
			instCount-=1;
			instIncrement-=4;
			//updatePC(4);
			//currentInstruction = args[0] + " " + args[1] ;
			//document.getElementById("currentInstr").value = currentInstruction;
		}
		
	}
}

//----------------------------------------------------------------------------------------------------------------------------------
//Unconditional branch
function b(){   //------------------------> working

	this.excec= function(args){
	
		var nextLine;
		var regex = new RegExp(args[1]);
		//alert("okay");
		nextLine = checkForLabel(regex)+1;
		state = nextLine-startLine;
			//alert(state);
		//lineByLine();
		//state-=1;  //When control passes back to original lineByLine() call, state is incremented by 1 again. So 1 must be deducted to avoid double increment		

		currentInstruction = args[0] + " " + args[1]  ;
		document.getElementById("currentInstr").value = currentInstruction;
		
		var instruction = branchFormat("1110", "0", "1", args[1]);
		instrMem[pcVal] = instruction;
		
		var destLine = findNextCommand(checkForLabel(regex));
		var destAddr = instAddresses.getItem(codeLines[destLine]);
		//alert(destAddr);
		updatePC(destAddr-pcVal);
		
		lineByLine();
		state-=1;  //When control passes back to original lineByLine() call, state is incremented by 1 again. So 1 must be deducted to avoid double increment		
		//pcVal-=4;
		instCount-=1;
		instIncrement-=4;

	}

}
//----------------------------------------------------------------------------------------------------------------------------------

//Instruction format for data processing instructions
function dataProcess(I, Rn, Rd, operand2, opCode){  //------------------------> working

	var cond = "1110";
	var F = "00";
	var opCode;
	//var I;
	var S = "0";
	//var Rn;
	//var Rd;
	//var operand2;

	var format = cond + F + I + opCode + S + Rn + Rd + operand2;
	
	return format;
};
//----------------------------------------------------------------------------------------------------------------------------------

//Instruction format for data transfer instructions
function dataTrans(Rn, Rd, operand2, opCode){  //------------------------> working

	var cond = "1110";
	var F = "01";
	var opCode;
	
	var format = cond + F + opCode + Rn + Rd + operand2;
	
	return format;
};

//------------------------------------------------------------------------
//Instruction format for branch instructions
/*
Format: cond:4bits
		Offset:24 bits
		opCode+L bit:4 bits  (L=0 for b and L=1 for bl and opCode = 101)
offset = (Destination addr - branch addr - 8)/4
8 is subtracted to allow for pipelining. Divided by 4 to get the word address.
*/

function branchFormat(cond, L, Btaken, label){

	var branchAddr = pcVal;
	var destAddr;
	var destLine;
	var nextLine;
	
	
	
	var regex = new RegExp(label);
	if(Btaken == 1){
		//destLine = checkForLabel(regex)+1;
		//functionsHash.getItem(lineNum+1)
		destLine = findNextCommand(checkForLabel(regex));
		//alert(destLine);
		
		destAddr = instAddresses.getItem(codeLines[destLine]);
		//alert(destAddr);
	}else{
		destAddr = pcVal+4;
	}
	
	var offset =(destAddr-branchAddr-8)/4;
	var binOffset = signExtend(dec2bin(offset).toString(), 24);
	
	var format = cond + "101" + L + binOffset;
	
	return format; 
};

//------------------------------------------------------------------------
//To convert an immediate decimal value to a binary number
function immediateToBin(num){   //------------------------> working

	var intNum = parseInt(num); 
	var binNum = dec2bin(intNum);
	var str = binNum.toString();
	
	return str;
}
//----------------------------------------------------------------------------
//Function to convert length of operand2 to 12 bits
function signExtend(str,bits){    //------------------------> working

	var lacking = bits - str.length;
	
	if(lacking<bits){	
		for(var i=0; i<lacking; i++){
			str = "0"+str;
		}	
	}
	
	return str;
}

//-----------------------------------------------------------------------------

function putWords(arg,val){
	for(i=0;i<words.length;i++){
		if (args==0){
			words[0] = val;
		}else if (args==1){
			words[1] = val;
		}else if (args==2){
			words[2] = val;
		}else{
			words[3] = val;
		}
	}
	return words;

};

//------------------------------------------------------------------------------------------
//disable execution before .data is reached

function disableExecution() {
     document.getElementById("StepByStep").disabled = true;
     alert("Reached End of Execution!");
};





