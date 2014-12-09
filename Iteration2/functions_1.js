
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

var registers=new Hash('r0',0,'r1',0,'r2',0,'r3',0,'r4',0,'r5',0,'r6',0,'r7',0,'r8',0,'r9',0,'r10',0,'r11',0,'r12',0,'sp',8, 'lr',234,'pc',34);

var convertRegName=new Hash('r0',"0000",'r1',"0001",'r2',"0010",'r3',"0011",'r4',"0100",'r5',"0101",'r6',"0110",'r7',"0111",'r8',"1000",'r9',"1001",'r10',"1010",'r11',"1011",'r12',"1100",'sp',"1101", 'lr',"1110",'pc',"1111");

var commands = new Hash('exfunction',new exfunction(),'sub',new sub(),'add',new add(),'str',new str(),'ldr',new ldr(),'bl',new bl(),'mov',new mov(), 'cmp', new cmp(), 'branch', new branch(), 'b' , new b());

//var addr = new Hash('0x000000','00 00 00 00','0x000018','00 00 00 00','0x000024','00 00 00 00');

var copyReg = new Hash();
var copyReg2 = new Hash();

var copyStack = newFilledArray();

var functionsHash = new Hash();

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
				var operand2 = signExtend(immediateToBin(args[3]));
				var I = "1";
				//-----------------------------

				currentInstruction = "sub" + " " + args[1] + ", " + args[2] + ", " + "#" + args[3] ;
				document.getElementById("currentInstr").value = currentInstruction;
			}
			else{
				registers.setItem(args[1],registers.getItem(args[2])-registers.getItem(args[3]));
				
				//-----------------------------
				var operand2 = signExtend(convertRegName.getItem(args[3]));
				var I = "0";
				//-----------------------------

				currentInstruction = "sub" + " " + args[1] + ", " + args[2] + ", "  + args[3] ;
				document.getElementById("currentInstr").value = currentInstruction;
			}
			
			//-----------------------------
			var Rn = convertRegName.getItem(args[2]);
			var Rd = convertRegName.getItem(args[1]);
					
			//instruction = instruction+args[2]+args[1]+args[3]
			instruction = dataProcess(I, Rn, Rd, operand2, "0010");
			instrMem[instCount] = instruction;
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
				var operand2 = signExtend(immediateToBin(args[3]));
				var I = "1";
				//-----------------------------------------
				currentInstruction = "add" + " " + args[1] + ", " + args[2] + ", " + "#" + args[3] ;
				document.getElementById("currentInstr").value = currentInstruction;
			}
			else{
				registers.setItem(args[1],registers.getItem(args[2])+registers.getItem(args[3]));
				
				//-----------------------------------------
				var operand2 = signExtend(convertRegName.getItem(args[3]));
				var I = "0";
				//-----------------------------------------
				currentInstruction = "add" + " " + args[1] + ", " + args[2] + ", " + args[3] ;
				document.getElementById("currentInstr").value = currentInstruction;
			}
			
				//-----------------------------------------
				var Rn = convertRegName.getItem(args[2]);
				var Rd = convertRegName.getItem(args[1]);
					
				//instruction = instruction+args[2]+args[1]+args[3]
				instruction = dataProcess(I, Rn, Rd, operand2, "0100");
				instrMem[instCount] = instruction;
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
			currentInstruction = "str" + " " + args[1] + ", " + "[" + args[2] + ", " + "#" + args[3] + "]" ;
			document.getElementById("currentInstr").value = currentInstruction;


		}else{
			var index=parseInt(registers.getItem(args[2]))+parseInt(args[3]);
			memory[index]=registers.getItem(args[1]);

			currentInstruction = "str" + " " + args[1] + ", " + args[2] + ", "  + args[3] ;
			document.getElementById("currentInstr").value = currentInstruction;
		}
		//memory[index]=registers.getItem(args[1]);
		
		//-----------------------------------------
		var Rn = convertRegName.getItem(args[1]);
		var Rd = convertRegName.getItem(args[2]);
		var operand2 = signExtend(immediateToBin(args[3]));
				
		instruction = dataTrans(Rn, Rd, operand2, "011001");
		instrMem[instCount] = instruction;
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
					currentInstruction = "ldr" + " " + args[1] + ", " + "[" + args[2] + ", " + "#" + args[3] +"]";
					document.getElementById("currentInstr").value = currentInstruction;
				}else{
					var index1=parseInt(registers.getItem(args[2]))+parseInt(args[3]);
					registers.setItem(args[1],memory[index1]);
					//alert(registers.getItem(args[1]));
					//alert(index1);
					//addr.setItem('0x000018',index1);
					currentInstruction = "ldr" + " " + args[1] + ", " + args[2] + ", "  + args[3] ;
					document.getElementById("currentInstr").value = currentInstruction;
				}
				
				//-----------------------------------------
				var Rn = convertRegName.getItem(args[2]);
				var Rd = convertRegName.getItem(args[1]);
				var operand2 = signExtend(immediateToBin(args[3]));
				
				instruction = dataTrans(Rn, Rd, operand2, "011000");
				instrMem[instCount] = instruction;
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

				//increment data memory hash for the next label
				countmem +=1;
				currentInstruction = "ldr" + " " + args[1] + ", " + args[2] ;
				document.getElementById("currentInstr").value = currentInstruction;
				
			}			
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
			var operand2 = signExtend(convertRegName.getItem(args[2]));
			var I = "0";

			currentInstruction = "mov" + " " + args[1] + ", " + args[2] ;
			document.getElementById("currentInstr").value = currentInstruction;

			if(((args[1])== "pc")&&((args[2])=="lr")){
				
				disableExecution();
				
			}
			//-----------------------------
		}
		else{
			registers.setItem(args[1],parseInt(args[2]));
			
			//-----------------------------
			var operand2 = signExtend(immediateToBin(args[2]));
			var I = "1";
			//-----------------------------
			currentInstruction = "mov" + " " + args[1] + ", " + "#" + args[2] ;
			document.getElementById("currentInstr").value = currentInstruction;
		}

		//------------------------
		var Rd = convertRegName.getItem(args[1]);
		var Rn = "0000";
		instruction = dataProcess(I, Rn, Rd, operand2, "1101")
		instrMem[instCount] = instruction;

		//------------------------
	}

}
//-------------------------------------------------------------------------------------------------------------------------------
function bl(){

	this.excec = function(args){
	registers.setItem('lr', pcVal+4);
	//showRegisters();
	printf();
	//currentInstruction = "bl" + " " + "printf" ;
	//document.getElementById("currentInstr").value = currentInstruction;
	
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
		var toPrint=registers.getItem('r0');
		//document.getElementById("outputText").innerHTML =toPrint;
		//calculate num of elements have to substitute
		var num = numOfFormats(toPrint);
		if(haveFormats(toPrint)){				//if have to substitute
			var args = toPrint.split(/%[a-z]/);
			var string="";
			for(i=0;i<num;i++){
				string=string+args[i]+" "+registers.getItem(regs[i+1])+" ";
				
			}
			//string = string+args[i];
			var obj=document.getElementById("outputText");
				var txt=document.createTextNode(string);
				obj.appendChild(txt);
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
				var operand2 = signExtend(immediateToBin(args[2]));
				var I = "1";
				//-----------------------------
				currentInstruction = "cmp" + " " + args[1] + ", " + args[2] ;
				document.getElementById("currentInstr").value = currentInstruction;
				
			}else{
				secondOp = registers.getItem(args[2]);
				
				//-----------------------------
				var operand2 = signExtend(convertRegName.getItem(args[2]));
				var I = "0";
				//-----------------------------
				currentInstruction = "cmp" + " " + args[1] + ", " + "#" + args[2] ;
				document.getElementById("currentInstr").value = currentInstruction;
			}				
						
		if(/^beq$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])==secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
				//return true;
			}else{
				alert("branch not taken");
				//return false;
			}	
		}else if(/^bge$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])>=secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
				//return true;
		}else{
				alert("branch not taken");
				//return false;
		}
		}else if(/^ble$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])<=secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
				//return true;
			}else{
				alert("branch not taken");
				//return false;
			}		
		}else if(/^bne$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])!=secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
				//return true;
			}else{
				alert("branch not taken");
				//return false;
			}	
		}else if(/^bgt$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])>secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
				//return true;
			}else{
				alert("branch not taken");
				//return false;
			}	
		}else if(/^blt$/.test(functionsHash.getItem(lineNum+1))){
			if(registers.getItem(args[1])<secondOp){
				alert(functionsHash.getItem(lineNum+1));
				cmpResult = 1;
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
		//alert("okay");
		if(cmpResult == 1){
			nextLine = checkForLabel(regex)+1;
			state = nextLine-startLine;
			//alert(state);
			lineByLine();
			state-=1;  //When control passes back to original lineByLine() call, state is incremented by 1 again. So 1 must be deducted to avoid double increment
		}else{ 
			state+=1;
			lineByLine();
			state-=1;
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
		lineByLine();
		state-=1;  //When control passes back to original lineByLine() call, state is incremented by 1 again. So 1 must be deducted to avoid double increment		

		currentInstruction = "b" + " " + args[1]  ;
			document.getElementById("currentInstr").value = currentInstruction;
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
//To convert an immediate decimal value to a binary number
function immediateToBin(num){   //------------------------> working

	var intNum = parseInt(num); 
	var binNum = dec2bin(intNum);
	var str = binNum.toString();
	
	return str;
}
//----------------------------------------------------------------------------
//Function to convert length of operand2 to 12 bits
function signExtend(str){    //------------------------> working

	var lacking = 12 - str.length;
	
	if(lacking<12){	
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





