import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import cls from "classnames";

function DraggableItem({ item, index, moveItem, option }) {
  console.log({ option });

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
      className={cls("border p-2 rounded mb-2", {
        "bg-purple-200": option?.text_level === 1,
        "bg-white": option?.text_level !== 1,
      })}
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
            option={item}
            index={index}
            moveItem={moveItem}
          />
        );
      })}
    </div>
  );
}

export default Sortable;
