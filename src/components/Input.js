import React, { useState } from 'react'
import 'react-bootstrap'
import $ from 'jquery'

//the {setEnteredText} gives you access to setEnteredText prop
const Input = ({ todos, setTodos, enteredItem, setEnteredItem }) => {

	const enteredItemHandler = (e) => {
		//whenever I enter an item into the textbox, update the enteredItem value
		let enteredValue = e.target.value;
		setEnteredItem(enteredValue);
	}

	const submitItemHandler = () => {
		$.ajax({
      url: "http://localhost:6001/add_item",
			type: "POST",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify({ "item": enteredItem }),
			dataType: "json",
      success: function (data, textStatus, jqXHR) {
				//update todos list with the one extra item we added
				setTodos([
					...todos, {value: data.value, id: data.id}
				])
				setEnteredItem('')
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("error: " + errorThrown);
      }
    });
	}
	// frontend for the input allowing us to add another todo
	return (
		<div>
			<div className="row text-center">
				<div className="col-6">
					Item to add:
				</div>
				<div className="col-6">
					{/* on change of text, fire the enteredItemHandler function */}
					<input value = {enteredItem} onChange={enteredItemHandler} id="todo-input" type="text"></input>
				</div>
			</div><div className="row text-center">
				<div className="col-12">
					<button onClick={submitItemHandler} id="add-item-button" type="button" className="btn btn-primary">Add to list</button>
				</div>
			</div>
		</div>
	);
}

export default Input;