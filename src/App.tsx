import './App.css';
import Folder from "./components/Folder";
import Provider from "./store/provider";

function App() {
  return (
    <div className="App">
      <Provider>  
          <Folder />
      </Provider>
    </div>
  );
}

export default App;
