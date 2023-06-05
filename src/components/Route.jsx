import PlaceWithBtn from "./PlaceWithBtn";

function Route(props) {
  const { selectedDay } = props;

  // 선택된 날짜에 따라 다른 내용을 보여줌
  const renderRouteContent = () => {
    if (selectedDay === 1) {
      return (
        <div className="allRoute">
          <div id="showDay">Day 1의 경로</div>
          <PlaceWithBtn></PlaceWithBtn>
        </div>
      );
    } else if (selectedDay === 2) {
      return (
        <div>
          <div className="showDay">Day 2의 경로</div>
        </div>
      );
    } else if (selectedDay === 3) {
      return (
        <div>
          <div className="showDay">Day 3의 경로</div>
        </div>
      );
    }
  };

  return <div className="Route">{renderRouteContent()}</div>;
}

export default Route;
