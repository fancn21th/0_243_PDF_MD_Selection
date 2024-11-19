import cls from "classnames";
import PDFViewer from "./components/pdf-viewer";
import MdViewer from "./components/md-viewer";
import "./App.css";

function App() {
  return  (
    <div className={cls("main")}>
      <div className={cls("left")}>
        <PDFViewer/>
      </div>
      <div className={cls("right")}>
        <MdViewer curPage={1} taskInfo={{
          markdownUrl: ["/sample/test.md"],
        }}/>
      </div>
    </div>
  );
}

export default App;
