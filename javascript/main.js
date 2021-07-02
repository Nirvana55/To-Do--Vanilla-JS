const input__Todo = document.getElementById('create__Todo'); // calling the id name of todo
const input__Todo1 = document.getElementById('create__Todo'); // calling the id name of todo
const completedCount = document.querySelector('.completed__Count'); // calling the class complted count
const toggle__btn = document.querySelector('.toggle__button');

let darkMode = localStorage.getItem('darkMode'); // gets the variable value from the local storage and creates a variable with null value

for__Todos = []; // creating an array to store the value

let alert__task = false; // to end the loop
let alert__Count = 0; // to flow the loop

let del__local = JSON.parse(localStorage.getItem('todos'));
console.log(del__local);

getFromLocalStorage();
countCompleted();

const enableDark__Mode = () => {
	document.body.classList.add('light'); // adding light class
	toggle__btn.classList.toggle('toggle__buttonhvr');
	localStorage.setItem('darkMode', 'enabled'); // setting an varaible if the function is called
};

const disableDark__Mode = () => {
	document.body.classList.remove('light'); //removing the class
	toggle__btn.classList.toggle('toggle__buttonhvr');
	localStorage.setItem('darkMode', null); // setting null value if the function is called
};

// if the light class is enabled from first it will be enabled
darkMode === 'enabled' ? enableDark__Mode() : disableDark__Mode();

toggle__btn.addEventListener('click', () => {
	darkMode = localStorage.getItem('darkMode'); // calling it, since it will change the value whenever it is clicked
	darkMode !== 'enabled' ? enableDark__Mode() : disableDark__Mode();
});

input__Todo.addEventListener('keyup', function (e) {
	// when a user releases a key in keyboard seeting e as a parameter to pass keyboard
	let input__Value = input__Todo.value;
	let empty__Value = input__Todo.value.trim(); // trim removes space

	if (e.key === 'Enter' && input__Value != '') {
		// when user presses Enter
		//target will return the element of that called element not event listener event
		let finding__Todo = for__Todos.find(
			(value1) => value1.values === input__Value
		); // it will find the value of an array which is equal to input todo value

		if (finding__Todo) {
			alert('Input has been repeated');
			input__Todo.value = '';
			return; // it exits the command
		}

		if (input__Value === null || empty__Value.length === 0) {
			alert('Invaild input');
			input__Todo.value = '';
			return; // it exits the command
		}

		for__Todos.push({ values: e.target.value, checked: false }); // pushing the value into the for__todos array as a object

		localStorage.setItem('todos', JSON.stringify(for__Todos));
		newTodo(input__Todo.value);

		input__Todo1.value = input__Todo.value; // creating a dummy value to store the data
		input__Todo.value = ''; // makes empty the input value

		countCompleted();
	} else if (input__Value === '') {
		alert('Empty Input');
		input__Todo.value = '';
	}
});

function getFromLocalStorage() {
	if (del__local) {
		for__Todos = del__local;
		for (let i = 0; i < del__local.length; i++) {
			newTodo(del__local[i].values);
		}
	}
}

function newTodo(value) {
	const todos__Container = document.getElementById('todos'); // todo list div class
	const todo = document.createElement('div'); // creating a new div element
	const todoText = document.createElement('p'); // creating a new p element
	const todoCheck__Box = document.createElement('input'); // creating new input element as a checbox
	const todoCheckBox__lablle = document.createElement('label'); // label fot the checbox
	const todoCross = document.createElement('span'); // span for the cross sign

	let obj = for__Todos.find((t) => t.values === value); // to check whether the input value is ticked or not

	toggle__btn.style = 'color:blue';

	todoText.textContent = value; //it sets the text content of the todoText  as the value
	todoCheck__Box.type = 'checkbox'; // setting input as checkbox
	todoCheck__Box.name = 'checkbox'; // checkbox name as checkbox so that the label can work for the checkbox
	todoCheckBox__lablle.htmlFor = 'checkbox'; // html for helps to set the property into that so it can be linked with the input property

	todoCheckBox__lablle.addEventListener('click', function (e) {
		if (todoCheck__Box.checked) {
			// if the checkbox is checked
			// the data remains constant, so for the change of value todoCheck_box.checked==false;
			todoCheck__Box.checked = false; // to flow the loop
			todoText.style.textDecoration = 'none'; // no decoration will be done
			todoCheckBox__lablle.classList.remove('active'); // it will be removed from active
			obj.checked = false; // to check whether the activity is done or not
			countCompleted();
		} else {
			obj.checked = true; // to check whether the activity is done or not
			countCompleted();
			todoCheck__Box.checked = true; // to flow the loop
			todoText.style.textDecoration = 'line-through'; // the decoration will be line through
			todoCheckBox__lablle.classList.add('active'); // and will add to class active
		}
	});

	todoCross.textContent = 'X'; // sets todo Cross as X
	todoCross.addEventListener('click', function (e) {
		e.target.parentElement.remove(); // it will remove its parent element
		// this filter makes the clicked value as false and removes the false value which ever is clicked
		for__Todos = for__Todos.filter((t) => t !== obj); // created a new array so that it will update the array and show the new array
		del__local = for__Todos;
		localStorage.setItem('todos', JSON.stringify(del__local));
		countCompleted(); // calling function whenever the items get remove from the array
	});

	todo.classList.add('todo'); // adding new class for div element
	todoCheckBox__lablle.classList.add('circle'); // adding new class circe
	todoCross.classList.add('cross'); // adding new class cross

	todo.appendChild(todoCheck__Box); // appending in serial order to the todo div class
	todo.appendChild(todoCheckBox__lablle); // appending inside input
	todo.appendChild(todoText); // appending inside text
	todo.appendChild(todoCross); // appending the cross

	todos__Container.appendChild(todo); // appending child todo in todoContainer so that it creates all div when calling a function

	//----------------------To drag elements------------------------------------/
	todo.draggable = true; // making it true so that it can be moved

	todo.addEventListener('dragstart', () => {
		todo.classList.add('drag__opacity'); // if the drag start it will add the class and makes the todo class with opacity effect
	});

	todo.addEventListener('dragend', () => {
		todo.classList.remove('drag__opacity'); // when the drag ends it will remove the opcaity class
	});

	todos__Container.addEventListener('dragover', (e) => {
		e.preventDefault(); // it will help remain only inside the container
		const afterElement = getDragAfterElement(todos__Container, e.clientY); // calling the function and passing container as todos__container and y axis of the mouse
		const dragging__element = document.querySelector('.drag__opacity'); //calling the drag__opacity class
		if (afterElement == null) {
			todos__Container.appendChild(dragging__element); // if the element has null value it will automatically go down
		} else {
			todos__Container.insertBefore(dragging__element, afterElement); // it will insert the element before and after
		}
	});
}

function getDragAfterElement(container, y) {
	const draggableElements = [
		...container.querySelectorAll('.todo:not(.dragging__element)'),
	]; // creating as an array so that query selector will only take as a node[]

	//closest means which the mouse is closest to and child means the child elements of the container
	return draggableElements.reduce(
		(closest, child) => {
			// reduce creates an array as one
			const box = child.getBoundingClientRect(); // it will make it as a box and gives all data as an rectangke
			const offset = y - box.top - box.height / 2; // offset is inside space... y means yclient side of mouse  and box top and box height value which will give the middle vale by dividing by two
			if (offset < 0 && offset > closest.offset) {
				// if it 0 and gratear than negative infinity offset
				return { offset: offset, element: child }; // creating object as offset value of offset and element child means of todo elements
			} else {
				return closest; // it will return the closest to the mouse
			}
		},
		{ offset: Number.NEGATIVE_INFINITY }
	).element; // defining value of offset as negative infinity
}

function countCompleted() {
	//using fiilter method to filter checked items which is equals to false in the Array
	completedCount.textContent = `${
		for__Todos.filter((t) => t.checked === false).length
	} items left`;
}

function clear__Completed() {
	let completed__Task = for__Todos.filter((t) => t.checked === true).length; // filtered array which checked === true (length)
	let notcompleted__Task = for__Todos.length - completed__Task; // full aray -- completed task
	if (completed__Task === 0) {
		alert('There is no task to remove');
		return;
	}
	let confirm__task = confirm(
		`Do you want to remove ${completed__Task} completed task ?`
	);
	document.querySelectorAll('.todo').forEach((todo) => {
		// selecting all elements of todoelememtns
		if (todo.querySelector('input').checked && alert__task === false) {
			// if the input is checked it will remove by using remove built in functio
			if (confirm__task === true) {
				// confirm == true
				todo.remove(); // to remove the HTML element
				for__Todos = for__Todos.filter((t) => t.checked === false); // to filter the array and overwrite with new array
				del__local = for__Todos;
				localStorage.setItem('todos', JSON.stringify(del__local));
				console.log(for__Todos);
				alert__Count += 1; // since the code is runnng everytime it is ticked and it keeps on increasing
				if (alert__Count === completed__Task) {
					// when the alert count === completed task
					alert(`There are still ${notcompleted__Task} task left to complete `); // it will alert
					alert__task === true; // if every if loop is ok then it will end the loop
					alert__Count = 0;
				}
			} else {
				return;
			}
		}
	});
}

function all__list() {
	document.querySelectorAll('.todo').forEach((all) => {
		// selecting all the element inisde the todo div
		all.style.display = 'grid'; // when displayed should be seen in grid
	});
}

function active__list() {
	document.querySelectorAll('.todo').forEach((active) => {
		// selecting all elements of todo
		active.style.display = 'grid'; // when displayed should be seen in grid
		if (active.querySelector('input').checked) {
			// if the element is checked it will only show elements which are not checked
			active.style.display = 'none';
		}
	});
}

function completed__list() {
	document.querySelectorAll('.todo').forEach((completed) => {
		// selecting all elements of todo
		completed.style.display = 'grid'; // when displayed should be seen in grid
		if (completed.querySelector('input').checked === false) {
			// if the element is checked is false it will only show elements which are checked
			completed.style.display = 'none'; // and display which is checked
		}
	});
}
