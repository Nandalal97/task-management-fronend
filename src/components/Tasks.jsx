import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from '../Utility/getToken';
import Swal from "sweetalert2";

const Tasks = () => {

  const [newTask, setNewTask] = useState({ taskTitle: "", description: "", status: "Pending" });
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [editTask, setEditTask] = useState(null); 
  const [showModal, setShowModal] = useState(false);

  const [errors, setErrors] = useState({taskTitle: '', description: ''});
  const tasksPerPage = 10;

  const token = getToken();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://taskmanagement-15uh.onrender.com/api/v1/web/tasks");
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleEditClick = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateTask = async () => {

  const newErrors = { taskTitle: '', description: '' };
  let isValid = true;

  // Validate title
  if (!editTask.taskTitle || editTask.taskTitle.length < 2 || editTask.taskTitle.length > 50) {
    newErrors.taskTitle = 'Title must be between 2 and 50 characters.';
    isValid = false;
  }

  // Validate description
  if (!editTask.description || editTask.description.length < 10) {
    newErrors.description = 'Description must be at least 10 characters.';
    isValid = false;
  }

  // If validation fails, set errors
  if (!isValid) {
    setErrors(newErrors);
    return;
  }
// call api
    try {
      await axios.put(`https://taskmanagement-15uh.onrender.com/api/v1/web/task/edit/${editTask._id}`, editTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      setShowModal(false);
      fetchTasks();// refresh task list
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const filteredTasks = tasks.filter(task =>
    statusFilter === "all" ? true : task.status === statusFilter
  );

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "warning";
      case "In-Progress": return "primary";
      case "Completed": return "success";
      default: return "secondary";
    }
  };


  // Delete Task
  const handleDeleteTask = (taskId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        popup: 'small-popup',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://taskmanagement-15uh.onrender.com/api/v1/web/task/delete/${taskId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Task has been deleted',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
          });

          fetchTasks();// refresh task list
        } catch (error) {
          console.error("Error deleting task:", error);
          
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'Error',
            title: 'Failed to delete the task',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
          });

        }
      }
    });
  };


  const handleAddTask = async () => {
    // Initialize error
  const newErrors = { taskTitle: '', description: '' };
  let isValid = true;
  // Validate title
  if (!newTask.taskTitle || newTask.taskTitle.length < 2 || newTask.taskTitle.length > 50) {
    newErrors.taskTitle = 'Title must be between 2 and 50 characters.';
    isValid = false;
  }

  // Validate description
  if (!newTask.description || newTask.description.length < 10) {
    newErrors.description = 'Description must be at least 10 characters.';
    isValid = false;
  }

  // If validation fails, set errors
  if (!isValid) {
    setErrors(newErrors);
    return;
  }

    try {
      await axios.post("https://taskmanagement-15uh.onrender.com/api/v1/web/task/newtask", newTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Task has been addedd',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });

      setShowNewTaskModal(false);
      setNewTask({ taskTitle: "", description: "", status: "Pending" });
      fetchTasks(); // refresh task list
    } catch (error) {
      console.error("Error creating task:", error.response.data.msg);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: error.response.data.msg || 'Failed to add task',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
    }
  };


  function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );
  }


  return (
    <div className="wrap-content">
      <div className="container-fluid">
        <section>
          <div class="row g-2 mb-3">

            {/* Total Tasks */}
            <div class="col-12 col-md-3">
              <div class="d-flex align-items-center justify-content-between bg-white border-start border-primary border-3 shadow-sm rounded-3 p-2 p-md-3 h-100">
                <div>
                  <p class="mb-1 text-muted">Total Tasks</p>
                  <h4 class="fw-bold mb-0 text-dark">{tasks.length}</h4>
                </div>
                <i class="bi bi-list-task fs-1 text-primary"></i>
              </div>
            </div>
            {/* Pending Tasks */}

            <div class="col-12 col-md-3">
              <div class="d-flex align-items-center justify-content-between bg-white border-start border-warning border-3 shadow-sm rounded-3 p-2 p-md-3 h-100">
                <div>
                  <p class="mb-1 text-muted">Pending Tasks</p>
                  <h4 class="fw-bold mb-0 text-dark">{tasks.filter(task => task.status === 'Pending').length}</h4>
                </div>
                <i class="bi bi-hourglass-split fs-1 text-warning"></i>
              </div>
            </div>

            {/* In-Progress Tasks */}
            <div class="col-12 col-md-3">
              <div class="d-flex align-items-center justify-content-between bg-white border-start border-info border-3 shadow-sm rounded-3 p-2 p-md-3 h-100">
                <div>
                  <p class="mb-1 text-muted">In Progress</p>
                  <h4 class="fw-bold mb-0 text-dark">{tasks.filter(task => task.status === 'In-Progress').length}</h4>
                </div>
                <i class="bi bi-arrow-repeat fs-1 text-info"></i>
              </div>
            </div>

            {/* Completed Tasks */}
            <div class="col-12 col-md-3">
              <div class="d-flex align-items-center justify-content-between bg-white border-start border-success border-3 shadow-sm rounded-3 p-2 p-md-3 h-100">
                <div>
                  <p class="mb-1 text-muted">Completed Tasks</p>
                  <h4 class="fw-bold mb-0 text-dark">{tasks.filter(task => task.status === 'Completed').length}</h4>
                </div>
                <i class="bi bi-check-circle fs-1 text-success icon-circle"></i>
              </div>
            </div>

          </div>
        </section>

        {/* Task List and Add Task section */}
        <section>
          <div className="row mb-2 mx-0">
            <div className="col-12 col-md-6">
              <div className="d-flex gap-2">
                <h5 className="text-center">Tasks List</h5>
                <span className="mb-2 text-white px-2 rounded-1 bg-success cursor-pointer" onClick={() => setShowNewTaskModal(true)}>
                  <i className="fas fa-plus-circle"></i> New Task
                </span>
              </div>

            </div>
            <div className="col-12 col-md-6">

              <div className="text-end">
                <select
                  id="statusFilter"
                  className="form-select w-auto d-inline"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All</option>
                  <option value="Pending">Pending</option>
                  <option value="In-Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

          </div>

          <div id="taskList" className="row g-2">
            {currentTasks.length === 0 ? (
              <div className="text-center">No tasks found.</div>
            ) : (
              currentTasks.map((task, index) => (
                <div className="col-md-4 task-card" data-status={task.status} key={index}>
                  <div className="future-card p-2 p-md-3">
                    <h6 className="card-title">{toTitleCase(task.taskTitle)}</h6>
                    <p>{task.description}</p>
                    <span className={`badge text-xsm bg-${getStatusColor(task.status)}`}>
                      {task.status.replace("-", " ")}
                    </span>
                    <div className="float-end">
                      <i
                        className="bi bi-pencil-square text-primary me-2"
                        title="Edit"
                        onClick={() => handleEditClick(task)}
                        style={{ cursor: "pointer" }}
                      ></i>
                      <i
                        className="bi bi-trash text-danger"
                        title="Delete"
                        onClick={() => handleDeleteTask(task._id)}
                        style={{ cursor: "pointer" }}
                      ></i>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
{/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-3 d-flex justify-content-center">
              <nav>
                <ul className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                    >
                      <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </section>
      </div>
{/* new task added modal */}
      {showNewTaskModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header py-1">
                <h5 className="modal-title text-success">New Task</h5>
                <button type="button" className="btn-close" onClick={() => setShowNewTaskModal(false)}></button>
              </div>
              <div className="modal-body py-1">
                <div className="mb-2">
                  <label className="form-label mb-0">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="taskTitle"
                    value={newTask.taskTitle}
                    onChange={(e) => setNewTask({ ...newTask, taskTitle: e.target.value })}
                  />
                  {errors.taskTitle && <div className="text-danger mt-1">{errors.taskTitle}</div>}
                </div>
                <div className="mb-2">
                  <label className="form-label mb-0">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  ></textarea>
                   {errors.description && <div className="text-danger mt-1">{errors.description}</div>}
                </div>
                <div className="mb-2">
                  <label className="form-label mb-0">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In-Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger py-1" onClick={() => setShowNewTaskModal(false)}>Cancel</button>
                <button className="btn btn-success py-1" onClick={handleAddTask}>Add Task</button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Edit Modal */}
      {showModal && editTask && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header py-1">
                <h5 className="modal-title text-primary">Edit Task</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body py-1">
                <div className="mb-2">
                  <label className="form-label mb-0">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="taskTitle"
                    value={editTask.taskTitle}
                    onChange={handleInputChange}
                  />
                   {errors.taskTitle && <div className="text-danger mt-1">{errors.taskTitle}</div>}
                </div>
                <div className="mb-2">
                  <label className="form-label mb-0">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={editTask.description}
                    onChange={handleInputChange}
                  ></textarea>
                   {errors.description && <div className="text-danger mt-1">{errors.description}</div>}
                </div>
                <div className="mb-2">
                  <label className="form-label mb-0">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={editTask.status}
                    onChange={handleInputChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In-Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger py-1" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary py-1" onClick={handleUpdateTask}>Update Task</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
