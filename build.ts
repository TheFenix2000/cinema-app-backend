const result = await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./dist",
	sourcemap: "external",
	target: "bun",
	minify: true,
});

export { result };

