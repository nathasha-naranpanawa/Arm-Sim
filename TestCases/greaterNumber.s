@Problem 2:Print greater number

	.text
	.global main
main:
	sub	sp, sp, #4
	str	lr, [sp, #0]

	
	mov	r4, #30
	mov	r5, #33

	cmp	r4, r5
	bgt	r4greater


	mov	r1, r5
	b	exit

r4greater:	
	mov	r1, r4
	
exit:	
	ldr	r0, =result
	bl	printf

	ldr	lr, [sp, #0]
	add	sp, sp, #4
	mov	pc, lr

	.data
result: .asciz "Greater number is %d\n"


