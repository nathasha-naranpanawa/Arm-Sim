/*
Problems: when there are tabs in blank lines
		  Comments starting with tab or space
*/


var lineNum; //Stores the current line number
var codeLines;  //Stores all the commands as an array
var state = 0;  //Stores state regarding the current line to be executed
var startLine; //Place where main: starts
var pcVal = 34;
var instCount = 0; //Keeps track of the number of instructions executed

function lineByLine()
{
	
	//Storing code lines in an array
	var editorContent=editor.getValue();
	codeLines = editorContent.split("\n");
	
	//Remove white spaces at the beginning and end of a codeLines
	for(var i=0; i<codeLines.length; i++){
		codeLines.splice(i, 1, codeLines[i].trim());
	}	
	
	getLabels(codeLines); 
	getOperations();
	//putLabels();
	
	startLine = checkForLabel(/main:/) + 1;  //Execution should be started from the line following main
	var i = startLine+state;
	
	//------------------
	updatePC();
	//------------------
	
		var commentTest = (/@/.test(codeLines[i].charAt(0))); //Checking for comments
		//var textTest = (/.text/.test( codeLines[i]));  //checking for .text keyword 
		//var globalTest = /.global/.test( codeLines[i]); //checking for .global keyword
		//var mainTest = /main:/.test( codeLines[i]); //checking for main: label -------> Just for now!! should change later!!!!
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
			
		//Removing # from immediate values 
		for(var j=0;j<splitLine.length;j++){
			if (/#/.test(splitLine[j])){
				var temp = splitLine[j].split("#").filter(Boolean);
				splitLine.splice(j, 1, temp[0]);
			}
		}
		
		//Removing [ and ] in ldr and str 
		for(var j=0;j<splitLine.length;j++){
			if (/\]/.test(splitLine[j])){
				var temp = splitLine[j].split("]").filter(Boolean);
				splitLine.splice(j, 1, temp[0]);
					
			}else if(/\[/.test(splitLine[j])){				
				var temp = splitLine[j].split("[").filter(Boolean);
				splitLine.splice(j, 1, temp[0]);	
			}	
		}
		
		//Function to simulate the code 
		copyEditor(splitLine);
		instCount+=1; //number of instructions executed
		state+=1;
		
}



//var instest=['sub	,sp, sp, 4','str	,lr, sp, 0','mov 	,r5,129','ldr	,r0, =hello','	mov     ,r1,r5','bl  	,printf','ldr	,lr, [sp, #0]','add	,sp, sp, #4','mov	,pc, lr'];


//var commands = new Hash('exfunction',new exfunction());

function copyEditor(command){    //-------------> working

	runCommand(command);
	//var obj=new printf();
	//obj.excec();
	//runCommand(instest[5]);
	//runCommand(instest[2]);
	//runCommand(instest[4]);
	
	//document.getElementById("outputText").innerHTML =registers.getItem('r1');	
	//document.getElementById("outputText").innerHTML =isInt('sdfdsf');	
	

		document.getElementById("formContent").innerHTML =  editor.getValue();
		
}
//------------------------------------------------------
function runCommand(command) {    //-------------> working
	var args=command;
	
	if(/beq/.test(args[0])||/bne/.test(args[0])||/bgt/.test(args[0])||/blt/.test(args[0])||/bge/.test(args[0])||/ble/.test(args[0])){
		args.splice(0, 1, "branch");  //All conditional branch commands are handled by branch() method
	}
	var obj = commands.getItem(args[0]);
	//args.shift();
	//var obj = new exfunction();
	// let the handler of that object takes care of it 
	obj.excec(args);
	showRegisters();
}

/*--------------------------------------
function runCommand(command) {
	
	var args=sepCmd(command);
	document.getElementById("outputText").innerHTML =args;	
	var obj = commands.getItem(args[0]);
	
	args.shift();	//remove first element from the args array
	document.getElementById("outputText").innerHTML =args;
	// let the handler of that object takes care of it 
	obj.excec(args);
	//obj.excec();

}
*/
//----------------------------------------------------------------------------------------------------------
/*function sepCmd(strCmd){
	var dataArray=strCmd.split(',');
		var texts = [];
		for (var i=0; i < dataArray.length; i++) {
		  // only push this line if it contains a non whitespace character.
		  if (/\S/.test(dataArray[i])) {
			texts.push($.trim(dataArray[i]));
		  }
		}
	return texts;

}*/
//----------------------------------------------------------------------------------------------------------
function showRegisters(){     //-------------> working

	var regs=['r0','r1','r2','r3','r4','r5','r6','r7','r8','r9','r10','r11','r12','sp','lr','pc'];
	var string="";
	for(i=0;i<regs.length;i++){
		string=string+regs[i]+" = "+registers.getItem(regs[i])+"\n";
	}
	document.getElementById("outputregisters").innerHTML =string;	

	/*var address=['0x000000','0x000018','0x000024'];
	var string2="";
	for(j=0;j<addr.length;j++){
		string2=string2+address[j]+" = "+addr.getItem(address[j])+"\n";
	}
	document.getElementById("memory").innerHTML =string2;
*/
	//var mem=newFilledArray(1000, 4);

	string3="";
	for(j=0;j<memory.length;j++){

		//num = dec2hex(j);
		string3=string3+dec2hex(j)+" : " + memory[j] + "\n";
		
	}
		document.getElementById("memory").innerHTML =string3;

		string4="";
	var k=0;
	while(k<stack.length-4){
		

		//num = dec2hex(j);
		string4=string4+dec2hex(k)+" : " + stack[k] + "\n";
		k +=4;
		
	}
		document.getElementById("stack").innerHTML =string4;
		copyStack = stack ;


		string5="";
	var l=0;
	while(l<instrMem.length-4){
		

		//num = dec2hex(j);
		string5=string5+l+" : " + instrMem[l] + "\n";
		l +=1;
		
	}
		document.getElementById("Instr").innerHTML =string5;


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

		//num = dec2hex(j);
		string3=string3+dec2hex(j)+" : " + memory[j] + "\n";
		
	}
		document.getElementById("memory").innerHTML =string3;

		string4="";
	var k=0;
	while(k<stack.length-4){
		

		//num = dec2hex(j);
		string4=string4+dec2hex(k)+" : " + stack[k] + "\n";
		k +=4;
		
	}
		document.getElementById("stack").innerHTML =string4;
		copyStack = stack ;

		string5="";
	var l=0;
	while(l<instrMem.length-4){
		

		//num = dec2hex(j);
		string5=string5+l+" : " + instrMem[l] + "\n";
		l +=1;
		
	}
		document.getElementById("Instr").innerHTML =string5;


};	



//----------------------------------------------------------------------------------------------------------

//Storing labels 
function getLabels(codes){   //-----------> working

	for(var i=0; i<codes.length; i++){

		if(/:/.test( codes[i]) && !(/@/.test(codes[i]))){
			labels.setItem(codes[i],i);
			//alert(codes[i]);
			var dataline = codes[i].split(/"([^"]+)"/);
			//alert(dataline[0]);

			var key = dataline[0].split(":");
			//alert("="+key[0]);
			//alert(dataline[1]);
			dataLabels.setItem("="+key[0],dataline[1]);



			//alert("done");
		}	
	}
}

//----------------------------------------------------------------------------------------------------------

//Initialize the registers
function initialize(){   //-------------> working
	
	var num = 0;
	
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
	registers.setItem('sp',999);
	registers.setItem('lr',234);
	registers.setItem('pc',34);

	for(i=0;i<memory.length;i++){
		memory[i]=0;
	}

	for(j=0;j<stack.length;j++){
		stack[j]=0;
	}

	state = 0;
	cmpResult = 0;
	pcVal = 34;
	
	showRegisters();

	

	/*var initAddr = 00;

	addr.setItem('0x000000',initAddr);
	addr.setItem('0x000018',initAddr);
	addr.setItem('0x000024',initAddr);

	showAddress();
	*/
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
var str = "\u6f22\u5b57"; // "\u6f22\u5b57" === "漢字"
var result = "";
for (i=0; i<str.length; i++) {
  hex = str.charCodeAt(i).toString(16);
  result += ("000"+hex).slice(-4);
}
};

function fromRadio(){
    if(document.getElementById("Hex").checked) {
    	alert("in hex");
        //document.getElementById("memory").value = bin2hex("1111111111010010");

        if(isInt(stack[0])){
        	alert("in number");
           
            string4="";
			var k=0;
			while(k<stack.length-4){
				string4=string4+dec2hex(k)+" : " + dec2hex(stack[k]) + "\n";
				k +=4;
				
			}
				document.getElementById("stack").innerHTML =string4;

        }else if(isHex(stack[0])){
        	alert("in hex2");
            for(i=0;i<stack.length;i++){
                 (stack[i]);
            }
        }else if (isString(stack[0])){
        		alert("in string");

        		for(i=0;i<stack.length;i++){
                 str2hex(stack[i]);
            }
        }else{
        	alert("in bin");
            for(i=0;i<stack.length;i++){
                 bin2hex(stack[i]);
            }
        }
        
    }else if(document.getElementById("Decimal").checked) {
      //document.getElementById("memory").value = bin2dec("10101010");
      
    }else if(document.getElementById("Binary").checked) {
      //document.getElementById("memory").value = hex2bin("0xffd2");
    }



};

//----------------------------------------------------------------------------------
function updatePC(){

	pcVal+=4;
	registers.setItem('pc',pcVal);
	
};
//----------------------------------------------------------------------------------




