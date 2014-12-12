@ Write an ARM program to load 129 to a register and print
@ a formatted message to the user ("The number is %d").

	.text
	.global main
main:                        
	sub	sp, sp, #4
	str	lr, [sp, #0]
	
	mov	r5, #129

	@ printf(format,r5)
	ldr	r0, =format
	mov	r1, r5
	bl	printf

	ldr	lr, [sp, #0]
	add	sp, sp, #4
	mov	pc, lr		@ return 

	.data
format: .asciz "The number is %d\n" 
