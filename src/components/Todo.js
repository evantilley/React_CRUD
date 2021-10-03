import React, { useState, useRef } from 'react';
import 'react-bootstrap';
import $ from 'jquery'

const Todo = ({todos, setTodos, todo, count}) => {
	const ref = useRef(null)

	const [isUpdating, setisUpdating] = useState(false)
	const [updatedItem, setUpdatedItem] = useState("")
	const deleteItemHandler = () => {
		$.ajax({
      url: "http://localhost:6001/delete_item",
			type: "POST",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify({ "id": todo.id }),
			dataType: "json",
      success: function (data, textStatus, jqXHR) {
				// go through all the todos and remove the element with the matching id
				setTodos(todos.filter(element => element.id !== todo.id))
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("error: " + errorThrown);
      }
    });
	}

	// when you edit an item, updated the 'updatedItem' state value
	const editItemHandler = (e) => {
		let enteredItem = e.target.textContent;
		setUpdatedItem(enteredItem);
	}

	const updateItemHandler = (e) => {
		if (isUpdating == false){
			setisUpdating(true);
			//you need the settimeout here to prevent a focus bug, see https://stackoverflow.com/questions/2388164/set-focus-on-div-contenteditable-element/37162116#37162116
			setTimeout(function() {
				ref.current.focus();
		}, 0);
		} else {
			$.ajax({
				url: "http://localhost:6001/update_item",
				type: "POST",
				contentType: "application/json; charset=utf-8",
				data: JSON.stringify({ "id": todo.id, "new_value": updatedItem }),
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					setisUpdating(false);
					// loop through todos and update proper todo item on the frontend
					setTodos(todos.map(item => {
						if (item.id == todo.id){
							return {
								...item, value: data.new_value
							} 
						}
						return item;
					}))		
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log("error: " + errorThrown);
				}
			});
		}
	}

	//front end code composing each Todo item
	return(
		<div className="row text-center" id={todo.id}>
			<div className="col-3 bold text-right">{count}</div>
			<div ref={ref} suppressContentEditableWarning={true} onInput={editItemHandler} contentEditable = {isUpdating} className="col-5 text-right data">{todo.value}</div>
			<div onClick={updateItemHandler} className={`col-2 text-left fa ${isUpdating ? "fa-check" : "fa-pencil"}`}></div>
			<div onClick={deleteItemHandler} className="col-2 text-left close fa fa-window-close"></div>
			</div>
	)
}

export default Todo;