// The desktop renderer is already compiled into out/. There are no runtime
// npm dependencies in electron/package.json, so keep the root Next.js tree out.
module.exports = () => false;
