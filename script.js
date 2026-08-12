const starredList = document.getElementById('starred-list');
const statusMessage = document.getElementById('status-message');

function formatStarredAt(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function renderRepositories(items) {
  if (!items.length) {
    statusMessage.textContent = 'No starred repositories found.';
    return;
  }

  statusMessage.remove();

  const fragment = document.createDocumentFragment();

  items.forEach(event => {
    const { repository, starredAt } = event;
    const listItem = document.createElement('li');

    listItem.innerHTML = `
      <h2 class="repo-title">
        <a href="${repository.url}" target="_blank" rel="noopener noreferrer">
          ${repository.owner}/${repository.name}
        </a>
      </h2>
      <p class="repo-meta">${repository.stars.toLocaleString()} stars</p>
      <p class="repo-description">${repository.description}</p>
      <p class="repo-starred-at">Starred on ${formatStarredAt(starredAt)}</p>
    `;

    fragment.appendChild(listItem);
  });

  starredList.appendChild(fragment);
}

async function loadStarredRepositories() {
  try {
    const response = await fetch('events.json');

    if (!response.ok) {
      throw new Error(`Unable to load data: ${response.status} ${response.statusText}`);
    }

    const events = await response.json();
    renderRepositories(events);
  } catch (error) {
    statusMessage.textContent = `An error occurred while loading starred repositories: ${error.message}`;
  }
}

loadStarredRepositories();
