const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const taskList = document.getElementById('taskList');
const dialog = document.getElementById('taskDialog');
const form = document.getElementById('taskForm');
const dialogTitle = document.getElementById('dialogTitle');
const taskIdInput = document.getElementById('taskId');
const titleInput = document.getElementById('titleInput');
const descriptionInput = document.getElementById('descriptionInput');
const doneInput = document.getElementById('doneInput');
const flash = document.getElementById('flash');

function showFlash(message, isError = false) {
  flash.textContent = message;
  flash.className = 'flash show' + (isError ? ' error' : '');
  setTimeout(() => flash.classList.remove('show'), 3000);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

// ── READ ─────────────────────────────────────────────────────────────
async function loadTasks() {
  const { data, error } = await client
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    taskList.innerHTML = `<tr><td colspan="4">Error loading tasks: ${escapeHtml(error.message)}</td></tr>`;
    return;
  }

  if (!data.length) {
    taskList.innerHTML = `<tr><td colspan="4">No tasks yet. Create one!</td></tr>`;
    return;
  }

  taskList.innerHTML = data.map(task => `
    <tr class="${task.done ? 'done' : ''}">
      <td>${escapeHtml(task.title)}</td>
      <td>${escapeHtml(task.description)}</td>
      <td>${task.done ? 'Done' : 'Pending'}</td>
      <td class="actions">
        <button class="secondary" onclick="openEdit(${task.id})">Edit</button>
        <button class="danger" onclick="deleteTask(${task.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

// ── CREATE / UPDATE (shared dialog) ─────────────────────────────────────
document.getElementById('newTaskBtn').addEventListener('click', () => {
  dialogTitle.textContent = 'New Task';
  taskIdInput.value = '';
  titleInput.value = '';
  descriptionInput.value = '';
  doneInput.checked = false;
  dialog.showModal();
});

document.getElementById('cancelBtn').addEventListener('click', () => dialog.close());

window.openEdit = async function (id) {
  const { data, error } = await client.from('tasks').select('*').eq('id', id).single();
  if (error) {
    showFlash('Error loading task: ' + error.message, true);
    return;
  }
  dialogTitle.textContent = 'Edit Task';
  taskIdInput.value = data.id;
  titleInput.value = data.title;
  descriptionInput.value = data.description ?? '';
  doneInput.checked = data.done;
  dialog.showModal();
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = taskIdInput.value;
  const payload = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    done: doneInput.checked,
  };

  if (!payload.title) return;

  let error;
  if (id) {
    ({ error } = await client.from('tasks').update(payload).eq('id', id));
  } else {
    ({ error } = await client.from('tasks').insert(payload));
  }

  if (error) {
    showFlash('Error saving task: ' + error.message, true);
    return;
  }

  dialog.close();
  showFlash(id ? 'Task updated' : 'Task created');
  loadTasks();
});

// ── DELETE ───────────────────────────────────────────────────────────
window.deleteTask = async function (id) {
  if (!confirm('Delete this task?')) return;

  const { error } = await client.from('tasks').delete().eq('id', id);
  if (error) {
    showFlash('Error deleting task: ' + error.message, true);
    return;
  }
  showFlash('Task deleted');
  loadTasks();
};

// ── INIT ─────────────────────────────────────────────────────────────
loadTasks();
