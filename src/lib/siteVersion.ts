import packageJson from "../../package.json";

/** 与根目录 package.json 同步，用于页脚等展示。 */
export const SITE_VERSION = packageJson.version as string;
