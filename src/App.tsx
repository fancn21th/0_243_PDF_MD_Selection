import cls from "classnames";
import PDFViewer from "./components/pdf-viewer";
import MdViewer from "./components/md-viewer";
import Sortable from "./components/sortable-viewer";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={cls("h-full w-full flex")}>
        <div className={cls("flex-1")}>
          <PDFViewer />
        </div>
        <div className={cls("flex-1 overflow-auto")}>
          {/* <MdViewer curPage={1} taskInfo={{
          markdownUrl: ["/sample/test.md"],
        }}/> */}
          <Sortable />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
