const statusMessage = document.querySelector("#status");
const repositoryList = document.querySelector("#repositories");

function isRepository(entry) {
  if (
    typeof entry?.name !== "string" ||
    typeof entry.description !== "string" ||
    typeof entry.url !== "string" ||
    typeof entry.starred_at !== "string"
  ) {
    return false;
  }

  try {
    const url = new URL(entry.url);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      !Number.isNaN(Date.parse(entry.starred_at))
    );
  } catch {
    return false;
  }
}

function renderRepository(repository) {
  const item = document.createElement("li");
  item.className = "repository-card";

  const heading = document.createElement("h3");
  const link = document.createElement("a");
  link.href = repository.url;
  link.textContent = repository.name;
  heading.append(link);

  const description = document.createElement("p");
  description.textContent = repository.description;

  const starredAt = document.createElement("time");
  const date = new Date(repository.starred_at);
  starredAt.dateTime = date.toISOString();
  starredAt.textContent = `Starred ${new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
  }).format(date)}`;

  item.append(heading, description, starredAt);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories) || !repositories.every(isRepository)) {
      throw new Error("events.json must contain a list of valid repositories");
    }

    repositoryList.replaceChildren(...repositories.map(renderRepository));
    statusMessage.textContent = repositories.length
      ? ""
      : "No starred repositories yet.";
  } catch (error) {
    console.error("Could not load starred repositories:", error);
    statusMessage.textContent =
      "Could not load starred repositories. Please try again later.";
  }
}

loadRepositories();
