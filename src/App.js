import React, { useState } from "react";
import { nanoid } from "nanoid";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";

const FILTER_MAP = {
  All: () => true,
  Active: task => !task.completed,
  Completed: task => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {

  const [filter, setFilter] = useState('All');

  const filterList = FILTER_NAMES.map(name => (
    <FilterButton 
    key={name}
    name={name}
    isPressed={name === filter}
    setFilter={setFilter}/>
  ));


  // Can't update props - they are read only (immutable).
  // Must use useState to make something changeable
  const [tasks, setTasks] = useState(props.tasks);

  

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map(task => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return {...task, completed: !task.completed}
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter(_ => _.id !== id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map(task => {
    // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return {...task, name: newName}
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  // not props.task.map as that is immutable.
  const taskList = tasks
  .filter(FILTER_MAP[filter]) /* e.g. FILTER_MAP['Active'] = !task.completed*/
  .map(task => (
    <Todo id={task.id} 
    name={task.name} 
    completed={task.completed} 
    key={task.id}
    toggleTaskCompleted={toggleTaskCompleted} 
    deleteTask={deleteTask} 
    editTask={editTask} />
  ));

  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  function addTask(name) {
    //alert(name);
    const newTask = { id: "todo-" + nanoid(), name: name, completed: false };
    // Make a new array with all the curent tasks and newTask
    setTasks([...tasks, newTask]);
  }

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">
        {headingText}
      </h2>
      <ul
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
