import cls from "classnames";
import PDFViewer from "./components/pdf-viewer";
import MdViewer from "./components/md-viewer";
import Sortable from "./components/sortable-viewer";
import "./App.css";

function App() {
  return  (
    <div className={cls("h-full w-full flex")}>
      <div className={cls("flex-1")}>
        <PDFViewer/>
      </div>
      <div className={cls("flex-1 overflow-auto")}>
        {/* <MdViewer curPage={1} taskInfo={{
          markdownUrl: ["/sample/test.md"],
        }}/> */}
        <Sortable/>
      </div>
    </div>
  );
}

export default App;
