@ARm program to print "The number is %d", where %d is 129.

	.text		
	.global main
main:                        
	sub sp, sp, #4
	str	lr, [sp, #0]	

	@printf(format,r1) Give the arguments in order of the register numbers!!
	@129 is printed first since it's in r1
	ldr r0, =new
    	bl  printf
	ldr	r0, =format
	mov	r2, #65	     
	mov	r1, #129     
	bl	printf

	ldr	lr, [sp, #0]
	add	sp, sp, #4
	mov	pc, lr

	.data 	
new: .asciz "This is a test label"
format: .asciz "The number is %d and letter is %c\n" 


