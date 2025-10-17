import React, { useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "React Essentials",
      modules: [
        { id: 1, name: "Intro to React", done: false },
        { id: 2, name: "Components & Props", done: false },
        { id: 3, name: "State Management", done: false },
        { id: 4, name: "React Hooks", done: false },
      ],
    },
    {
      id: 2,
      title: "Node & Express Basics",
      modules: [
        { id: 1, name: "Server Setup", done: false },
        { id: 2, name: "Routing & Middleware", done: false },
        { id: 3, name: "APIs with Express", done: false },
        { id: 4, name: "Database Connection", done: false },
      ],
    },
    {
      id: 3,
      title: "Database Fundamentals",
      modules: [
        { id: 1, name: "SQL Overview", done: false },
        { id: 2, name: "Joins & Queries", done: false },
        { id: 3, name: "Indexes & Optimization", done: false },
      ],
    },
  ]);

  const [filter, setFilter] = useState("all");

  // Calculate progress
  const getProgress = (course) => {
    const total = course.modules.length;
    const done = course.modules.filter((m) => m.done).length;
    return Math.round((done / total) * 100);
  };

  // Toggle single module
  const toggleModule = (courseId, moduleId) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              modules: c.modules.map((m) =>
                m.id === moduleId ? { ...m, done: !m.done } : m
              ),
            }
          : c
      )
    );
  };

  // Mark all completed
  const markAllDone = (courseId) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, modules: c.modules.map((m) => ({ ...m, done: true })) }
          : c
      )
    );
  };

  // Reset all progress
  const resetCourse = (courseId) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, modules: c.modules.map((m) => ({ ...m, done: false })) }
          : c
      )
    );
  };

  // Filter by completion status
  const visibleCourses = courses.filter((c) => {
    const progress = getProgress(c);
    if (filter === "completed") return progress === 100;
    if (filter === "incomplete") return progress < 100;
    return true;
  });

  return (
    <div className="dashboard">
      <h1>🎓 Course & Module Dashboard</h1>

      <div className="filter-bar">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          All
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "active" : ""}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("incomplete")}
          className={filter === "incomplete" ? "active" : ""}
        >
          Incomplete
        </button>
      </div>

      <div className="course-grid">
        {visibleCourses.map((course) => (
          <div className="course-card" key={course.id}>
            <h2>{course.title}</h2>

            <div className="progress">
              <div
                className="progress-fill"
                style={{ width: `${getProgress(course)}%` }}
              ></div>
            </div>
            <p className="progress-text">{getProgress(course)}% completed</p>

            <ul className="modules">
              {course.modules.map((mod) => (
                <li
                  key={mod.id}
                  onClick={() => toggleModule(course.id, mod.id)}
                  className={mod.done ? "done" : ""}
                >
                  {mod.done ? "✅" : "⬜"} {mod.name}
                </li>
              ))}
            </ul>

            <div className="actions">
              <button onClick={() => markAllDone(course.id)}>Mark All</button>
              <button onClick={() => resetCourse(course.id)} className="reset">
                Reset
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
