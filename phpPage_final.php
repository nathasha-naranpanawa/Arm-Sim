<?php
	session_start();
?>
<?php

function compile_code($cmd, &$stderr, &$stdout) {

$stdoutFile = tempnam(".","temp0");
$stderrFile = tempnam(".","temp0");

$descriptorspec = array(
   0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
   1 => array("file", "$stdoutFile", "w"),  // stdout is a file that the child will write to
   2 => array("file", "$stderrFile", "w") // stderr is a file to write to
);

$process = proc_open($cmd, $descriptorspec, $pipes);

if (is_resource($process)) {
    // $pipes now looks like this:
    // 0 => writeable handle connected to child stdin
    // 1 => readable handle connected to child stdout
    // Any error output will be appended to /tmp/error-output.txt

    fclose($pipes[0]);
	
    $return_value = proc_close($process);
	
	$stdout = file($stdoutFile);
	$stderr = file($stderrFile);
	
	unlink($stdoutFile);
	unlink($stderrFile);
    //echo "command returned $return_value\n";
}
}
?>

<?php
function run_code($cmd, $inputs, &$stderr, &$stdout) {

$stdoutFile = tempnam(".","temp0");
$stderrFile = tempnam(".","temp0");

$descriptorspec = array(
   0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
   1 => array("file", "$stdoutFile", "w"),  // stdout is a file that the child will write to
   2 => array("file", "$stderrFile", "w") // stderr is a file to write to
);

$process = proc_open($cmd, $descriptorspec, $pipes);

if (is_resource($process)) {
    // $pipes now looks like this:
    // 0 => writeable handle connected to child stdin
    // 1 => readable handle connected to child stdout
    // Any error output will be appended to /tmp/error-output.txt

    fwrite($pipes[0], $inputs); //write stdinput to pipe[0]
    fclose($pipes[0]);

    $return_value = proc_close($process);
	
	$stdout = file($stdoutFile);
	$stderr = file($stderrFile);
	
	unlink($stdoutFile);
	unlink($stderrFile);
    //echo "command returned $return_value\n";
}
}
?>

<?php

$inputs = $_POST['inputs'];
$file = fopen('test1.s','w');

fwrite($file, $_POST['formContent']); 

//$compile_cmd = 'javac Test1.java';
function printResult($arrayName){
	foreach($arrayName as &$value){
		echo $value;
	}
}

compile_code('arm-linux-gnueabi-gcc -Wall -o test1 test1.s', $stderr1, $stdout1);
//compile_code('javac Test1.java', $stderr1, $stdout1);

if(count($stderr1)!=0){
	echo "Compilation error!!\n\n";
	printResult($stderr1);
}else{
run_code('qemu-arm -L /usr/arm-linux-gnueabi test1', $inputs, $stderr, $stdout);
//run_code('java Test1', $inputs, $stderr, $stdout);

if(count($stderr)!=0){
	echo "Runtime error!!\n\n";
	printResult($stderr);
}
	printResult($stdout);
	
	unlink("test1");
}

?> 








