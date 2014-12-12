@ Write an ARM program to 
@	- copy two values (integers) to registers
@	- add the values
@	- print the answer as a formatted string

	.text
	.global main
main:                        
	@ store (push) lr to the stack
	sub	sp, sp, #4
	str	lr, [sp, #0]

	@ YOUR CODE HERE
	ldr	r0, =format
	mov	r1, #28
	mov	r2, #25
	add	r3, r1, r2
	bl	printf

	@ retrive (pop) lr from the stack	
	ldr	lr, [sp, #0]
	add	sp, sp, #4

	@ return 
	mov	pc, lr		

	.data
format: .asciz "%d + %d is %d\n" 
