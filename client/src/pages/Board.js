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

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [project, setProject] = useState(null);

  const username = localStorage.getItem("username");

  useEffect(() => {
    API.get(`/tasks/grouped/${projectId}`)
      .then((res) => setTasks(res.data))
      .catch(console.log);
  }, [projectId]);

  useEffect(() => {
    API.get(`/messages/${projectId}`)
      .then((res) => setMessages(res.data))
      .catch(console.log);
  }, [projectId]);

  useEffect(() => {
    API.get(`/projects`)
      .then((res) => {
        const found = res.data.find((p) => p._id === projectId);
        setProject(found);
      })
      .catch(console.log);
  }, [projectId]);

  const handleAddMember = async () => {
    if (!email) return;

    try {
      const res = await API.post(`/projects/${projectId}/add-member`, {
        email,
        role,
      });

      setProject(res.data);
      setEmail("");
      setRole("");
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage) return;

    const res = await API.post("/messages", {
      text: newMessage,
      project: projectId,
      sender: username,
    });

    setMessages((prev) => [...prev, res.data]);
    setNewMessage("");
  };

  const handleAddTask = async () => {
    if (!newTask) return;

    const res = await API.post("/tasks", {
      title: newTask,
      project: projectId,
    });

    setTasks((prev) => ({
      ...prev,
      todo: [...prev.todo, res.data],
    }));

    setNewTask("");
  };

  const handleDelete = async (taskId, status) => {
    await API.delete(`/tasks/${taskId}`);

    setTasks((prev) => ({
      ...prev,
      [status]: prev[status].filter((t) => t._id !== taskId),
    }));
  };

  const onDragEnd = async (result) => {
  if (!result.destination) return;

  const source = result.source.droppableId;
  const dest = result.destination.droppableId;

  const sourceItems = Array.from(tasks[source]);
  const destItems = Array.from(tasks[dest]);

  const [movedTask] = sourceItems.splice(result.source.index, 1);

  // prevent duplicate if same column
  if (source === dest) {
    sourceItems.splice(result.destination.index, 0, movedTask);

    setTasks((prev) => ({
      ...prev,
      [source]: sourceItems,
    }));
  } else {
    destItems.splice(result.destination.index, 0, {
      ...movedTask,
      status: dest,
    });

    setTasks((prev) => ({
      ...prev,
      [source]: sourceItems,
      [dest]: destItems,
    }));
  }

  // backend update
  try {
    await API.put(`/tasks/${movedTask._id}`, {
      status: dest,
    });
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      {/* 👥 MEMBERS */}
      <div style={styles.card}>
        <h3>👥 Members</h3>

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <button onClick={handleAddMember}>Add</button>
        </div>

        {project?.members?.map((m, i) => (
          <div key={i} style={styles.member}>
            {m.user?.email}
            <span style={styles.role}>{m.role}</span>
          </div>
        ))}
      </div>

      {/* 💬 CHAT */}
      <div style={styles.card}>
        <h3>💬 Team Chat</h3>

        <div style={styles.chatBox}>
          {messages.map((msg) => (
            <div
              key={msg._id}
              style={{
                ...styles.msg,
                alignSelf:
                  msg.sender === username ? "flex-end" : "flex-start",
                background:
                  msg.sender === username ? "#3b82f6" : "#1e293b",
              }}
            >
              <b>{msg.sender}</b>
              <div>{msg.text}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>

      {/* 📋 KANBAN */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={styles.board}>
          {Object.keys(tasks).map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} style={styles.column}>
                  <h3>{status.toUpperCase()}</h3>

                  {status === "todo" && (
                    <div style={{ marginBottom: "10px" }}>
                      <input
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="New task..."
                      />
                      <button onClick={handleAddTask}>Add</button>
                    </div>
                  )}

                  {tasks[status].map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ ...styles.task, ...provided.draggableProps.style }}
                        >
                          <b>{task.title}</b>

                          <button
                            style={{ marginTop: "5px" }}
                            onClick={() => handleDelete(task._id, status)}
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
    </div>
  );
};

export default Board;

/* 🎨 STYLES */
const styles = {
  card: {
    background: "rgba(255,255,255,0.05)",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  member: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 0",
  },

  role: {
    background: "#2563eb",
    padding: "2px 8px",
    borderRadius: "6px",
    fontSize: "12px",
  },

  chatBox: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "200px",
    overflowY: "auto",
    marginBottom: "10px",
  },

  msg: {
    padding: "10px",
    borderRadius: "10px",
    margin: "5px",
    maxWidth: "60%",
    color: "#fff",
  },

  board: {
    display: "flex",
    gap: "20px",
  },

  column: {
    flex: 1,
    background: "#1e293b",
    padding: "10px",
    borderRadius: "10px",
  },

  task: {
    background: "#334155",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
  },
};