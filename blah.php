

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

//$cwd = '/tmp';
//$env = array('some_option' => 'aeiou');

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
//$formContent=;
$inputs = $_POST['inputs'];
$file = fopen('test1.s','w');

fwrite($file, $_POST['formContent']); 

//$compile_cmd = 'javac Test1.java';
function writeTofile($arrayName){
	foreach($arrayName as &$value){
		echo $value;
		//fwrite($fileName, $value);
	}
}

//$stderrComp = fopen('stderrComp.txt', 'w');
//$stdoutRun = fopen('stdoutRun.txt', 'w');
//$stderrRun = fopen('stderrRun.txt', 'w');

compile_code('arm-linux-gnueabi-gcc -Wall -o test1 test1.s', $stderr1, $stdout1);
writeTofile($stderr1);
//foreach($stderr1 as &$value){
	//fwrite($stderrComp, $value);
//}
//file_put_contents('stderrFile1.txt', print_r($stderr1, true));

//$run_cmd = 'java Test1';
run_code('qemu-arm -L /usr/arm-linux-gnueabi test1', $inputs, $stderr, $stdout);
writeTofile($stderr);
writeTofile($stdout);


  //echo "$stdout";
 

//fclose('stdoutRun.txt');



//foreach($stdout as &$value){
	//fwrite($stdoutRun, $value);

//}
//foreach($stderr as &$value)
	//fwrite($stderrRun, $value);
//file_put_contents('stderrFile.txt', print_r($stderr, true));
//file_put_contents('stdoutFile.txt', print_r($stdout, true));



?> 








