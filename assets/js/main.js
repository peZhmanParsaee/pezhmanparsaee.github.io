const GITHUB_USER = "peZhmanParsaee";
const PORTFOLIO_REPO = "pezhmanparsaee.github.io";
const projectGrid = document.querySelector("#project-grid");

document.querySelector("#year").textContent = new Date().getFullYear();

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

document.querySelectorAll(".reveal").forEach((element) => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add("is-visible");
});

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function formatDate(value) {
  if (!value) return "Public repository";
  return "Updated " + new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(value));
}

function repositoryCard(repo, index) {
  const description = repo.description || "Explore the source code and implementation details on GitHub.";
  const language = repo.language || "Open source";
  const tags = [language, ...(repo.topics || []).slice(0, 2)].filter(Boolean);
  return `
    <article class="project-card reveal is-visible">
      <div class="project-card-top"><span>PROJECT / 0${index + 1}</span><span class="project-symbol" aria-hidden="true">↗</span></div>
      <h3>${escapeHTML(repo.name.replace(/[-_]/g, " "))}</h3>
      <p>${escapeHTML(description)}</p>
      <div class="project-tags">${tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
      <div class="project-card-footer"><span>${escapeHTML(formatDate(repo.pushed_at))}</span><a href="${escapeHTML(repo.html_url)}" target="_blank" rel="noreferrer">View repository ↗</a></div>
    </article>`;
}

async function loadProjects() {
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100&type=owner`, {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error("GitHub API returned " + response.status);
    const repositories = await response.json();
    const projects = repositories
      .filter((repo) => !repo.fork && !repo.archived && repo.name !== PORTFOLIO_REPO)
      .sort((a, b) => new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at))
      .slice(0, 6);

    if (!projects.length) {
      projectGrid.innerHTML = '<div class="project-card"><h3>Projects coming soon</h3><p>Visit GitHub to explore public repositories.</p><div class="project-card-footer"><span>GITHUB</span><a href="https://github.com/peZhmanParsaee?tab=repositories" target="_blank" rel="noreferrer">Browse all ↗</a></div></div>';
      return;
    }
    projectGrid.innerHTML = projects.map(repositoryCard).join("");
  } catch (error) {
    projectGrid.innerHTML = '<article class="project-card"><div class="project-card-top"><span>GITHUB</span><span class="project-symbol" aria-hidden="true">↗</span></div><h3>Explore my repositories</h3><p>Project details could not be loaded right now. You can still browse the full list of public repositories on GitHub.</p><div class="project-card-footer"><span>PUBLIC WORK</span><a href="https://github.com/peZhmanParsaee?tab=repositories" target="_blank" rel="noreferrer">View GitHub ↗</a></div></article>';
    console.error("Unable to load GitHub repositories:", error);
  }
}

loadProjects();
