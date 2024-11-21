import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

function DraggableItem({ item, index, moveItem }) {
  const [, ref] = useDrag({
    type: "ITEM",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "ITEM",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      style={{ padding: "10px", border: "1px solid black", margin: "5px" }}
    >
      {item}
    </div>
  );
}

function Sortable() {
  const [layout, setLayout] = useState([]);

  async function getLayout() {
    const layout = await fetch("/sample/test_content_list.json");
    return layout.json();
  }

  useEffect(() => {
    getLayout().then((layout) => {
      setLayout(layout);
    });
  }, []);

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...layout];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setLayout(updatedItems);
  };

  return (
    <div className="flex flex-col p-2">
      {layout.map((item, index) => {
        return (
          <DraggableItem
            key={index}
            item={item.text}
            index={index}
            moveItem={moveItem}
          />
        );
      })}
    </div>
  );
}

export default Sortable;
