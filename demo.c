#include <stdio.h>
#include <anshi.h>

int main() {
	const char *x = "This text is " ANSHI_CSI ANSHI_FG_RED "m" "RED" ANSHI_CSI ANSHI_RESET "m" "!\n";

	const char *str =
		ANSHI_SGR(BOLD,UNDERLINE)
		"ANSHI DEMO"
		ANSHI_SGR(RESET)
		"\n"
		"This "
		ANSHI_SGR(BOLD)
		"header"
		ANSHI_SGR(RESET)
		" library makes it easy to use ANSI escape codes, to produce "
		"pleasant and modern CLI outputs, such as this one:\n"

		ANSHI_SGR(BG_RED,FG_WHITE,BOLD)
		" ERROR "
		ANSHI_SGR(BOLD_RESET,INVERSE)
		" Keyboard not found. Press F1 to Resume \n"
		ANSHI_SGR(RESET)

		"It's easy to use "
		ANSHI_SGR(BOLD)
		"256-colors"
		ANSHI_SGR(RESET)
		" like "
		ANSHI_SGR(FG256(98))
		"this cool purple"
		ANSHI_SGR(RESET)
		"!\n"
		"And even "
		ANSHI_SGR(BOLD)
		"RGB "
		ANSHI_SGR(FGRGB(255, 0, 0))
		"c"
		ANSHI_SGR(FGRGB(222, 146, 0))
		"o"
		ANSHI_SGR(FGRGB(160, 214, 0))
		"l"
		ANSHI_SGR(FGRGB(70, 224, 133))
		"o"
		ANSHI_SGR(FGRGB(0, 198, 217))
		"r"
		ANSHI_SGR(FGRGB(0, 0, 255))
		"s"
		ANSHI_SGR(RESET)
		"!\n"
		"And best of all: the abstraction is " ANSHI_SGR(BOLD) "zero-cost!"
		ANSHI_SGR(RESET);
	puts(str);
	return 0;
}
