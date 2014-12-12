
//-------------------------------------------------------------------------------------------------------------------------------------
var memory=newFilledArray(100, 0);
var stack = newFilledArray(100,0);
var instrMem = newFilledArray(104, "00000000000000000000000000000000");
var instrPointer = newFilledArray(104,"");
var dataLabels = new Hash ();
var stackPointer;
var countmem = 0;
var stackallocation;
var registers=new Hash('r0',0,'r1',0,'r2',0,'r3',0,'r4',0,'r5',0,'r6',0,'r7',0,'r8',0,'r9',0,'r10',0,'r11',0,'r12',0,'sp',8, 'lr',234,'pc',0);

var convertRegName=new Hash('r0',"0000",'r1',"0001",'r2',"0010",'r3',"0011",'r4',"0100",'r5',"0101",'r6',"0110",'r7',"0111",'r8',"1000",'r9',"1001",'r10',"1010",'r11',"1011",'r12',"1100",'sp',"1101", 'lr',"1110",'pc',"1111");

var commands = new Hash('exfunction',new exfunction(),'sub',new sub(),'add',new add(),'str',new str(),'ldr',new ldr(),'bl',new bl(),'mov',new mov(), 'cmp', new cmp(), 'branch', new branch(), 'b' , new b(), 'mul', new mul());

var copyReg = new Hash();
var copyReg2 = new Hash();

var copyStack = newFilledArray();

var functionsHash = new Hash();
var instAddresses = new Hash();
var labels = new Hash ();

var cmpResult = 0; //Stores the result of cmp. i.e. whether branch is taken or not
//--------------------------------------------------------------------------------------------------------------------------------
function exfunction(){

this.excec= function(num)
	{
		registers.setItem('sp',num);
	}

}
//----------------------------------------------------------------------------------------------------------------------------------

function sub(){ //------------------------> working
	this.excec= function(args){
		if(args.length<5){
			if(isInt(args[3])){
				registers.setItem(args[1],registers.getItem(args[2])-parseInt(args[3]));

				currentInstruction = "sub" + " " + args[1] + ", " + args[2] + ", " + "#" + args[3] ;
				document.getElementById("currentInstr").value = currentInstruction;
			
			//-------------------------------------------------------

			if (args[1]=="sp"){
					stackallocation = Math.pow(2, (args[3]*4)) - 1;
				}

			}
			else{
				registers.setItem(args[1],registers.getItem(args[2])-registers.getItem(args[3]));
				
				currentInstruction = "sub" + " " + args[1] + ", " + args[2] + ", "  + args[3] ;
				document.getElementById("currentInstr").value = currentInstruction;
			}
			
			instrPointer[pcVal] = ">" ;
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
				
				currentInstruction = "add" + " " + args[1] + ", " + args[2] + ", " + "#" + args[3] ;
				document.getElementById("currentInstr").value = currentInstruction;
			}
			else{
				registers.setItem(args[1],registers.getItem(args[2])+registers.getItem(args[3]));
				
				currentInstruction = "add" + " " + args[1] + ", " + args[2] + ", " + args[3] ;
				document.getElementById("currentInstr").value = currentInstruction;
			}
			
				instrPointer[pcVal] = ">" ;
				updatePC(4);
				//-----------------------------------------
		}		
	}
}
//----------------------------------------------------------------------------------------------------------------------------------
function str(){

	this.excec = function(args){
	
		if (args[2]=="sp"){
			
			var index3 = registers.getItem("sp");
			stackPointer = index3;
			
			stack[index3]=registers.getItem(args[1]);
			
			currentInstruction = "str" + " " + args[1] + ", " + "[" + args[2] + ", " + "#" + args[3] + "]" ;
			document.getElementById("currentInstr").value = currentInstruction;

			//----------------------------------
			if (index3>stackallocation){
						alert("Stack overflow!!!");
						document.getElementById("StepByStep").disabled = true;
					}

		}else{
			var index=parseInt(registers.getItem(args[2]))+parseInt(args[3]);
			memory[index]=registers.getItem(args[1]);

			currentInstruction = "str" + " " + args[1] + ", " + args[2] + ", "  + args[3] ;
			document.getElementById("currentInstr").value = currentInstruction;
		}
		
		instrPointer[pcVal] = ">" ;
		updatePC(4);
		//-----------------------------------------
	}

}
//-------------------------------------------------------------------------------------------------------------

function ldr(){

	
	this.excec = function(args){
		
		var instruction;
		
			if(isReg(args)){
				
				if(args[2]=="sp"){
					
					registers.setItem(args[1],stack[stackPointer]);
					currentInstruction = "ldr" + " " + args[1] + ", " + "[" + args[2] + ", " + "#" + args[3] +"]";
					document.getElementById("currentInstr").value = currentInstruction;
				}else{
					var index1=parseInt(registers.getItem(args[2]))+parseInt(args[3]);
					registers.setItem(args[1],memory[index1]);
					
					currentInstruction = "ldr" + " " + args[1] + ", " + args[2] + ", "  + args[3] ;
					document.getElementById("currentInstr").value = currentInstruction;
				}
			
			}


			else{
				
				var index2=args[2];
				
				memory[countmem]=(dataLabels.getItem(index2));

				//put the address of the data memory where the label is at into the register
				registers.setItem(args[1],countmem);

				//increment data memory hash for the next label
				countmem +=4;
				currentInstruction = "ldr" + " " + args[1] + ", " + args[2] ;
				document.getElementById("currentInstr").value = currentInstruction;
				
			}	
				instrPointer[pcVal] = ">" ;
				updatePC(4);
	}
}
//-----------------------------------------------------------------------------------------------------
function mov(){   //------------------------> working

	this.excec = function(args){
	
		var instruction;
	
		if(isRegForMov(args)){
			
			registers.setItem(args[1],parseInt(registers.getItem(args[2])));
			
			currentInstruction = "mov" + " " + args[1] + ", " + args[2] ;
			document.getElementById("currentInstr").value = currentInstruction;

			if(((args[1])== "pc")&&((args[2])=="lr")){
				
				disableExecution();
				
			}
		
		}
		else{
			registers.setItem(args[1],parseInt(args[2]));

			currentInstruction = "mov" + " " + args[1] + ", " + "#" + args[2] ;
			document.getElementById("currentInstr").value = currentInstruction;
		}

		instrPointer[pcVal] = ">" ;
		if((!/pc/.test(args[1]))&&(!/lr/.test(args[2]))){ //Finally, value of lr is moved to pc
			updatePC(4);
		}
		
	}

}
//-------------------------------------------------------------------------------------------------------------------------------
function bl(){

	this.excec = function(args){
	registers.setItem('lr', pcVal+4);
	currentInstruction = args[0] + " " + "printf" ;
	document.getElementById("currentInstr").value = currentInstruction;
	instrPointer[pcVal] = ">" ;
	printf();
	updatePC(4);
	}
}

//--------------------------------------------------------------------------------------------------------------------------------
function printf(){

	var regs=['r1','r2','r3','r4','r5'];

		var indextoPrint=registers.getItem('r0');
		var toPrint = memory[indextoPrint];

		var num = numOfFormats(toPrint);
		
		if(haveFormats(toPrint)){				//if have to substitute
			var args = toPrint.split(/%[a-z]/);
			var string="";
			for(i=0;i<num;i++){
				
				string=string+args[i]+" "+registers.getItem(regs[i])+" ";
				
			}
			
			addText(string);
		}
		else{
			
			addText(toPrint);
		}		
}

function scanf(){


}



//Returns true if branch is taken
function cmp(){	               //----------------> working

	this.excec= function(args){
	
		var instruction;
		var secondOp;
		
		if(args.length<4){		
			if(isInt(args[2])){	
				secondOp = parseInt(args[2]);
				
				currentInstruction = "cmp" + " " + args[1] + ", " + args[2] ;
				document.getElementById("currentInstr").value = currentInstruction;
				
			}else{
				secondOp = registers.getItem(args[2]);
				
				currentInstruction = "cmp" + " " + args[1] + ", " + "#" + args[2] ;
				document.getElementById("currentInstr").value = currentInstruction;
			}				
						
		if(/^beq$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])==secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
			}else{
				alert("branch not taken");
			}	
		}else if(/^bge$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])>=secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
		}else{
				alert("branch not taken");
		}
		}else if(/^ble$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])<=secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
			}else{
				alert("branch not taken");
			}		
		}else if(/^bne$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])!=secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
			}else{
				alert("branch not taken");
			}	
		}else if(/^bgt$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])>secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
			}else{
				alert("branch not taken");
			}	
		}else if(/^blt$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])<secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
			}else{
				alert("branch not taken");
			}	
		}
		
		instrPointer[pcVal] = ">" ;
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
		var brancharg;

		instrPointer[pcVal] = ">" ;

		if(/^beq$/.test(functionsHash.getItem(lineNum))){
			brancharg = "beq";
		}else if(/^bne$/.test(functionsHash.getItem(lineNum))){
			brancharg = "bne";
		}else if(/^bgt$/.test(functionsHash.getItem(lineNum))){
			brancharg = "bgt";
		}else if(/^blt$/.test(functionsHash.getItem(lineNum))){
			brancharg = "blt";
		}else if(/^bge$/.test(functionsHash.getItem(lineNum))){
			brancharg = "bge";
		}else if(/^ble$/.test(functionsHash.getItem(lineNum))){
			brancharg = "ble";
		}

		if(cmpResult == 1){
			nextLine = checkForLabel(regex)+1;
			state = nextLine-startLine;
		
			var destLine = findNextCommand(checkForLabel(regex));
			var destAddr = instAddresses.getItem(codeLines[destLine]);

			updatePC(destAddr-pcVal); //New destination is not the immediate next instruction.
		
			lineByLine();
			state-=1;  //When control passes back to original lineByLine() call, state is incremented by 1 again. So 1 must be deducted to avoid double increment
			
			instIncrement-=4;
			currentInstruction = brancharg + " " + args[1] ;
			document.getElementById("currentInstr").value = currentInstruction;
					
		}else{ 
		
			state+=1;
			updatePC(4);
			lineByLine();
			state-=1;
			
			instIncrement-=4;
		}

	}
}

//----------------------------------------------------------------------------------------------------------------------------------
//Unconditional branch
function b(){   //------------------------> working

	this.excec= function(args){
	
		var nextLine;
		var regex = new RegExp(args[1]);
		
		nextLine = checkForLabel(regex)+1;
		state = nextLine-startLine;
		
		currentInstruction = "b" + " " + args[1]  ;
		document.getElementById("currentInstr").value = currentInstruction;
		
		instrPointer[pcVal] = ">" ;
		
		var destLine = findNextCommand(checkForLabel(regex));
		var destAddr = instAddresses.getItem(codeLines[destLine]);
		
		updatePC(destAddr-pcVal);
		
		lineByLine();
		state-=1;  //When control passes back to original lineByLine() call, state is incremented by 1 again. So 1 must be deducted to avoid double increment		 
		
		instIncrement-=4;		
	}

}
//----------------------------------------------------------------------------------------------------------------------------------

//Instruction format for data processing instructions
function dataProcess(I, Rn, Rd, operand2, opCode){  //------------------------> working

	var cond = "1110";
	var F = "00";
	var opCode;
	var S = "0";

	var format = cond + F + I + opCode + S + Rn + Rd + operand2;
	
	return format;
};
//----------------------------------------------------------------------------------------------------------------------------------

function mul(){	//------------------------> working

	this.excec= function(args){
	
		var instruction;	
	
		if(args.length<5){
			if(isInt(args[3])){
				registers.setItem(args[1],registers.getItem(args[2])*parseInt(args[3]));
				/* 
				//-----------------------------------------
				var operand2 = signExtend(immediateToBin(args[3]),12);
				var I = "1";
				//----------------------------------------- */
				currentInstruction = "mul" + " " + args[1] + ", " + args[2] + ", " + "#" + args[3] ;
				document.getElementById("currentInstr").value = currentInstruction;
			}
			else{
				registers.setItem(args[1],registers.getItem(args[2])*registers.getItem(args[3]));
				
			/* 	//-----------------------------------------
				var operand2 = signExtend(convertRegName.getItem(args[3]), 12);
				var I = "0";
				//----------------------------------------- */
				currentInstruction = "mul" + " " + args[1] + ", " + args[2] + ", " + args[3] ;
				document.getElementById("currentInstr").value = currentInstruction;
			}
			
			/* 	//-----------------------------------------
				var Rn = convertRegName.getItem(args[2]);
				var Rd = convertRegName.getItem(args[1]);
					
				//instruction = instruction+args[2]+args[1]+args[3]
				instruction = dataProcess(I, Rn, Rd, operand2, "0100");
				instrMem[pcVal] = instruction; */
				instrPointer[pcVal] = ">" ;
				updatePC(4);
				//-----------------------------------------
		}		
	}
}
//----------------------------------------------------------------------------------

//Instruction format for data transfer instructions
function dataTrans(Rn, Rd, operand2, opCode){  //------------------------> working

	var cond = "1110";
	var F = "01";
	var opCode;
	
	var format = cond + F + opCode + Rn + Rd + operand2;
	
	return format;
};
//----------------------------------------------------------------------------

//Instruction set format for multiplication instructions
function mulFormat(Rd, Rs, Rm){

	var cond = "1110";
	var A = "0";
	var S = "0";
	var Rn = "0000";
	
	var format = cond + "000000" + A + S + Rd + Rn + Rs + "1001" + Rm;

	return format;
	
}

//-----------------------------------------------------------------------
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
	
		destLine = findNextCommand(checkForLabel(regex));	
		destAddr = instAddresses.getItem(codeLines[destLine]);

	}else{
		destAddr = pcVal+4;
	}
	
	var offset =(destAddr-branchAddr-8)/4;
	var binOffset = signExtend(dec2bin(offset).toString(), 24);
	
	var format = cond + "101" + L + binOffset;
	
	return format; 
};

//------------------------------------------------------------------------

//Instruction format for data processing instructions
function dataProcess(I, Rn, Rd, operand2, opCode){  //------------------------> working

	var cond = "1110";
	var F = "00";
	var opCode;
	var S = "0";

	var format = cond + F + I + opCode + S + Rn + Rd + operand2;
	
	return format;
};
//----------------------------------------------------------------------------------------------------------------------------------

//To convert an immediate decimal value to a binary number
function immediateToBin(num){   //------------------------> working

	var intNum = parseInt(num); 
	var binNum = dec2bin(intNum);
	var str = binNum.toString();
	
	return str;
}
//----------------------------------------------------------------------------
//Function to convert length of operand2 to 12 bits
function signExtend(str, bits){    //------------------------> working

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

function selectTextareaLine(tarea,lineNum) {
    lineNum--; // array starts at 0
    var lines = tarea.value.split("\n");

    // calculate start/end
    var startPos = 0, endPos = tarea.value.length;
    for(var x = 0; x < lines.length; x++) {
        if(x == lineNum) {
            break;
        }
        startPos += (lines[x].length+1);

    }

    var endPos = lines[lineNum].length+startPos;

    // do selection
    // Chrome / Firefox

    if(typeof(tarea.selectionStart) != "undefined") {
        tarea.focus();
        tarea.selectionStart = startPos;
        tarea.selectionEnd = endPos;
        return true;
    }

    // IE
    if (document.selection && document.selection.createRange) {
        tarea.focus();
        tarea.select();
        var range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd("character", endPos);
        range.moveStart("character", startPos);
        range.select();
        return true;
    }

    return false;
}


//----------------------------------------------------------------------------------------------------------------------------


function addText(input){

	var obj=document.getElementById("outputText");
	obj.value+=input + "\n";
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
	
		if(/@/.test(args[3])){
			return false;
		}
		else{
			return true;
		}
	}
}
//----------------------------------------------------------------------------------------------------------

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
