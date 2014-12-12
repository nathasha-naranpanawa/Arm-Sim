/*
Problems: when there are tabs in blank lines
		  Comments starting with tab or space
*/

var lineNum; //Stores the current line number
var codeLines;  //Stores all the commands as an array
var state = 0;  //Stores state regarding the current line to be executed
var startLine; //Place where main: starts
var pcVal = 0;
var instCount = 0; //Keeps track of the number of instructions executed
var currentInstruction="";
var instIncrement = 0;
var indexMem = 0;
var indexLine =0;

function lineByLine()
{
	
	if (instrMem[0]=="00000000000000000000000000000000"){
		initialize();
		instrPointer[0] = "" ;
		document.getElementById("StepByStep").disabled = true;
		
		alert("Compile first!!");
				
	}else{
	
	//Storing code lines in an array
	var editorContent=editor.getValue();
	codeLines = editorContent.split("\n");
	
	//Remove white spaces at the beginning and end of a codeLines
	for(var i=0; i<codeLines.length; i++){
		codeLines.splice(i, 1, codeLines[i].trim());
	}	
	
	getLabels(codeLines); 
	getOperations();
	getinstAddresses();

	startLine = checkForLabel(/main:/) + 1;  //Execution should be started from the line following main
	var i = startLine+state;
	
		var commentTest = (/@/.test(codeLines[i].charAt(0))); //Checking for comments
		var labelTest = labels.hasItem(codeLines[i]); 
		
		//Lines that can't be compiled
		while((commentTest||!codeLines[i]||labelTest)){ //(!codeLines[i]) check if the line is blank

			state+=1;
			i = startLine+state;
			
			var commentTest = (/@/.test(codeLines[i].charAt(0))); //Checking for comments
			var mainTest = /main:/.test( codeLines[i]); //checking for main: label -------> Just for now!! should change later!!!!
			var labelTest = labels.hasItem(codeLines[i]); 
			
		}
		
		//Split one line of code
		var splitLine = codeLines[i].split(/[ ,\t]+/).filter(Boolean); //-----> working. filter(Boolean) removes null values
			
		lineNum = i;
		
		if(splitLine.length>4){
			splitLine = splitLine.slice(0, 4); //When there are comments at the end of a code line
		}
		
		
		noSpecialChars(splitLine);
		runCommand(splitLine);
		instCount+=1; //number of instructions executed
		
		document.getElementById("inst").value =  instCount;
		state+=1;
		instIncrement+=4;
		indexLine +=1;

		}
}


//------------------------------------------------------
function runCommand(command) {    //-------------> working
	var args=command;
	
	if(/beq/.test(args[0])||/bne/.test(args[0])||/bgt/.test(args[0])||/blt/.test(args[0])||/bge/.test(args[0])||/ble/.test(args[0])){
		args.splice(0, 1, "branch");  //All conditional branch commands are handled by branch() method
	}
	var obj = commands.getItem(args[0]); 
	obj.excec(args);
	showRegisters();
}

//----------------------------------------------------------------------------------------------------------
function showRegisters(){     //-------------> working

	var regs=['r0','r1','r2','r3','r4','r5','r6','r7','r8','r9','r10','r11','r12','sp','lr','pc'];
	var string="";
	for(i=0;i<regs.length;i++){
		string=string+regs[i]+" = "+registers.getItem(regs[i])+"\n";
	}
	document.getElementById("outputregisters").innerHTML =string;	

	string3="";
	var j=0;
	while(j<memory.length-4){

		string3=string3+dec2hex(j)+" : " + memory[j] + "\n";
		j+=4;
	}
		document.getElementById("memory").innerHTML =string3;

		string4="";
	var k=0;
	while(k<stack.length-4){

		string4=string4+dec2hex(k)+" : " + stack[k]+ "\n";
		k +=4;
		
	}
		document.getElementById("stack").innerHTML =string4;
		copyStack = stack ;


		string5="";
	var l=0;
	while(l<instrMem.length-4){

		string5=string5+l+" : " + instrMem[l] + "\n";
		l +=4;
		
	}
		document.getElementById("Instr").innerHTML =string5;

			string6="";
	var q=0;
	while(q<instrPointer.length-4){

		string6=string6+ instrPointer[q] + "\n";
		q +=4;
		
	}
		document.getElementById("indicator").innerHTML =string6;


};
//----------------------------------------------------------------------------------------------------------
function showCopyRegisters(){     //-------------> working

	var regs=['r0','r1','r2','r3','r4','r5','r6','r7','r8','r9','r10','r11','r12','sp','lr','pc'];
	var string="";
	for(i=0;i<regs.length;i++){
		string=string+regs[i]+" = "+copyReg.getItem(regs[i])+"\n";
	}
	document.getElementById("outputregisters").innerHTML =string;	

	string3="";
	for(j=0;j<memory.length;j++){

		string3=string3+dec2hex(j)+" : " + memory[j] + "\n";
		
	}
		document.getElementById("memory").innerHTML =string3;

		string4="";
	var k=0;
	while(k<stack.length-4){
	
		string4=string4+dec2hex(k)+" : " + stack[k] + "\n";
		k +=4;
		
	}
		document.getElementById("stack").innerHTML =string4;
		copyStack = stack ;

		string5="";
	var l=0;
	while(l<instrMem.length-4){

		string5=string5+l+" : " + instrMem[l] + "\n";
		l +=1;
		
	}
		document.getElementById("Instr").innerHTML =string5;

				string6="";
	var q=0;
	while(q<instrPointer.length-4){
	
		string6=string6+ instrPointer[q] + "\n";
		q +=4;
		
	}
		document.getElementById("indicator").innerHTML =string6;


};	



//----------------------------------------------------------------------------------------------------------

//Storing labels 
function getLabels(codes){   //-----------> working

	for(var i=0; i<codes.length; i++){

		if(/:/.test( codes[i]) && !(/@/.test(codes[i]))){
			labels.setItem(codes[i],i);
			
			var dataline = codes[i].split(/"([^"]+)"/);

			var key = dataline[0].split(":");
			
			dataLabels.setItem("="+key[0],dataline[1]);
			
		}	
	}
}

//----------------------------------------------------------------------------------------------------------

//Initialize the registers
function initialize(){   //-------------> working
	instCount =0;
	document.getElementById("inst").value =  instCount;
	document.getElementById("currentInstr").value =  "";
	document.getElementById("outputText").value =  "";
	document.getElementById("inputs").value =  "";
	
	var num = 0;
	index=0;
	
	registers.setItem('r0',num);
	registers.setItem('r1',num);
	registers.setItem('r2',num);
	registers.setItem('r3',num);
	registers.setItem('r4',num);
	registers.setItem('r5',num);
	registers.setItem('r6',num);
	registers.setItem('r7',num);
	registers.setItem('r8',num);
	registers.setItem('r9',num);
	registers.setItem('r10',num);
	registers.setItem('r11',num);
	registers.setItem('r12',num);
	registers.setItem('sp',8);
	registers.setItem('lr',234);
	registers.setItem('pc',0);

	for(i=0;i<memory.length;i++){
		memory[i]=0;
	}

	for(j=0;j<stack.length;j++){
		stack[j]=0;
	}

	for(p=0;p<instrMem.length;p++){
		instrMem[p] = "00000000000000000000000000000000" ;
	}

	for(q=0;q<instrPointer.length;q++){
		instrPointer[q] = "" ;
	}

	state = 0;
	cmpResult = 0;
	pcVal = 0;
	var instIncrement = 0;
	indexMem = 0;
	indexLine = 0;
	countmem = 0;
	showRegisters();

}

//----------------------------------------------------------------------------------------------------------
//Puts operations in each command in a hashmap along with their line numbers
function getOperations(){    //-------------> working

var count = codeLines.length;

for(var i=0; i<count; i++){  

		var commentTest = (/@/.test(codeLines[i].charAt(0))); //Checking for comments
		var textTest = (/.text/.test( codeLines[i]));  //checking for .text keyword 
		var globalTest = /.global/.test( codeLines[i]); //checking for .global keyword
		var mainTest = /main:/.test( codeLines[i]); //checking for main: label -------> Just for now!! should change later!!!!
		var labelTest = labels.hasItem(codeLines[i]); 
	
		if(!(commentTest||textTest||globalTest||mainTest||!codeLines[i]||labelTest)){ //(!codeLines[i]) check if the line is blank

			var splitLine = codeLines[i].split(/[ ,\t]+/).filter(Boolean); //-----> working. filter(Boolean) removes null values
			functionsHash.setItem(i, splitLine[0]); //Store function names with their line numbers
			
		}
	}	
}
//----------------------------------------------------------------------------------------------------------

//Returns line number of the given label
function checkForLabel(labelName){   //-------------> working

	for (var i=0; i<codeLines.length; i++){
		if(labelName.test(codeLines[i]) && !(/@/.test(codeLines[i]))&&(/:/.test(codeLines[i]))){
			return i;
		}	
	}

}

//----------------------------------------------------------------------------------------------------------

(function(){
 
    var convertBase = function (num) {
        this.from = function (baseFrom) {
            this.to = function (baseTo) {
                return parseInt(num, baseFrom).toString(baseTo);
            };
            return this;
        };
        return this;
    };
        
    // binary to decimal
    this.bin2dec = function (num) {
        return convertBase(num).from(2).to(10);
    };
    
    // binary to hexadecimal
    this.bin2hex = function (num) {
        return convertBase(num).from(2).to(16);
    };
    
    // decimal to binary
    this.dec2bin = function (num) {
        return convertBase(num).from(10).to(2);
    };
    
    // decimal to hexadecimal
    this.dec2hex = function (num) {
        return convertBase(num).from(10).to(16);
    };
    
    // hexadecimal to binary
    this.hex2bin = function (num) {
        return convertBase(num).from(16).to(2);
    };
    
    // hexadecimal to decimal
    this.hex2dec = function (num) {
        return convertBase(num).from(16).to(10);
    };
    
    return this;        
})();

//-------------------------------------------------------------------------------------------------------------------------

function isInt(value) {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
};

function isHex(s) {
    return (s.length && 
        !(s.length != 6 || isNaN(parseInt(s,16))))
};

function isString(val){
	if(typeof val==string){
		return true;
	}else{
		return false;
	}
};

function str2hex(str){
var hex, i;
//var str = "\u6f22\u5b57"; // "\u6f22\u5b57" === "漢字"
var result = "";
for (i=0; i<str.length; i++) {
  hex = str.charCodeAt(i).toString(16);
  result += ("000"+hex).slice(-4);
}
};



//----------------------------------------------------------------------------------
function updatePC(a){

	pcVal+=a;
	registers.setItem('pc',pcVal);
	
};
//----------------------------------------------------------------------------------

//Puts command lines as key and their addresses as values into a hash map. Used in branch instructions.
function getinstAddresses(){    //-------------> working

var count = codeLines.length;
var index = 0;

for(var i=0; i<count; i++){  
		
		var commentTest = (/@/.test(codeLines[i].charAt(0))); //Checking for comments
		var textTest = (/.text/.test( codeLines[i]));  //checking for .text keyword 
		var globalTest = /.global/.test( codeLines[i]); //checking for .global keyword
		var mainTest = /main:/.test( codeLines[i]); //checking for main: label -------> Just for now!! should change later!!!!
		var labelTest = labels.hasItem(codeLines[i]); 
	
		if(!(commentTest||textTest||globalTest||mainTest||!codeLines[i]||labelTest)){ //(!codeLines[i]) check if the line is blank

			var opLine = codeLines[i]; //-----> working. filter(Boolean) removes null values
			
			instAddresses.setItem(opLine, index); //Store function names with their line numbers
			index+=4;
			
		}
	}	
}
//----------------------------------------------------------------------------------

//Function to get the next command to be executed from the current position
function findNextCommand(position){      //-------------> working

	for(var i=position; i<codeLines.length; i++){

		var commentTest = (/@/.test(codeLines[i].charAt(0))); //Checking for comments		
		var labelTest = labels.hasItem(codeLines[i]); 
	
		if(!(commentTest||!codeLines[i]||labelTest)){ //(!codeLines[i]) check if the line is blank
			return i;			
		}	
	}
}
//----------------------------------------------------------------------------------

//Function to put all the instructions to instruction memory at the beginning
function fillInstMem(){
	document.getElementById("StepByStep").disabled = false;
	document.getElementById("outputText").value = "";
	document.getElementById("inputs").value = "";
	//Storing code lines in an array
	var editorContent=editor.getValue();
	codeLines = editorContent.split("\n");
	
	//Remove white spaces at the beginning and end of a codeLines
	for(var i=0; i<codeLines.length; i++){
		codeLines.splice(i, 1, codeLines[i].trim());
	}	
	
	getLabels(codeLines); 
	getOperations();
	getinstAddresses();
	
	var instruction;
	var lineNum1;
	
	for(var i=0; i<codeLines.length; i++){
		
	var commentTest = (/@/.test(codeLines[i].charAt(0))); //Checking for comments
	var textTest = (/.text/.test( codeLines[i]));  //checking for .text keyword 
	var globalTest = /.global/.test( codeLines[i]); //checking for .global keyword
	var labelTest = labels.hasItem(codeLines[i]); 
		
	if(!(commentTest||!codeLines[i]||labelTest||textTest||globalTest)){
	
		//Split one line of code
		var splitLine = codeLines[i].split(/[ ,\t]+/).filter(Boolean); //-----> working. filter(Boolean) removes null values
		
		lineNum1 = i;
			
		if(splitLine.length>4){
			splitLine = splitLine.slice(0, 4); //When there are comments at the end of a code line
		}
			
		noSpecialChars(splitLine);
		
		var args = splitLine;
	
		//Writing instruction formats for different instructions
		if((/add/.test(args[0]))||(/sub/.test(args[0]))){
			
			if(isInt(args[3])){
		
				var operand2 = signExtend(immediateToBin(args[3]),12);
				var I = "1";
			}
			else{
				
				var operand2 = signExtend(convertRegName.getItem(args[3]),12);
				var I = "0";
				
			}
				var Rn = convertRegName.getItem(args[2]);
				var Rd = convertRegName.getItem(args[1]);
	
			if(/add/.test(args[0])){
				var opCode = "0100";
			}else{
				var opCode = "0010";
			}	
			
			instruction = dataProcess(I, Rn, Rd, operand2, opCode);				
			instrMem[indexMem] = instruction;
				
		}
		else if(/mov/.test(args[0])){
		
			if(isRegForMov(args)){
			
				var operand2 = signExtend(convertRegName.getItem(args[2]),12);
				var I = "0";

			}
			else{
			
				var operand2 = signExtend(immediateToBin(args[2]),12);
				var I = "1";
	
			}

			var Rd = convertRegName.getItem(args[1]);
			var Rn = "0000";
			instruction = dataProcess(I, Rn, Rd, operand2, "1101")
			instrMem[indexMem] = instruction;
				
		}
		else if(/cmp/.test(args[0])){
		
			if(args.length<4){		
				if(isInt(args[2])){	
					secondOp = parseInt(args[2]);
				
					var operand2 = signExtend(immediateToBin(args[2]),12);
					var I = "1";
				
				}else{
					secondOp = registers.getItem(args[2]);
			
					var operand2 = signExtend(convertRegName.getItem(args[2]),12);
					var I = "0";			
				}
				
				var Rn = convertRegName.getItem(args[1]);
				var Rd = "0000";	
				
				instruction = dataProcess(I, Rn, Rd, operand2, "1010");
				instrMem[indexMem] = instruction;	
					
			}				
		}
		else if(/str/.test(args[0])){
		
			var Rn = convertRegName.getItem(args[1]);
			var Rd = convertRegName.getItem(args[2]);
			var operand2 = signExtend(immediateToBin(args[3]),12);
				
			instruction = dataTrans(Rn, Rd, operand2, "011001");
			instrMem[indexMem] = instruction;
			
		
		}else if(/ldr/.test(args[0])){
			var countmem;
			
			if(isReg(args)){
	
				var Rn = convertRegName.getItem(args[2]);
				var Rd = convertRegName.getItem(args[1]);
				var operand2 = signExtend(immediateToBin(args[3]),12);
			
			}else{
							
				var ldrAddr = indexMem;
				var count1=indexMem;
				while(!dataLabels.hasItem(args[2])){   //Find the address of the data label
					count1+=4; 
				}
							
				var destAddr = count1;
				var offset =(destAddr-ldrAddr-8)/4;
				var operand2 = signExtend(dec2bin(offset).toString(), 12);
				var Rn = convertRegName.getItem('pc');
				var Rd = convertRegName.getItem(args[1]);	
			
			}
		
				instruction = dataTrans(Rn, Rd, operand2, "011000");
				instrMem[indexMem] = instruction;
				
		}
		else if(/beq/.test(args[0])||/bne/.test(args[0])||/bgt/.test(args[0])||/blt/.test(args[0])||/bge/.test(args[0])||/ble/.test(args[0])){
			
			var cond;
		
			if(/^beq$/.test(functionsHash.getItem(lineNum1))){
				cond = "0000";
			}else if(/^bne$/.test(functionsHash.getItem(lineNum1))){
				cond = "0001";
			}else if(/^bgt$/.test(functionsHash.getItem(lineNum1))){
				cond = "1100";
			}else if(/^blt$/.test(functionsHash.getItem(lineNum1))){
				cond = "1011";
			}else if(/^bge$/.test(functionsHash.getItem(lineNum1))){
				cond = "1010";
			}else if(/^ble$/.test(functionsHash.getItem(lineNum1))){
				cond = "1101";
			}
		
			var instruction = branchFormat(cond, "0", "1", args[1]);
			instrMem[indexMem] = instruction;
			
		
		}
		else if(/bl/.test(args[0])){		
			instrMem[indexMem] = "00000000000000000000000000000000";		
		}
		else if(/b/.test(args[0])){
			
			var instruction = branchFormat("1110", "0", "1", args[1]);
			instrMem[indexMem] = instruction;
				
		}
		else if(/mul/.test(args[0])){
		
			var Rs = convertRegName.getItem(args[2]);
			var Rm = convertRegName.getItem(args[3]);
			var Rd = convertRegName.getItem(args[1]);
			
			instruction = mulFormat(Rd, Rs, Rm);
			instrMem[indexMem] = instruction;
			
		}
		
		indexMem+=4;
	
		}
		
		showRegisters();
	
	}
}

function noSpecialChars(Sarray){

	//Removing # from immediate values 
	for(var j=0;j<Sarray.length;j++){
		if (/#/.test(Sarray[j])){
			var temp = Sarray[j].split("#").filter(Boolean);
			Sarray.splice(j, 1, temp[0]);
		}
	}
		
	//Removing [ and ] in ldr and str 
	for(var j=0;j<Sarray.length;j++){
		if (/\]/.test(Sarray[j])){
			var temp = Sarray[j].split("]").filter(Boolean);
			Sarray.splice(j, 1, temp[0]);
					
	}else if(/\[/.test(Sarray[j])){				
			var temp = Sarray[j].split("[").filter(Boolean);
			Sarray.splice(j, 1, temp[0]);	
		}	
	}
}
























