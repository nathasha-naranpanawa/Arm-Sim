ace.define("ace/mode/arm_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var ArmHighlightRules = function() {

    this.$rules = { start: 
       [ { token: 'keyword.control.assembly',
           regex: '\\b(?:mov|movs|moveq|movne|movcs|movhs|movcc|movlo|movmi|movpl|movvs|movvc|movhi|movls|movge|movlt|movgt|movle|moval|mvn|mvns|mrs|msr|add|adds|addeq|addne|addcs|addhs|addcc|addlo|addmi|addpl|addvs|addvc|addhi|addls|addge|addlt|addgt|addle|addal|adc|adcs|qadd|qdadd|sub|subs|subeq|subne|subcs|subhs|subcc|sublo|submi|subpl|subvs|subvc|subhi|subls|subge|sublt|subgt|suble|subal|sbc|sbcs|rsb|rsbs|rsc|rscs|qsub|qdsub|mul|muls|mla|mlas|umull|umulls|umlal|umlals|smull|smulls|smlal|smlals|clz|tst|teq|and|ands|andeq|andne|andcs|andhs|andcc|andlo|andmi|andpl|andvs|andvc|andhi|andls|andge|andlt|andgt|andle|andal|eor|eors|eoreq|eorne|eorcs|eorhs|eorcc|eorlo|eormi|eorpl|eorvs|eorvc|eorhi|eorls|eorge|eorlt|eorgt|eorle|eoral|orr|orrs|orreq|orrne|orrcs|orrhs|orrcc|orrlo|orrmi|orrpl|orrvs|orrvc|orrhi|orrls|orrge|orrlt|orrgt|orrle|orral|bic|bics|cmp|cmpeq|cmpne|cmpcs|cmphs|cmpcc|cmplo|cmpmi|cmppl|cmpvs|cmpvc|cmphi|cmpls|cmpge|cmplt|cmpgt|cmple|cmpal|cmn|b|beq|bne|bcs|bhs|bcc|blo|bmi|bpl|bvs|bvc|bhi|bls|bge|blt|bgt|ble|bal|bl|bleq|blne|blcs|blhs|blcc|bllo|blmi|blpl|blvs|blvc|blhi|blls|blge|bllt|blgt|blle|blal|bx|blx|ldr|ldreq|ldrne|ldrcs|ldrhs|ldrcc|ldrlo|ldrmi|ldrpl|ldrvs|ldrvc|ldrhi|ldrls|ldrge|ldrlt|ldrgt|ldrle|ldral|ldrt|ldrb|ldrbt|ldrsb|ldrh|ldrsf|ldm|ldmda|ldmdb|ldmea|ldmed|ldmfa|ldmfd|ldmia|ldmib|str|strda|strdb|strea|stred|strfa|strfd|stria|strib|streq|strne|strcs|strhs|strcc|strlo|strmi|strpl|strvs|strvc|strhi|strls|strge|strlt|strgt|strle|stral|strt|strb|strbt|strh|stm|stmda|stmdb|stmea|stmed|stmfa|stmfd|stmia|stmib|swp|swpb|swi|bkptcdp|cdp2|mrc|mrc2|mcr|mcr2|ldc|ldc2|stc|stc2|ADR|ADRL|FLDD|FLDS|LDFD|LDFS|LDR|NOP|push|pop|lsl|lsr|asr|ror|rrx|call|j(?:mp|n?e|ge?|ae?|le?|be?|n?o|n?z))\\b',
           caseInsensitive: true },
         { token: 'variable.parameter.register.assembly',
           regex: '\\b(?:CS|DS|ES|FS|GS|SS|RAX|EAX|RBX|EBX|RCX|ECX|RDX|EDX|RCX|RIP|EIP|IP|RSP|ESP|SP|RSI|ESI|SI|RDI|EDI|DI|RFLAGS|EFLAGS|FLAGS|R8-15|(?:Y|X)MM(?:[0-9]|10|11|12|13|14|15)|CR(?:[0-4]|DR(?:[0-7]|TR6|TR7|EFER)))\\b',
           caseInsensitive: true },
         { token: 'constant.character.decimal.assembly',
           regex: '\\b[0-9]+\\b' },
         { token: 'constant.character.hexadecimal.assembly',
           regex: '\\b0x[A-F0-9]+\\b',
           caseInsensitive: true },
         { token: 'constant.character.hexadecimal.assembly',
           regex: '\\b[A-F0-9]+h\\b',
           caseInsensitive: true },
         { token: 'string.assembly', regex: /'([^\\']|\\.)*'/ },
         { token: 'string.assembly', regex: /"([^\\"]|\\.)*"/ },
         { token: 'support.function.directive.assembly',
           regex: '^\\[',
           push: 
            [ { token: 'support.function.directive.assembly',
                regex: '\\]$',
                next: 'pop' },
              { defaultToken: 'support.function.directive.assembly' } ] },
         { token: 
            [ 'support.function.directive.assembly',
              'support.function.directive.assembly',
              'entity.name.function.assembly' ],
           regex: '(^struc)( )([_a-zA-Z][_a-zA-Z0-9]*)' },
         { token: 'support.function.directive.assembly',
           regex: '^endstruc\\b' },
        { token: 
            [ 'support.function.directive.assembly',
              'entity.name.function.assembly',
              'support.function.directive.assembly',
              'constant.character.assembly' ],
           regex: '^(%macro )([_a-zA-Z][_a-zA-Z0-9]*)( )([0-9]+)' },
         { token: 'support.function.directive.assembly',
           regex: '^%endmacro' },
         { token: 
            [ 'text',
              'support.function.directive.assembly',
              'text',
              'entity.name.function.assembly' ],
           regex: '(\\s*)(%define|%xdefine|%idefine|%undef|%assign|%defstr|%strcat|%strlen|%substr|%00|%0|%rotate|%rep|%endrep|%include|\\$\\$|\\$|%unmacro|%if|%elif|%else|%endif|%(?:el)?ifdef|%(?:el)?ifmacro|%(?:el)?ifctx|%(?:el)?ifidn|%(?:el)?ifidni|%(?:el)?ifid|%(?:el)?ifnum|%(?:el)?ifstr|%(?:el)?iftoken|%(?:el)?ifempty|%(?:el)?ifenv|%pathsearch|%depend|%use|%push|%pop|%repl|%arg|%stacksize|%local|%error|%warning|%fatal|%line|%!|%comment|%endcomment|__NASM_VERSION_ID__|__NASM_VER__|__FILE__|__LINE__|__BITS__|__OUTPUT_FORMAT__|__DATE__|__TIME__|__DATE_NUM__|_TIME__NUM__|__UTC_DATE__|__UTC_TIME__|__UTC_DATE_NUM__|__UTC_TIME_NUM__|__POSIX_TIME__|__PASS__|ISTRUC|IEND|BITS 16|BITS 32|BITS 64|USE16|USE32|__SECT__|ABSOLUTE|EXTERN|COMMON|CPU|FLOAT)\\b( ?)((?:[_a-zA-Z][_a-zA-Z0-9]*)?)',
           caseInsensitive: true },
          { token: 'support.function.directive.assembly',
           regex: '\\b(?:d[bwdqtoy]|res[bwdqto]|equ|times|align|alignb|sectalign|section|ptr|byte|word|dword|qword|incbin)\\b',
           caseInsensitive: true },
         { token: 'entity.name.function.assembly', regex: '^\\s*%%[\\w.]+?:$' },
         { token: 'entity.name.function.assembly', regex: '^\\s*%\\$[\\w.]+?:$' },
         { token: 'entity.name.function.assembly', regex: '^[\\w.]+?:' },
         { token: 'entity.name.function.assembly', regex: '^[\\w.]+?\\b' },
         { token: 'comment.assembly', regex: '@.*$' } ] 
    }
    
    this.normalizeRules();
};

ArmHighlightRules.metaData = { fileTypes: [ 'asm' ],
      name: 'Arm',
      scopeName: 'source.assembly' }


oop.inherits(ArmHighlightRules, TextHighlightRules);

exports.ArmHighlightRules = ArmHighlightRules;
});

ace.define("ace/mode/folding/coffee",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var BaseFoldMode = require("./fold_mode").FoldMode;
var Range = require("../../range").Range;

var FoldMode = exports.FoldMode = function() {};
oop.inherits(FoldMode, BaseFoldMode);

(function() {

    this.getFoldWidgetRange = function(session, foldStyle, row) {
        var range = this.indentationBlock(session, row);
        if (range)
            return range;

        var re = /\S/;
        var line = session.getLine(row);
        var startLevel = line.search(re);
        if (startLevel == -1 || line[startLevel] != "#")
            return;

        var startColumn = line.length;
        var maxRow = session.getLength();
        var startRow = row;
        var endRow = row;

        while (++row < maxRow) {
            line = session.getLine(row);
            var level = line.search(re);

            if (level == -1)
                continue;

            if (line[level] != "#")
                break;

            endRow = row;
        }

        if (endRow > startRow) {
            var endColumn = session.getLine(endRow).length;
            return new Range(startRow, startColumn, endRow, endColumn);
        }
    };
    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
        var indent = line.search(/\S/);
        var next = session.getLine(row + 1);
        var prev = session.getLine(row - 1);
        var prevIndent = prev.search(/\S/);
        var nextIndent = next.search(/\S/);

        if (indent == -1) {
            session.foldWidgets[row - 1] = prevIndent!= -1 && prevIndent < nextIndent ? "start" : "";
            return "";
        }
        if (prevIndent == -1) {
            if (indent == nextIndent && line[indent] == "#" && next[indent] == "#") {
                session.foldWidgets[row - 1] = "";
                session.foldWidgets[row + 1] = "";
                return "start";
            }
        } else if (prevIndent == indent && line[indent] == "#" && prev[indent] == "#") {
            if (session.getLine(row - 2).search(/\S/) == -1) {
                session.foldWidgets[row - 1] = "start";
                session.foldWidgets[row + 1] = "";
                return "";
            }
        }

        if (prevIndent!= -1 && prevIndent < indent)
            session.foldWidgets[row - 1] = "start";
        else
            session.foldWidgets[row - 1] = "";

        if (indent < nextIndent)
            return "start";
        else
            return "";
    };

}).call(FoldMode.prototype);

});

ace.define("ace/mode/arm",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/arm_highlight_rules","ace/mode/folding/coffee"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var ArmHighlightRules = require("./arm_highlight_rules").ArmHighlightRules;
var FoldMode = require("./folding/coffee").FoldMode;

var Mode = function() {
    this.HighlightRules = ArmHighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "@";
    this.$id = "ace/mode/arm";
}).call(Mode.prototype);

exports.Mode = Mode;
});
