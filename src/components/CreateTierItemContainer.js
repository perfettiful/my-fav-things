import { useState } from "react";

function CreateTierItemContainer({ appState, setAppState }) {
  const [formData, setFormData] = useState({
    imageUrl: "",
    desc: "",
  });

  const addItem = () => {
    setAppState((prevState) => ({
      ...prevState,
      itemCount: prevState.itemCount + 1,
    }));
    let itemName = "item-" + appState.itemCount;
    const { imageUrl, desc } = formData;
    let newDesc;
    if (!desc) {
      newDesc = "Test-" + appState.itemCount;
    } else {
      newDesc = desc;
    }
    console.log("formData=", formData);
    let itemObject = {
      [itemName]: {
        id: itemName,
        content: "Test-" + appState.itemCount,
        imageUrl,
        altText: newDesc,
      },
    };

    let newItemsIdArray = Array.from(appState.rows["row-1"].itemIds);
    newItemsIdArray.push(itemName);
    let newRow = { ...appState.rows["row-1"], itemIds: newItemsIdArray };
    const newState = {
      ...appState,
      itemCount: appState.itemCount + 1,
      items: { ...appState.items, ...itemObject },
      rows: {
        ...appState.rows,
        [newRow.id]: newRow,
      },
    };

    setAppState(newState);
    setFormData({
      imageUrl: "",
      desc: "",
    });
  };

  const onChange = (e) => {
    console.log("target id= ", e.target.id);
    console.log("target value", e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addItem();
  };

  return (
    <div className="create-tier-item-container">
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div className="form-control">
          <label htmlFor="imageUrl">Enter an Image Url</label>
          <input
            id="imageUrl"
            aria-describedby="imageUrl-helper-text"
            value={formData.imageUrl}
            onChange={onChange}
          />
        </div>
        <div className="form-control">
          <label htmlFor="desc">Enter an Image Description (Optional)</label>
          <input
            id="desc"
            value={formData.desc}
            aria-describedby="desc-helper-text"
            onChange={onChange}
          />
        </div>
        <div className="form-control">
          <button onClick={addItem}>Add Item Test</button>
        </div>
      </form>
    </div>
  );
}

export default CreateTierItemContainer;
