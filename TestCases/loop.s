@Problem 3:Print Numbers recursively

	.text
	.global main
main:
	sub	sp, sp, #4
	str	lr, [sp, #0]

	mov	r4, #0
	mov	r5, #5
	
	@CONVERT THE LOOP TO A WHILE CODE. IT'S EASIER.	
	
loop:	
	ldr	r0, =result
	mov	r1, r5
	bl	printf
	
	cmp	r4, #8
	beq	exit

	cmp	r5, #10
	beq	exit

	add	r5, r5, r4
	add	r4, r4, #1
	b	loop

exit:
	
	ldr	lr, [sp, #0]
	add	sp, sp, #4
	mov	pc, lr

	.data
result: .asciz	"%d\n" 


