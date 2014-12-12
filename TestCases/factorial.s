@Problem 4:Factorial of a number

	.text
	.global main

main:
	sub	sp, sp, #4
	str	lr, [sp, #0]

	mov	r4, #1	@fact=1
	mov	r5, #1	@i=1
	mov	r6, #4	@Number to find the factorial of

loop:
	cmp	r5, r6
	bgt	exit

	mul	r7, r4, r5	@fact=fact*i
	mov	r4, r7	   	@Since mul, Rn and Rd should be different
	add	r5, r5, #1	@i=i+1
	b	loop


exit: 
	ldr	r0, =result
	mov	r1, r6
	mov	r2, r7
	bl	printf

	ldr	lr, [sp, #0]
	add	sp, sp, #4

	mov	pc, lr

	.data

result: .asciz "Factorial of %d is %d\n"
