//-------------------------------------------------------------------------
//direct radio button functions to sub functions
	
//copyReg = registers;

function fromRadio(){

    if(document.getElementById("Hex").checked) {
    	convert2hex();
    }else if (document.getElementById("Decimal").checked){
    	convert2decimal();
    }else if (document.getElementById("Binary").checked){
    	convert2binary();
    }else{
    	alert("Click something");
    }
};
 
//----------------------------------------------------------------------------
//Convert the representation to hex

function convert2hex(){
	alert("Converting to hex");

	var string1="";

	//copy original state of registers Hash to copyReg Hash
	//registers = copyReg;
	copyReg = copyRegisters();
	stack = copyStack;
	string1=convertArray(stack,dec2hex);


     convertRegisters(dec2hex);
     document.getElementById("stack").innerHTML =string1;
     string5="";
	var l=0;
	while(l<instrMem.length-4){
		

		//num = dec2hex(j);
		string5=string5+l+" : " + instrMem[l] + "\n";
		l +=4;
		
	}
		document.getElementById("Instr").innerHTML =string5;
     //showInstMem();

};
//---------------------------------------------------------------------------------
//Convert the representation to decimal

function convert2decimal(){
	alert("Converting to decimal");

	//var string2="";

	//copy original state of registers Hash to copyReg Hash
	//registers = copyReg;
	
	//stack = copyStack;
	//string2=convertArray(stack,dec2hex);
	
	//copyReg = registers;
	//convertRegisters(hex2dec);

	showRegisters();
	//showInstMem();
     


};

//---------------------------------------------------------------------------------
//Convert the representation to decimal

function convert2binary(){
	alert("Converting to binary");

	var string3="";

	//copy original state of registers Hash to copyReg Hash
	//registers = copyReg;
	copyReg = copyRegisters();
	//stack = copyStack;
	//string2=convertArray(stack,dec2hex);
	convertRegisters(dec2bin);
	stack = copyStack;
	string3=convertArray(stack,dec2bin);
	     document.getElementById("stack").innerHTML =string3;

	     string5="";
	var l=0;
	while(l<instrMem.length-4){
		

		//num = dec2hex(j);
		string5=string5+l+" : " + instrMem[l] + "\n";
		l +=4;
		
	}
		document.getElementById("Instr").innerHTML =string5;
	//showInstMem();     

	//showRegisters();




};
//---------------------------------------------------------------------------------

//---------------------------------------------------------------------------------
//Find in which representation the Stack Memory window is in

function changeStack(check){
	var j=0;
	for(j=0;j<stack.length;j++){
		if (check(stack[j])){
		 return true;
		 break;
		}
	}
};

//------------------------------------------------------------------------------------









