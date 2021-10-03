import React, { useState, useEffect } from 'react'
import './App.css';
import $ from 'jquery'

//import components
import Input from './components/Input'
import TodoList from './components/TodoList'
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  const [enteredItem, setEnteredItem] = useState("");
  const [todos, setTodos] = useState([])
  //initial GET request to load everything in
  //useEffect is similar to componentDidMount (when react component is inserted into DOM tree)
  useEffect(() => {
    $.ajax({
      url: "http://localhost:6001",
      type: "GET",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data, textStatus, jqXHR) {
        //sort by timestamp and setTodos on frontend
        data.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1)
        setTodos(data)
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("error: " + errorThrown);
      }
    });
  }, [])
  return (
    <div className="App container">
      <div className="row text-center">
        <h1>To Do List</h1>
      </div>
      {/* setEnteredItem to the Input component, pass down state */}
      <Input todos={todos} setTodos={setTodos} enteredItem={enteredItem} setEnteredItem={setEnteredItem} />
      {/* pass down setTodos and todos to TodoList so we can modify the todos from TodoList */}
      <TodoList setTodos={setTodos} todos={todos} />
    </div>
  );
}

export default App;
