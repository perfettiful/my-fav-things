import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const TestItemContainer = styled.div`
  background-color: #efefef;
  display: inline-block;
  overflow: hidden;
  ${(props) => !props.backgroundImage && "box-shadow: inset 0 0 10px #000; "};

  padding:10px;
  height: 60px;
`;

function TestItem(props) {
  const { item, itemMap, index } = props;
  return (
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
            <img
              src={itemMap[item].imageUrl}
              alt={itemMap[item].altText}
              style={{ width: "100%" }}
            />
          ) : (
            itemMap[item].altText
          )}
        </TestItemContainer>
      )}
    </Draggable>
  );
}
export default TestItem;
