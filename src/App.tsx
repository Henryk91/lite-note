import "./App.css";
import Folder from "./components/Folder";
import Provider from "./store/provider";

const checkLogin = () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    const url = new URL(window.location.href);
    const userId = url.searchParams.get("userId");
    if (userId) {
      localStorage.setItem("userId", userId);
      url.searchParams.delete("userId");
      window.history.replaceState({}, "", url);
    } else {
      window.location.assign(`https://henryk.co.za/login.html?redirect=${window.location.href}`);
    }
  }
};
function App() {
  checkLogin();

  return (
    <div className="App">
      <Provider>
        <Folder />
      </Provider>
    </div>
  );
}

export default App;
