import React, { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import "./App.css";

type List = {
  id: string;
  name: string;
};

const listItems = [
  {
    id: "1",
    name: "Study Spanish",
  },
  {
    id: "2",
    name: "Workout",
  },
  {
    id: "3",
    name: "Film Youtube",
  },
  {
    id: "4",
    name: "Grocery Shop",
  },
];

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  padding: 10,
  margin: `0 50px 15px 50px`,
  background: isDragging ? "#4a2975" : "white",
  color: isDragging ? "white" : "black",
  border: `1px solid black`,
  fontSize: `20px`,
  borderRadius: `5px`,

  ...draggableStyle,
});

function App() {
  const [todo, setTodo] = useState<List[]>(() => {
    const getSerializedList = localStorage.getItem("ordened_list");

    if (!getSerializedList) return listItems;

    return JSON.parse(getSerializedList);
  });

  const [editable, setEditable] = useState(false);

  const label = editable ? "Salvar" : "Editar";
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const items = Array.from(todo);
    const [newOrder] = items.splice(source.index, 1);
    items.splice(destination.index, 0, newOrder);

    setTodo(items);
  };

  const saveOrdenedList = () => {
    if (!editable) {
      setEditable(true);
    } else {
      const serializedList = JSON.stringify(todo);
      localStorage.setItem("ordened_list", serializedList);
      setEditable(false);
    }
  };

  const discardChanges = () => {
    const getSerializedList = localStorage.getItem("ordened_list");
    if (!getSerializedList) return;
    const ordenedList = JSON.parse(getSerializedList);
    setTodo(ordenedList);
    setEditable(false);
  };

  return (
    <div className="App">
      <div>
        <h1>Drag and Drop</h1>
        <button type="button" onClick={saveOrdenedList}>
          {label}
        </button>
        {editable && (
          <button type="button" onClick={discardChanges}>
            descartar alterações
          </button>
        )}
      </div>
      {editable ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="todo">
            {(provided) => (
              <div
                className="todo"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {todo.map(({ id, name }, index) => {
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          {name} {editable && " | E"}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <>
          {todo.map(({ id, name }, index) => {
            return (
              <div
                key={id}
                style={{
                  flex: 1,
                  border: "1px solid black",
                  padding: "1rem",
                  marginTop: "1rem",
                }}
              >
                {name}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default App;
