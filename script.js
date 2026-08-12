const starredList = document.getElementById('starred-list');
const statusMessage = document.getElementById('status-message');

if (!starredList || !statusMessage) {
  console.error('Required DOM elements are missing: starred-list or status-message');
}

function formatStarredAt(timestamp) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return 'an unknown date';
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function renderRepositories(items) {
  const validItems = Array.isArray(items)
    ? items.filter(event => event?.repository && event.repository.name && event.repository.owner)
    : [];

  if (validItems.length === 0) {
    statusMessage.textContent = 'No starred repositories found.';
    return;
  }

  statusMessage.remove();

  const fragment = document.createDocumentFragment();

  validItems.forEach(event => {
    const { repository, starredAt } = event;
    const listItem = document.createElement('li');

    const repoUrl = typeof repository.url === 'string' && repository.url.trim() !== ''
      ? repository.url.trim()
      : '#';

    listItem.innerHTML = `
      <h2 class="repo-title">
        <a href="${repoUrl}" target="_blank" rel="noopener noreferrer">
          ${repository.owner}/${repository.name}
        </a>
      </h2>
      <p class="repo-meta">${Number.isFinite(repository.stars) ? repository.stars.toLocaleString() : '0'} stars</p>
      <p class="repo-description">${repository.description || 'No description provided.'}</p>
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
