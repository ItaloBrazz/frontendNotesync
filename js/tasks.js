// Configuração da API
const API_BASE_URL = 'http://localhost:3000/api';

// Função para fazer requisições HTTP com autenticação
async function makeAuthenticatedRequest(url, options = {}) {
  const token = localStorage.getItem('token');
  
  console.log('Token encontrado:', token ? 'Sim' : 'Não');
  
  if (!token) {
    throw new Error('Usuário não autenticado');
  }
  
  try {
    console.log('Fazendo requisição autenticada para:', url);
    console.log('Opções:', options);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    });

    console.log('Resposta recebida:', response.status, response.statusText);
    
    const data = await response.json();
    console.log('Dados da resposta:', data);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado, redirecionar para login
        console.log('Token expirado, redirecionando para login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'loginPage.html';
        return;
      }
      throw new Error(data.error || 'Erro na requisição');
    }
    
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// Função para criar tarefa
async function createTask(taskData) {
  try {
    console.log('Criando tarefa:', taskData);
    
    // Garantir que o status seja sempre 'todo' para novas tarefas
    const taskToCreate = {
      title: taskData.title,
      status: 'todo'
    };
    
    console.log('Dados da tarefa a ser criada:', taskToCreate);
    
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskToCreate)
    });
    
    console.log('Tarefa criada com sucesso:', response);
    return response;
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    throw error;
  }
}

// Função para buscar todas as tarefas
async function getTasks() {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/tasks`);
    return response;
  } catch (error) {
    throw error;
  }
}

// Função para atualizar tarefa
async function updateTask(taskId, taskData) {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
    
    return response;
  } catch (error) {
    throw error;
  }
}

// Função para deletar tarefa
async function deleteTask(taskId) {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE'
    });
    
    return response;
  } catch (error) {
    throw error;
  }
}

// Função para renderizar tarefas na página
function renderTasks(tasks, status = 'todo') {
  console.log('=== RENDERIZANDO TAREFAS ===');
  console.log('Tarefas recebidas:', tasks);
  console.log('Status filtrado:', status);
  
  const taskContainer = document.querySelector('.content');
  console.log('Container encontrado:', taskContainer);
  
  if (!taskContainer) {
    console.error('❌ Container de tarefas não encontrado');
    return;
  }
  
  // Limpar tarefas existentes (tanto .task quanto .task-card)
  const existingTasks = taskContainer.querySelectorAll('.task, .task-card, .no-tasks-message');
  console.log('Removendo', existingTasks.length, 'elementos existentes');
  existingTasks.forEach(task => task.remove());
  
  // Filtrar tarefas por status
  const filteredTasks = tasks.filter(task => task.status === status);
  console.log('Tarefas filtradas:', filteredTasks);
  
  // Se não há tarefas, mostrar mensagem
  if (filteredTasks.length === 0) {
    console.log('Nenhuma tarefa encontrada, mostrando mensagem');
    const noTasksMsg = document.createElement('div');
    noTasksMsg.className = 'no-tasks-message';
    noTasksMsg.style.cssText = `
      text-align: center;
      color: #a0a0a0;
      padding: 40px 20px;
      font-size: 1.1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      margin: 20px 0;
    `;
    noTasksMsg.textContent = status === 'todo' ? 'Nenhuma tarefa a fazer' : 'Nenhuma tarefa concluída';
    taskContainer.appendChild(noTasksMsg);
    console.log('Mensagem de "nenhuma tarefa" adicionada');
    return;
  }
  
  // Renderizar cada tarefa
  console.log('Criando cards para', filteredTasks.length, 'tarefas');
  filteredTasks.forEach((task, index) => {
    console.log(`Criando card ${index + 1} para tarefa:`, task);
    const taskElement = createTaskElement(task);
    taskContainer.appendChild(taskElement);
    console.log(`Card ${index + 1} adicionado ao container`);
  });
  
  const finalCards = taskContainer.querySelectorAll('.task-card');
  console.log('✅ Renderização concluída. Cards no DOM:', finalCards.length);
}

// Função para criar elemento HTML da tarefa (CARD)
function createTaskElement(task) {
  console.log('Criando card para tarefa:', task);
  const taskCard = document.createElement('div');
  taskCard.className = 'task-card';
  taskCard.dataset.taskId = task.id;
  
  // Header do card com status
  const cardHeader = document.createElement('div');
  cardHeader.className = 'card-header';
  
  const statusIndicator = document.createElement('div');
  statusIndicator.className = `status-indicator ${task.status}`;
  statusIndicator.textContent = task.status === 'todo' ? '📦 A fazer' : '✅ Feito';
  
  const taskDate = document.createElement('div');
  taskDate.className = 'task-date';
  taskDate.textContent = new Date(task.createdAt || Date.now()).toLocaleDateString('pt-BR');
  
  cardHeader.appendChild(statusIndicator);
  cardHeader.appendChild(taskDate);
  
  // Conteúdo do card
  const cardContent = document.createElement('div');
  cardContent.className = 'card-content';
  
  const taskTitle = document.createElement('div');
  taskTitle.className = 'task-title';
  taskTitle.textContent = task.title;
  taskTitle.contentEditable = false;
  
  const taskInput = document.createElement('input');
  taskInput.type = 'text';
  taskInput.value = task.title;
  taskInput.className = 'task-input hidden';
  taskInput.style.display = 'none';
  
  cardContent.appendChild(taskTitle);
  cardContent.appendChild(taskInput);
  
  // Ações do card
  const cardActions = document.createElement('div');
  cardActions.className = 'card-actions';
  
  // Botão de editar/salvar
  const editBtn = document.createElement('button');
  editBtn.className = 'action-btn edit-btn';
  editBtn.innerHTML = '✏️';
  editBtn.title = 'Editar tarefa';
  editBtn.onclick = () => toggleEditMode(taskCard, task.id);
  
  // Botão de mudar status
  const statusBtn = document.createElement('button');
  statusBtn.className = 'action-btn status-btn';
  if (task.status === 'todo') {
    statusBtn.innerHTML = '✅';
    statusBtn.title = 'Marcar como feito';
    statusBtn.onclick = () => changeTaskStatus(task.id, 'done');
  } else {
    statusBtn.innerHTML = '📦';
    statusBtn.title = 'Marcar como a fazer';
    statusBtn.onclick = () => changeTaskStatus(task.id, 'todo');
  }
  
  // Botão de deletar
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'action-btn delete-btn';
  deleteBtn.innerHTML = '🗑️';
  deleteBtn.title = 'Excluir tarefa';
  deleteBtn.onclick = () => deleteTaskConfirm(task.id);
  
  cardActions.appendChild(editBtn);
  cardActions.appendChild(statusBtn);
  cardActions.appendChild(deleteBtn);
  
  // Montar o card
  taskCard.appendChild(cardHeader);
  taskCard.appendChild(cardContent);
  taskCard.appendChild(cardActions);
  
  console.log('Card criado com sucesso:', taskCard);
  return taskCard;
}

// Função para alternar modo de edição inline
function toggleEditMode(taskCard, taskId) {
  const taskTitle = taskCard.querySelector('.task-title');
  const taskInput = taskCard.querySelector('.task-input');
  const editBtn = taskCard.querySelector('.edit-btn');
  
  if (taskTitle.style.display !== 'none') {
    // Entrar no modo de edição
    taskTitle.style.display = 'none';
    taskInput.style.display = 'block';
    taskInput.focus();
    taskInput.select();
    editBtn.innerHTML = '💾';
    editBtn.title = 'Salvar alterações';
    
    // Adicionar evento para salvar ao pressionar Enter
    taskInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        saveTaskEdit(taskCard, taskId);
      }
    });
    
    // Adicionar evento para cancelar ao pressionar Escape
    taskInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        cancelTaskEdit(taskCard);
      }
    });
  } else {
    // Salvar alterações
    saveTaskEdit(taskCard, taskId);
  }
}

// Função para salvar edição da tarefa
async function saveTaskEdit(taskCard, taskId) {
  const taskInput = taskCard.querySelector('.task-input');
  const newTitle = taskInput.value.trim();
  
  if (!newTitle) {
    alert('O título da tarefa não pode estar vazio');
    return;
  }
  
  try {
    await updateTask(taskId, { title: newTitle });
    
    // Atualizar o título exibido
    const taskTitle = taskCard.querySelector('.task-title');
    taskTitle.textContent = newTitle;
    
    // Voltar ao modo de visualização
    taskTitle.style.display = 'block';
    taskInput.style.display = 'none';
    
    // Restaurar botão de editar
    const editBtn = taskCard.querySelector('.edit-btn');
    editBtn.innerHTML = '✏️';
    editBtn.title = 'Editar tarefa';
    
    console.log('Tarefa editada com sucesso');
  } catch (error) {
    console.error('Erro ao editar tarefa:', error);
    alert('Erro ao editar tarefa: ' + error.message);
  }
}

// Função para cancelar edição da tarefa
function cancelTaskEdit(taskCard) {
  const taskTitle = taskCard.querySelector('.task-title');
  const taskInput = taskCard.querySelector('.task-input');
  const editBtn = taskCard.querySelector('.edit-btn');
  
  // Restaurar valor original
  taskInput.value = taskTitle.textContent;
  
  // Voltar ao modo de visualização
  taskTitle.style.display = 'block';
  taskInput.style.display = 'none';
  
  // Restaurar botão de editar
  editBtn.innerHTML = '✏️';
  editBtn.title = 'Editar tarefa';
}

// Função para mudar status da tarefa
async function changeTaskStatus(taskId, newStatus) {
  try {
    await updateTask(taskId, { status: newStatus });
    
    // Recarregar tarefas para atualizar a exibição
    loadTasks();
    
    console.log(`Tarefa ${taskId} marcada como ${newStatus}`);
  } catch (error) {
    console.error('Erro ao mudar status da tarefa:', error);
    alert('Erro ao mudar status da tarefa: ' + error.message);
  }
}

// Função para confirmar exclusão
function deleteTaskConfirm(taskId) {
  if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
    deleteTask(taskId).then(() => {
      loadTasks();
    }).catch(error => {
      alert('Erro ao excluir tarefa: ' + error.message);
    });
  }
}

// Função para marcar como feito (mantida para compatibilidade)
async function markAsDone(taskId) {
  await changeTaskStatus(taskId, 'done');
}

// Função para marcar como a fazer (mantida para compatibilidade)
async function markAsTodo(taskId) {
  await changeTaskStatus(taskId, 'todo');
}

// Função para carregar tarefas
async function loadTasks() {
  try {
    console.log('loadTasks() chamada');
    console.log('Carregando tarefas...');
    
    // Verificar se auth está disponível
    if (typeof auth === 'undefined') {
      console.error('Objeto auth não está disponível');
      throw new Error('Sistema de autenticação não carregado');
    }
    
    // Verificar se usuário está logado
    if (!auth.isLoggedIn()) {
      console.log('Usuário não logado, redirecionando...');
      window.location.href = 'loginPage.html';
      return;
    }
    
    const tasks = await getTasks();
    console.log('Tarefas carregadas:', tasks);
    
    // Determinar status baseado na página atual
    let status = 'todo';
    if (window.location.pathname.includes('donePage.html')) {
      status = 'done';
    }
    
    console.log('Renderizando tarefas com status:', status);
    console.log('Container encontrado:', document.querySelector('.content'));
    renderTasks(tasks, status);
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
    alert('Erro ao carregar tarefas: ' + error.message);
  }
}

// Função para mostrar mensagens de erro
function showError(message) {
  alert('Erro: ' + message);
}

// Função para mostrar mensagens de sucesso
function showSuccess(message) {
  alert('Sucesso: ' + message);
}

// Exportar funções para uso global
window.tasks = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  renderTasks,
  loadTasks,
  editTask,
  markAsDone,
  markAsTodo,
  toggleEditMode,
  saveTaskEdit,
  cancelTaskEdit,
  changeTaskStatus,
  showError,
  showSuccess
};

// Log para confirmar que o objeto foi exportado
console.log('✅ Objeto tasks exportado com sucesso');

