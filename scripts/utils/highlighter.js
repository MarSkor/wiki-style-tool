import {
  createStarryNight,
  common,
} from "https://esm.sh/@wooorm/starry-night@3?bundle";
import { toHtml } from "https://esm.sh/hast-util-to-html@9?bundle";

export async function highlightCode(containerSelector) {
  const starryNight = await createStarryNight(common);
  const container = document.querySelector(containerSelector);
  const codeBlocks = container.querySelectorAll("pre code");

  codeBlocks.forEach((codeElement) => {
    const className = codeElement.className || "";
    const language = className.replace("language-", "") || "js";
    const scope =
      starryNight.flagToScope(language) || starryNight.flagToScope("js");

    const cleanCode = codeElement.textContent
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");

    const tree = starryNight.highlight(cleanCode, scope);
    codeElement.innerHTML = toHtml(tree);
  });
}

export function decodeHTMLEntities(text) {
  if (!text) return "";

  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  let decoded = textArea.value;

  decoded = decoded.replace(/[\u201C\u201D\u201E\u201F]\`/g, "```");
  decoded = decoded.replace(/\`[\u201C\u201D\u201E\u201F]/g, "```");
  decoded = decoded.replace(/\`[\u201C\u201D\u201E\u201F]\`/g, "```");
  decoded = decoded
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'");

  return decoded;
}
