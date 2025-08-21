const GITHUB_USER = "yourusername"; // <-- change me


function $(sel, root=document){ return root.querySelector(sel); }
function el(tag, attrs={}){ const e=document.createElement(tag); Object.assign(e, attrs); return e; }


// Year in footer
$("#year").textContent = new Date().getFullYear();


// Render Projects & Tools
(async function loadProjects(){
try {
const res = await fetch("/data/projects.json");
const data = await res.json();
const grid = $("#projects");


data.projects.forEach(p => {
const card = el("article", { className: "card" });
card.innerHTML = `
<h3>${p.name}</h3>
<p class="muted">${p.summary}</p>
<p>${p.tags.map(t=>`<span>#${t}</span>`).join(" ")}</p>
<p>
${p.demo ? `<a class="btn" href="${p.demo}" target="_blank" rel="noopener">Demo</a>` : ""}
${p.repo ? `<a class="btn btn-ghost" href="${p.repo}" target="_blank" rel="noopener">Repo</a>` : ""}
</p>`;
grid.appendChild(card);
});


// Tools list
const toolsList = $("#tools-list");
(data.tools||[]).forEach(t => {
const li = el("li");
li.innerHTML = `<a href="${t.path}">${t.name}</a> — <span class="muted">${t.summary}</span>`;
toolsList.appendChild(li);
});
} catch(e){ console.error("projects.json missing or invalid", e); }
})();


// Render Blog list
(async function loadPosts(){
try {
const res = await fetch("/data/posts.json");
const posts = await res.json();
const list = $("#blog-list");
posts.forEach(p => {
const card = el("article", { className: "card" });
card.innerHTML = `<h3><a href="${p.path}">${p.title}</a></h3>
<p class="muted">${p.date} · ${p.tags.join(", ")}</p>
<p>${p.excerpt}</p>`;
list.appendChild(card);
});
} catch(e){ console.error("posts.json missing or invalid", e); }
})();


// Simple GitHub activity feed (public events)
(async function loadFeed(){
if(!GITHUB_USER) return;
try {
const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/events/public`);
if(!res.ok) throw new Error("GitHub API rate limit or user not found");
const events = await res.json();
const feed = $("#feed-items");


events.slice(0, 10).forEach(ev => {
const type = ev.type.replace(/Event$/, "");
const repo = ev.repo?.name || "repo";
const when = new Date(ev.created_at).toLocaleString();
const msg = `${type} on ${repo}`;
const card = el("div", { className: "card" });
card.innerHTML = `<strong>${msg}</strong><div class="muted">${when}</div>`;
feed.appendChild(card);
});
} catch(e){
console.warn("Feed unavailable:", e.message);
}
})();