import "./App.css";
import CreateTierListContainer from "./components/CreateTierListContainer";
import { useEffect, useState } from "react";
import initialData from "./initialData";
import initialNewTopicData from "./initialNewTopicData";
import TierRowTray from "./components/TierRowTray";

function App() {
  const [appState, setAppState] = useState(initialData);
  const [genres, setGenres] = useState({});
  const [itemCount, setItemCount] = useState(0);
  const [itemInput, setItemName] = useState("");

  const addItem = () => {
    const itemName = itemInput;
    const newItem = {
      [itemName]: {
        id: itemName,
        altText: itemName,
        desc: itemName,
      },
    };
    const oldItemTrayRow = appState.newDraft.rows["row-tray"].itemIds;
    const newItems = { ...appState.newDraft.items, ...newItem };
    setAppState((prevState) => ({
      ...prevState,
      newDraft: {
        ...prevState.newDraft,
        items: newItems,
        rows: {
          ...prevState.newDraft.rows,
          "row-tray": {
            ...prevState.newDraft.rows["row-tray"],
            itemIds: [...oldItemTrayRow, itemName],
          },
        },
      },
    }));
    setItemCount(itemCount + 1);
    setItemName("");

  };

  return (
    <div className="container">
      <h1>👑 Nathan's Favs Tier List 👑</h1>
      <br></br>
      <input className="form-control "
      type="text"
      placeholder="Add An Item"
      value={itemInput}
      onChange={(e)=> {setItemName(e.target.value)}}
      ></input>

      <button className="btn btn-lg btn-success m-2" onClick={addItem}>Add</button>
      <br></br>
      
      <CreateTierListContainer
        appState={appState}
        setAppState={setAppState}
      ></CreateTierListContainer>
    </div>
  );
}

export default App;
