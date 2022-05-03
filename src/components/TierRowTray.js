import { useState, useEffect } from "react";
import initialNewTopicData from "../initialNewTopicData";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import TestTopicItem from "./TestTopicItem";
import styled from "styled-components";

const ItemsContainer = styled.div`
  background-color: ${(props) => (props.isDraggingOver ? "blue" : "#1a1a1a")};
  display: inline-flex;
  flex-wrap: wrap;
  min-height: 60px;
`;

const TierRowContainer = styled.div`
  background-color: #1a1a1a;
  min-width: 100px;
  margin: 10px 0;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
`;

function TierRowTray(props) {
  const { formData, setFormData, appState, setAppState } = props;

  useEffect(() => {
    // const fakeFormItems = buildInitialItemDataLikeForm();
    // const builtItems = buildItems(fakeFormItems);
    // console.log("builtItems :", builtItems);
    // console.log(
    //   'appState.rows["row-1"].items :',
    //   appState.rows["row-1"].itemIds
    // );
  }, []);

  useEffect(() => {
    if (formData.formItems.length !== 0) {
      const buildItemsFromForm = buildItems(formData.formItems);
      console.log("buildItemsFromForm :", buildItemsFromForm);
    }
  }, [formData.formItems]);

  const buildItems = (formItems) => {
    console.log("formItems :", formItems);

    let itemObjects = appState.topicDraft.items;
    let newItemObjects = {};
    let newItemIdArray = [];
    let newItemCount = appState.topicDraft.itemCount;
    if (formItems) {
      formItems.forEach((formItem, index) => {
        let itemName = "item-" + parseInt(index + newItemCount);
        newItemIdArray.push(itemName);
        let itemObject = {
          [itemName]: {
            id: itemName,
            imageUrl: formItem.imageUrl,
            altText: formItem.desc,
            content: "test-" + index,
          },
        };
        newItemObjects = { ...newItemObjects, ...itemObject };
        newItemCount++;
      });
      let firstRow = appState.topicDraft.rows["row-1"];
      let newRows = appState.topicDraft.rows;
      newRows[firstRow.id] = {
        ...firstRow,
        itemIds: [...firstRow.itemIds, ...newItemIdArray],
      };
      setAppState((prevState) => ({
        ...prevState,
        topicDraft: {
          ...prevState.topicDraft,
          itemCount: newItemCount,
          rows: newRows,
          items: { ...prevState.topicDraft.items, ...newItemObjects },
        },
      }));

      console.log("itemObjects :", itemObjects);
      return itemObjects;
    }
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = appState.topicDraft.rows[source.droppableId];
    const finish = appState.topicDraft.rows[destination.droppableId];
    if (start !== finish) {
      const newItemSourceIds = Array.from(start.itemIds);
      newItemSourceIds.splice(source.index, 1);
      const newItemDestinationIds = Array.from(finish.itemIds);
      newItemDestinationIds.splice(destination.index, 0, draggableId);

      const newStartRow = {
        ...start,
        itemIds: newItemSourceIds,
      };

      const newFinishRow = {
        ...finish,
        itemIds: newItemDestinationIds,
      };

      const newState = {
        ...appState,
        topicDraft: {
          ...appState.topicDraft,
          rows: {
            ...appState.topicDraft.rows,
            [newStartRow.id]: newStartRow,
            [newFinishRow.id]: newFinishRow,
          },
        },
      };

      setAppState(newState);
      return;
    } else if (start === finish) {
      const newItemIds = Array.from(start.itemIds);
      newItemIds.splice(source.index, 1);
      newItemIds.splice(destination.index, 0, draggableId);

      const newRow = {
        ...start,
        itemIds: newItemIds,
      };

      const newState = {
        ...appState,
        topicDraft: {
          ...appState.topicDraft,
          rows: {
            ...appState.topicDraft.rows,
            [newRow.id]: newRow,
          },
        },
      };
      setAppState(newState);

      return;
    }
  };

  return (
    <TierRowContainer>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={"row-1"} direction="horizontal">
          {(provided, snapshot) => (
            <ItemsContainer
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
              {...provided.droppableProps}
            >
              {appState.topicDraft?.rows["row-1"].itemIds?.map(
                (item, index) => {
                  return (
                    <TestTopicItem
                      item={item}
                      itemMap={appState.topicDraft.items}
                      setAppState={setAppState}
                      appState={appState}
                      index={index}
                      key={index}
                    />
                  );
                }
              )}

              {provided.placeholder}
            </ItemsContainer>
          )}
        </Droppable>
      </DragDropContext>
    </TierRowContainer>
  );
}

export default TierRowTray;
