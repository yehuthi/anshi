const NS = `ANSHI_`;
const CONFIG = Object.freeze({
	INCLUDE_GUARD: `_${NS}H`,
	SGR_MAX_ARGS: 16,
});

function println(...args) { console.log(...args) }

function surround(start, end, f) {
	println(start);
	f();
	println(end);
}

function section(name, f) {
	surround(
		`\n/* ${name} {{{ */\n`,
		`/* }}} ${name} */`,
		f
	);
}

const HEADER = [
	"/* NOTE: AUTO-GENERATED */",
	`#ifndef ${CONFIG.INCLUDE_GUARD}`,
	`#define ${CONFIG.INCLUDE_GUARD}`,
].join('\n');
const FOOTER = `\n#endif /* ${CONFIG.INCLUDE_GUARD} */`
surround(HEADER, FOOTER, () => {
	section("Codes", () => {
		for (let { name, value } of [
			{
				name: "bell",
				value: "\\a",
			},
			{
				name: "backspace",
				value: "\\b",
			},
			{
				name: "tab",
				value: "\\t",
			},
			{
				name: "linefeed",
				value: "\\n",
			},
			{
				name: "tab (vertical)",
				value: "\\v",
			},
			{
				name: "form feed",
				value: "\\f",
			},
			{
				name: "carriage return",
				value: "\\a",
			},
			{
				name: "escape",
				description: "ANSI Escape",
				value: "\\e",
			},
			{
				name: "CSI",
				description: "Control Sequence Introducer",
				value: "\\e[",
			},
			{
				name: "DCS",
				description: "Device Control String",
				value: "\\eP",
			},
			{
				name: "OSC",
				description: "Operating System Command",
				value: "\\e]",
			},
			{
				name: "delete",
				value: "\\x7f",
			},
		]) {
			const symbol = name
				.replaceAll(/[^1-9a-zA-Z ]/g,'')
				.replaceAll(" ", "_")
				.toUpperCase();
			name = [name[0].toUpperCase(), ...name.substring(1)].join('');
			println(`/// ${name} control code.\n#define ${NS}${symbol} "${value}"\n`);
		}
	});

	section("Graphics - Style", () => {
		println(`/// Reset all modes (style & colors)\n#define ${NS}RESET "0"\n`);
		for (const option of [
			{
				name: "bold",
				description: "Bold or increased intensity",
				set: 1,
				reset: 22,
			},
			{
				name: "faint",
				description: "Faint, decreased intensity, or dim (may be implemented as a light font weight like bold)",
				set: 2,
				reset: 22,
			},
			{
				name: "italic",
				description: "Italic. Not widely supported. Sometimes treated as inverse or blink",
				set: 3,
			},
			{
				name: "underline",
				description: "Underline",
				set: 4,
			},
			{
				name: "blink",
				description: "Blink (slow). Sets blinking to less than 150 times per minute",
				set: 5,
			},
			{
				name: "blink_fast",
				description: "Blink (fast). MS-DOS ANSI.SYS, 150+ per minute; not widely supported",
				set: 6,
			},
			{
				name: "inverse",
				description: "Invert / revert. Swap foreground and background colors",
				set: 7,
			},
			{
				name: "hide",
				description: "Hidden/invisible mode. Not widely supported",
				set: 8,
			},
			{
				name: "strikethrough",
				description: "Strikethrough. Characters legible but marked as if for deletion",
				set: 9,
			},
		]) {
			println(option.description
				.split('\n')
				.map(x => `/// ${x}`).join('\n')
			);
			println(`#define ${NS}${option.name.toUpperCase()} "${option.set}"`);
			println(`#define ${NS}${option.name.toUpperCase()}_RESET "${option.reset ?? 20 + option.set}"`);
			println("");
		}
	});

	section("Graphics - Color (8)", () => {
		for (const [i, color] of [
			"black", "red", "green", "yellow", "blue", "magenta", "cyan", "white",
			"default",
		].entries()) {
			println(`/// Sets the foreground color to ${color}.\n#define ${NS}FG_${color.toUpperCase()} "${30 + i}"`);
			println(`/// Sets the background color to ${color}.\n#define ${NS}BG_${color.toUpperCase()} "${40 + i}"`);
			println("");
		}
	});

	section("Graphics - Color (256)", () => {
		println(`/// Sets a 256 color foreground.\n#define ${NS}FG256(ID) "38;5;" #ID`);
		println(`/// Sets a 256 color background.\n#define ${NS}BG256(ID) "48;5;" #ID`);
		println("");
	});

	section("Graphics - Color (RGB)", () => {
		println(`/// Sets a RGB color foreground.\n#define ${NS}FGRGB(R,G,B) "38;2;" #R ";" #G ";" #B`);
		println(`/// Sets a RGB color background.\n#define ${NS}BGRGB(R,G,B) "48;2;" #R ";" #G ";" #B`);
		println("");
	});
	
	section("Graphics - Select Graphic Rendition (SGR)", () => {
		const SGR_PICKER = `_${NS}SGR_PICKER`;
		const SGR_VARIANT = `_${NS}SGR`;
		{
			let d = `#define ${SGR_PICKER}(`;
			for (let i = 1; i < CONFIG.SGR_MAX_ARGS + 1; i++)
				d += `_${i},`;
			d += `N,...) N`;
			println(d);
		}

		for (let i = 1; i < CONFIG.SGR_MAX_ARGS + 1; i++) {
			let d = `#define ${SGR_VARIANT}${i}(`;
			const args = [...new Array(i).keys().map(j => `_${j + 1}`)];
			d += args.join(',');
			d += `) `;
			d += args.map(arg => `${NS}##${arg}`).join(' ";" ');
			println(d);
		}

		{
			let d = `#define ${NS}SGR(...) ${NS}CSI `;
			d += `${SGR_PICKER}(__VA_ARGS__`;
			for (let i = CONFIG.SGR_MAX_ARGS; i > 0; i--)
				d += `,${SGR_VARIANT}${i}`;
			d += ')(__VA_ARGS__) "m"';
			println(d);
		}
		println("");
	});
});
