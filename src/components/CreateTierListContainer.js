import { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import TierRow from "./TierRow";
import TierHeading from "./TierHeading";
import TestItem from "../components/TestItem";
import initialData from "../initialData";
import CreateTierItemContainer from "./CreateTierItemContainer";
import styled from "styled-components";

const TierRowContainer = styled.div`
  background-color: #1a1a1a;
  min-width: 100px;
  margin: 10px 0;
  display: grid;
  grid-template-columns: 60px 1fr;
  align-items: center;
`;

const FullScreenButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background-color: #ffffff;
  display: grid;
  place-items: center;
  border-radius: 2px;
  outline: none;
`;

const TierListContainer = styled.div`
  overflow: auto;
  background-color: #000000;
  min-width: 100%;
  min-height: 500px;
  position: relative;
`;

function CreateTierListContainer(props) {
  const { appState, setAppState } = props;

  const handleFullScreen = (e) => {
    const parentContainer = e.target.parentNode;
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement
    ) {
      closeFullscreen();
    } else {
      makeFullScreen(parentContainer);
    }
  };

  function makeFullScreen(elem) {
    console.log("Clicked");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen();
    }
  }

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

    const start = appState.newDraft.rows[source.droppableId];
    const finish = appState.newDraft.rows[destination.droppableId];
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
        newDraft: {
          ...appState.newDraft,
          rows: {
            ...appState.newDraft.rows,
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
        newDraft: {
          ...appState.newDraft,
          rows: {
            ...appState.newDraft.rows,
            [newRow.id]: newRow,
          },
        },
      };
      setAppState(newState);
      return;
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <TierListContainer id="create-tier-list-container">
          {appState.newDraft.rowOrder?.map((row) => {
            return (
              <TierRow
                key={appState.newDraft.rows[row].title}
                row={row}
                letter={appState.newDraft.rows[row].title}
                color={appState.newDraft.rows[row].color}
                items={appState.newDraft.rows[row].itemIds}
                itemMap={appState.newDraft.items}
              />
            );
          })}
          <FullScreenButton onClick={handleFullScreen}>[ ]</FullScreenButton>
        </TierListContainer>
        <TierRow
          key={"row-tray"}
          row={"row-tray"}
          items={appState.newDraft.rows["row-tray"].itemIds}
          itemMap={appState.newDraft.items}
        />
      </DragDropContext>
    </>
  );
}

export default CreateTierListContainer;
