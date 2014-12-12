@Problem 4:Fibonacci 

	.text
	.global main

main:
	sub	sp, sp, #4
	str	lr, [sp, #0]

	mov	r4, #1	@fib(1)=0
	mov	r5, #1	@fib(2)=1
	mov	r6, #3	@i=1
	mov	r8, #5	@n
	

loop:	
	cmp	r6, r8
	bgt	exit

	add	r7, r4, r5
	mov	r4, r5
	mov	r5, r7
	add	r6,r6, #1
	b loop	


exit:
	ldr	r0, =result
	mov	r1, r7
	bl	printf

	ldr	lr, [sp, #0]
	add	sp, sp, #4

	mov	pc, lr

	.data

result: .asciz "fibNo= %d\n"
