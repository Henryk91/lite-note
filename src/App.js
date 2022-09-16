import './App.css';
import Folder from "./components/Folder";
import Item from "./components/Item";
import Provider from "./store/provider";

function App() {
  return (
    <div className="App">
      <Provider>  
          <Folder />
          <Item />
      </Provider>
    </div>
  );
}

export default App;
