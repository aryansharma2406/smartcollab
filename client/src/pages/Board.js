import React, { useEffect, useState } from "react";
import API from "../api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Board = ({ projectId }) => {
  const [tasks, setTasks] = useState({
    todo: [],
    "in-progress": [],
    done: [],
  });

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newTask, setNewTask] = useState("");

  // Fetch tasks
  useEffect(() => {
    API.get(`/tasks/grouped/${projectId}`)
      .then((res) => setTasks(res.data))
      .catch((err) => console.log(err));
  }, [projectId]);
  useEffect(() => {
  API.get(`/messages/${projectId}`)
    .then((res) => setMessages(res.data))
    .catch((err) => console.log(err));
}, [projectId]);
  const handleSendMessage = async () => {
  if (!newMessage) return;

  try {
    const res = await API.post("/messages", {
      text: newMessage,
      project: projectId,
      sender: localStorage.getItem("username") || "Anonymous",
    });

    setMessages((prev) => [...prev, res.data]);
    setNewMessage("");
  } catch (err) {
    console.log(err);
  }
};

  // Drag & Drop
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const source = result.source.droppableId;
    const destination = result.destination.droppableId;

    if (source === destination) return;

    const task = tasks[source][result.source.index];

    // Update backend
    await API.put(`/tasks/${task._id}`, {
      status: destination,
    });

    // Update UI
    setTasks((prev) => {
      const newState = { ...prev };

      newState[source] = [...newState[source]];
      newState[destination] = [...newState[destination]];

      newState[source].splice(result.source.index, 1);
      newState[destination].push({ ...task, status: destination });

      return newState;
    });
  };

  // Add Task
  const handleAddTask = async () => {
    if (!newTask) return;

    const res = await API.post("/tasks", {
      title: newTask,
      description: "",
      project: projectId,
    });

    setTasks((prev) => ({
      ...prev,
      todo: [...prev.todo, res.data],
    }));

    setNewTask("");
  };

  // Delete Task
  const handleDelete = async (taskId, status) => {
    await API.delete(`/tasks/${taskId}`);

    setTasks((prev) => ({
      ...prev,
      [status]: prev[status].filter((t) => t._id !== taskId),
    }));
  };

  // Edit Task
  const handleEdit = async (task, status) => {
    const updated = prompt("Edit task", task.title);
    if (!updated) return;

    const res = await API.put(`/tasks/${task._id}`, {
      title: updated,
    });

    setTasks((prev) => ({
      ...prev,
      [status]: prev[status].map((t) =>
        t._id === task._id ? res.data : t
      ),
    }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
        {Object.keys(tasks).map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ flex: 1 }}
              >
                <h3>{status.toUpperCase()}</h3>

                {/* Add Task UI (only in TODO) */}
                {status === "todo" && (
                  <div style={{ marginBottom: "10px" }}>
                    <input
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder="Add new task..."
                    />
                    <button onClick={handleAddTask}>Add</button>
                    <div style={{ marginTop: "30px" }}>
  <h3>💬 Team Chat</h3>

  {/* Messages */}
  <div
    style={{
      maxHeight: "200px",
      overflowY: "auto",
      border: "1px solid #ccc",
      padding: "10px",
      marginBottom: "10px",
      background: "#f5f5f5",
    }}
  >
    {messages.map((msg) => (
      <div key={msg._id} style={{ marginBottom: "8px" }}>
        <strong>{msg.sender}:</strong> {msg.text}
      </div>
    ))}
  </div>

  {/* Input */}
  <div style={{ display: "flex", gap: "10px" }}>
    <input
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      placeholder="Type message..."
      style={{ flex: 1 }}
    />
    <button onClick={handleSendMessage}>Send</button>
  </div>
</div>
                  </div>
                  
                )}

                {tasks[status].map((task, index) => (
                  <Draggable
                    draggableId={task._id}
                    index={index}
                    key={task._id}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          background: "#eee",
                          padding: "10px",
                          marginBottom: "10px",
                          borderRadius: "5px",
                          ...provided.draggableProps.style,
                        }}
                        onDoubleClick={() => handleEdit(task, status)}
                      >
                        <strong>{task.title}</strong>
                        <p>{task.description}</p>

                        <button
                          onClick={() =>
                            handleDelete(task._id, status)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;