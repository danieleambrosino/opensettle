import adapter from "@sveltejs/adapter-static";

const NODE_MODULES_RE = /[/\\]/;

export default {
  compilerOptions: {
    runes: ({ filename }) =>
      filename.split(NODE_MODULES_RE).includes("node_modules")
        ? undefined
        : true,
  },
  kit: {
    adapter: adapter({ fallback: "index.html" }),
    paths: { base: "/opensettle" },
  },
};
