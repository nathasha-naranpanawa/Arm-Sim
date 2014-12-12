@Print whether two numbers are equal
	.text
	.global main
main:
	sub	sp, sp, #4
	str	lr, [sp, #0]
	
	mov	r4, #24
	mov	r5, #25

	cmp	r4, r5
	bne	else	@If not equal, go to else

@If equal, put eq to r0 and go to Exit 
	ldr	r0, =eq
	b	Exit


else:	
	ldr	r0, =noteq	@After this, it executes the immediately next instruction, i.e. printf
	
Exit:	
	bl	printf

	ldr	lr, [sp, #0]
	add	sp, sp, #4
	mov	pc, lr

	.data
eq: .asciz "Equal\n"
noteq: .asciz "Not equal\n"

