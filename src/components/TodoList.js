import React from 'react';
import Todo from './Todo'
import 'react-bootstrap'


//get todos and setTodos from parent
const TodoList = ({todos, setTodos}) => {
	return (
		<div id="todo-overall" className="text-center">
			{/* map through entire todos array */}
			{todos.map((todo, index) => (
				//pass down todos and setTodos to the Todo item so we can update todos list from an individual todo item
				<Todo setTodos = {setTodos} todos = {todos} key={todo.id} todo = {todo} count = {index + 1}/>
			))}
		</div>
	)
}

export default TodoList;