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

    this.str2hex = function(str){
    	var hex, i;
		//var str = "\u6f22\u5b57"; // "\u6f22\u5b57" === "漢字"
		var result = "";
		for (i=0; i<str.length; i++) {
		  result += str.charCodeAt(i).toString(16);
		  //return result += ("000"+hex).slice(-4);
		}
        return result;
    }

    this.str2ascii = function(str){
    	var j;
    	var result = str.charCodeAt(0);
		for(j = 1; j < str.length; j++) {
			result = result+ str.charCodeAt(j);
		}
		return result;

    }

  this.asc2hex = function(pStr) {
        tempstr = '';
        for (a = 0; a < pStr.length; a = a + 1) {
            tempstr = tempstr + pStr.charCodeAt(a).toString(16);
        }
        return tempstr;
    }

    this.hex2asc = function(pStr) {
        tempstr = '';
        for (b = 0; b < pStr.length; b = b + 2) {
            tempstr = tempstr + String.fromCharCode(parseInt(pStr.substr(b, 2), 16));
        }
        return tempstr;
    }

    this.str2dec = function(str){
        return hex2dec(asc2hex(str2ascii(str)));

    }

    
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


function convertArray(array,method){	//convert(stack,dec2hex)

	string="";
			var k=0;
			while(k<array.length-4){
				string=string+dec2hex(k)+" : " + method(array[k]) + "\n";
				k +=4;
				
			}
			return string;

};

function convertRegisters(method){

	copyReg.setItem("r0",method(copyReg.getItem("r0"))) ;
	copyReg.setItem("r1",method(copyReg.getItem("r1"))) ;
	copyReg.setItem("r2",method(copyReg.getItem("r2"))) ;
	copyReg.setItem("r3",method(copyReg.getItem("r3"))) ;
	copyReg.setItem("r4",method(copyReg.getItem("r4"))) ;
	copyReg.setItem("r5",method(copyReg.getItem("r5"))) ;
	copyReg.setItem("r6",method(copyReg.getItem("r6"))) ;
	copyReg.setItem("r7",method(copyReg.getItem("r7"))) ;
	copyReg.setItem("r8",method(copyReg.getItem("r8"))) ;
	copyReg.setItem("r9",method(copyReg.getItem("r9"))) ;
	copyReg.setItem("r10",method(copyReg.getItem("r10"))) ;
	copyReg.setItem("r11",method(copyReg.getItem("r11"))) ;
	copyReg.setItem("r12",method(copyReg.getItem("r12"))) ;
	copyReg.setItem("sp",method(copyReg.getItem("sp"))) ;
	copyReg.setItem("lr",method(copyReg.getItem("lr"))) ;
	copyReg.setItem("pc",method(copyReg.getItem("pc"))) ;

	showCopyRegisters();

};

function copyRegisters(){
        copyReg.setItem("r0",registers.getItem("r0")) ;
        copyReg.setItem("r1",registers.getItem("r1")) ;
        copyReg.setItem("r2",registers.getItem("r2")) ;
        copyReg.setItem("r3",registers.getItem("r3")) ;
        copyReg.setItem("r4",registers.getItem("r4")) ;
        copyReg.setItem("r5",registers.getItem("r5")) ;
        copyReg.setItem("r6",registers.getItem("r6")) ;
        copyReg.setItem("r7",registers.getItem("r7")) ;
        copyReg.setItem("r8",registers.getItem("r8")) ;
        copyReg.setItem("r9",registers.getItem("r9")) ;
        copyReg.setItem("r10",registers.getItem("r10")) ;
        copyReg.setItem("r11",registers.getItem("r11")) ;
        copyReg.setItem("r12",registers.getItem("r12")) ;
        copyReg.setItem("sp",registers.getItem("sp")) ;
        copyReg.setItem("lr",registers.getItem("lr")) ;
        copyReg.setItem("pc",registers.getItem("pc")) ;
        return copyReg;

}



