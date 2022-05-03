import { Draggable } from "react-beautiful-dnd";
import { Button, Modal, Typography, Box, Popover } from "@mui/material";
import { useState } from "react";
import ButtonUnstyled from "@mui/base/ButtonUnstyled";

import styled from "styled-components";

const TestItemContainer = styled.div`
  background-color: #efefef;
  display: inline-block;
  overflow: hidden;

  height: 80px;
  position: relative;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function TestTopicItem(props) {
  const { item, itemMap, index, appState, setAppState } = props;
  const [open, setOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const popOverOpen = Boolean(anchorEl);
  const popOverId = open ? "simple-popover" : undefined;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopOverClose = () => {
    setAnchorEl(null);
  };

  const modalSubmit = (e, item) => {
    e.preventDefault();
    console.log("item :", item);
    const ans = document.activeElement["value"];
    if (ans === "yes") {
      console.log('ans ==="yes"');

      const newItems = {
        ...appState.topicDraft.items,
      };
      delete newItems[item];

      const newRowItemIds = appState.topicDraft.rows["row-1"].itemIds.filter(
        (itemId) => itemId !== item
      );

      setAppState((prevState) => ({
        ...prevState,
        topicDraft: {
          ...prevState.topicDraft,
          items: newItems,
          rows: {
            ...prevState.topicDraft.rows,
            "row-1": {
              ...prevState.topicDraft.rows["row-1"],
              itemIds: newRowItemIds,
            },
          },
        },
      }));
      handleClose();
    } else if (ans === "no") {
      console.log('ans ==="no"');
      handleClose();
    }
    console.log("modalSubmitted");
  };

  const changeAltTextofItem = (e, item) => {
    const newItems = {
      ...appState.topicDraft.items,
      [item]: { ...appState.topicDraft.items[item], altText: e.target.value },
    };

    setAppState((prevState) => ({
      ...prevState,
      topicDraft: {
        ...prevState.topicDraft,
        items: newItems,
      },
    }));
  };

  return (
    itemMap[item].id && (
      <Draggable
        draggableId={itemMap[item].id}
        key={itemMap[item].id}
        index={index}
      >
        {(provided, snapshot) => (
          <TestItemContainer
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            backgroundImage={itemMap[item].imageUrl}
          >
            {itemMap[item].imageUrl ? (
              <>
                <img
                  src={itemMap[item].imageUrl}
                  alt={itemMap[item].altText}
                  style={{ width: "100%" }}
                />
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      // Text in a modal
                    >
                      {" "}
                      Confirm Deletion?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Deleting Item: {itemMap[item].altText}
                      <div>
                        <TestItemContainer
                          backgroundImage={itemMap[item].imageUrl}
                        >
                          {itemMap[item].imageUrl ? (
                            <img
                              src={itemMap[item].imageUrl}
                              alt={itemMap[item].altText}
                              style={{ width: "100%" }}
                            />
                          ) : (
                            itemMap[item].altText
                          )}
                        </TestItemContainer>
                      </div>
                      <form
                        onSubmit={(e) => {
                          modalSubmit(e, item);
                        }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          sx={{ textTransform: "none" }}
                          color="success"
                          value="yes"
                        >
                          Yes
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          sx={{ textTransform: "none" }}
                          color="error"
                          value="no"
                        >
                          No
                        </Button>
                      </form>
                    </Typography>
                  </Box>
                </Modal>
                <Popover
                  id={popOverId}
                  open={popOverOpen}
                  anchorEl={anchorEl}
                  onClose={handlePopOverClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  {/* The content of the Popover. */}
                  <Typography sx={{ p: 2 }}>
                    <form>
                      <label htmlFor={itemMap[item].altText + "itemDescInput"}>
                        Image Desc:
                      </label>
                      <input
                        type="text"
                        id={itemMap[item].altText + "itemDescInput"}
                        value={itemMap[item].altText}
                        onChange={(e) => {
                          changeAltTextofItem(e, item);
                        }}
                      />
                    </form>
                  </Typography>
                </Popover>
                <ButtonUnstyled
                  variant="error"
                  style={{
                    position: "absolute",
                    zIndex: "100",
                    bottom: 0,
                    left: 0,
                  }}
                  onClick={handleClick}
                  /* edit */
                >
                  e
                </ButtonUnstyled>
                <ButtonUnstyled
                  variant="error"
                  style={{
                    position: "absolute",
                    zIndex: "100",
                    bottom: 0,
                    right: 0,
                  }}
                  onClick={handleOpen}
                >
                  X
                </ButtonUnstyled>
              </>
            ) : (
              itemMap[item].altText
            )}
          </TestItemContainer>
        )}
      </Draggable>
    )
  );
}
export default TestTopicItem;
