import { useRef } from "react";

function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return <iframe ref={iframeRef} src={`/helloworld.html`}></iframe>;
}

export default App;
