# anshi

Zero-cost C/C++ header-only library for ANSI control codes.

## Usage

### Introduction

In order for the API to make sense, you should be familiar with two core
concepts:
- **Control Codes**: these are sequences of characters that are sent to a
terminal, but their purpose is not to be displayed. Instead, they are
meant to cause some side-effect, like set the foreground color for the
text that follows, or make a
[bell](https://en.wikipedia.org/wiki/Bell_character) sound.
- **SGR (Select Graphic Rendition)**: a subset of ANSI codes. These codes
are used to change the color and style of text, which is probably why
you're here! Note that multiple changes can be chained in one SGR sequence.
For example, sending an SGR that changes foreground to white and background
to red, is functionally the same as sending an SGR that changes foreground
to white + another SGR that changes foreground to white, but the former
is more convenient and requires less bytes (and potentially less
processing).

You should also be familiar with C/C++'s string literal concatenation,
because you're probably going to make heavy use of them:
```c
// This is valid
"Hello, " "World" "!"
// and is the same as:
"Hello, World!"
```
This allows us to chain and interweave display characters and control
characters.

For example:
```c
puts("Hello, " ANSHI_SGR(BOLD,UNDERLINE) "World" ANSHI_SGR(RESET) "!");
// After preprocessor expansion:
puts("Hello, \033[1;4mWorld\033[0m!")
```

### Codes

To use codes, you can just refer to them by name and chain them together.
All names are namespaced by the `ANSHI_` prefix.
For example:
```c
puts("All jobs finished!\n" ANSHI_BELL);
// => "All jobs finished!\n\a"
```

You can also style and color text in this manner, which requires you to
form SGR sequences manually (avoid it, a better way is described below):
```c
puts("This text is " ANSHI_CSI ANSHI_FG_RED "m" "RED" ANSHI_CSI ANSHI_RESET "m" "!\n");
// => "This text is \033[31mRED\033[0m!\n"
```

### SGR

`ANSHI_SGR` is a macro that constructs an SGR frame from its arguments.

Refer to the example at the end of [§ Introduction](#Introduction).

- It's variadic up to 16 arguments (may increase if somehow there would be
demand).
- Arguments are values from the API, but without the namespace.
- There is no checking that arguments make sense in SGR context, so be
mindful what needs to be in SGR and what should be a simple control
character.

See [`demo.c`](./demo.c) for more example usage.

## Build

Despite being header-only, this library requires a build step for code
generation. Either depend on this library via CMake which takes care of
it, or run [`codegen.js`](./codegen.js) and redirect to file.
In both cases, you will need `node` installed on your path.
