import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import cls from "classnames";

function DraggableItem({ item, index, moveItem, option }) {
  const [editable, setEditable] = useState(false);
  const [visible, setVisible] = useState(false);

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
      className={cls("border p-2 rounded mb-2 relative", {
        "bg-purple-200": option?.text_level === 1,
        "bg-white": option?.text_level !== 1,
      })}
      contentEditable={editable}
      onMouseOver={() => setVisible(true)}
      onMouseOut={() => {
        setVisible(false);
      }}
    >
      {item}
      <span
        className={cls(
          "absolute right-0 top-0 bg-white rounded px-1 border-blue-500 border",
          {
            ["visible"]: visible,
            ["hidden"]: !visible,
          }
        )}
        onClick={() => setEditable(!editable)}
      >
        {!editable ? "编辑" : "取消编辑"}
      </span>
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
