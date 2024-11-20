import { useEffect, useState } from "react";

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

  return (
    <div className="flex flex-col p-2">
      {layout.map((item, index) => {
        return (
          <div key={index} className="border p-2 rounded mb-2">
            {item.text}
          </div>
        );
      })}
    </div>
  );
}

export default Sortable;
