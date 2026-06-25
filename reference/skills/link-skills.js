(() => {
  if (window.__skillAutoLinks) return;
  window.__skillAutoLinks = true;

  const skills = [
    "ask-matt",
    "codebase-design",
    "decision-mapping",
    "diagnosing-bugs",
    "domain-modeling",
    "edit-article",
    "git-guardrails-claude-code",
    "grill-me",
    "grill-with-docs",
    "grilling",
    "handoff",
    "implement",
    "improve-codebase-architecture",
    "migrate-to-shoehorn",
    "obsidian-vault",
    "prototype",
    "resolving-merge-conflicts",
    "review",
    "scaffold-exercises",
    "setup-matt-pocock-skills",
    "setup-pre-commit",
    "tdd",
    "teach",
    "to-issues",
    "to-prd",
    "triage",
    "writing-beats",
    "writing-fragments",
    "writing-great-skills",
    "writing-shape"
  ];
  const aliases = new Map([
    ["domain-modelling", "domain-modeling.html"]
  ]);

  const linkTargets = new Map([
    ...skills.map((skill) => [skill, `${skill}.html`]),
    ...aliases
  ]);
  const escaped = Array.from(linkTargets.keys())
    .sort((a, b) => b.length - a.length)
    .map((skill) => skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const pattern = new RegExp(`(^|[^\\w/-])(/?(?:${escaped}))(?!\\.html)(?=$|[^\\w/-])`, "g");

  const skipSelector = "a, pre, script, style, textarea, input";
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !pattern.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
      pattern.lastIndex = 0;
      if (node.parentElement?.closest(skipSelector)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    const text = node.nodeValue;
    let lastIndex = 0;

    text.replace(pattern, (match, prefix, token, offset) => {
      const tokenStart = offset + prefix.length;
      if (tokenStart > lastIndex) {
        fragment.append(document.createTextNode(text.slice(lastIndex, tokenStart)));
      }

      const skill = token.startsWith("/") ? token.slice(1) : token;
      const link = document.createElement("a");
      link.href = linkTargets.get(skill);
      link.textContent = token;
      fragment.append(link);

      lastIndex = offset + match.length;
      return match;
    });

    if (lastIndex < text.length) {
      fragment.append(document.createTextNode(text.slice(lastIndex)));
    }
    node.replaceWith(fragment);
  });
})();
