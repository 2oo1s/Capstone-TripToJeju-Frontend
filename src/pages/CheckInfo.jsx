import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import { addDays, differenceInDays } from "date-fns";
import "../CheckInfo.css";
import "../Calendar.css";
import axios from "axios";

function CheckInfo() {
  const navigate = useNavigate();
  const today = new Date();

  // 선택된 정보 저장
  const [selectedData, setSelectedData] = useState({
    startDate: null,
    endDate: null,
    times: { start: null, end: null },
    car: null,
    themes: [],
    location: null,
    with: null,
  });

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    const newEndDate =
      end && differenceInDays(end, start) > 2 ? addDays(start, 2) : end;

    setSelectedData({
      ...selectedData,
      startDate: start ? start : null,
      endDate: newEndDate ? newEndDate : null,
    });
  };

  const handleSelect = (name, value) => {
    setSelectedData({
      ...selectedData,
      [name]: value,
    });
  };

  const handleTimeSelect = (e) => {
    handleSelect("times", {
      ...selectedData.times,
      [e.target.name]: e.target.value,
    });
  };

  const handleCarSelect = (index) => {
    handleSelect("car", index === selectedData.car ? null : index);
  };

  const handleLocationSelect = (index) => {
    handleSelect("location", index === selectedData.location ? null : index);
  };

  const handleWithSelect = (index) => {
    handleSelect("with", index === selectedData.with ? null : index);
  };

  const handleThemeSelect = (theme) => {
    if (selectedData.themes.includes(theme)) {
      if (selectedData.themes.length >= 1) {
        setSelectedData({
          ...selectedData,
          themes: selectedData.themes.filter((t) => t !== theme),
        });
      }
    } else if (selectedData.themes.length < 3) {
      setSelectedData({
        ...selectedData,
        themes: [...selectedData.themes, theme],
      });
    } else {
      alert("최대 3개까지 선택 가능합니다!");
    }
  };

  const startDateString = selectedData.startDate
    ? selectedData.startDate.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  const endDateString = selectedData.endDate
    ? selectedData.endDate.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  const duration =
    differenceInDays(selectedData.endDate, selectedData.startDate) + 1;

  const checkValidity = () => {
    if (
      selectedData.startDate === null ||
      selectedData.times.start === null ||
      selectedData.times.end === null ||
      selectedData.car === null ||
      selectedData.themes.length === 0
    ) {
      const emptyData = [];

      if (selectedData.startDate === null || selectedData.endDate === null) {
        emptyData.push("여행일자");
      }
      if (selectedData.times.start === null) {
        emptyData.push("시작시간");
      }
      if (selectedData.times.end === null) {
        emptyData.push("종료시간");
      }
      if (selectedData.car === null) {
        emptyData.push("이동수단");
      }
      if (selectedData.themes.length === 0) {
        emptyData.push("여행테마");
      }
      alert(`' ${emptyData.join(", ")} '을(를) 선택해주세요!`);
    } else {
      navigate("/options", {
        state: {
          duration: duration,
          selectedData: selectedDataJson,
        },
      });
    }
  };

  // 이후 서버랑 연결할 때, 필요 // // // //
  const selectedDataJson = {
    ...selectedData,
    startDate: startDateString,
    endDate: endDateString,
  };

  // 결과 확인용 지울 것! // // // //
  console.log(selectedDataJson);
  // ! // ! // ! // ! // ! // ! //

  return (
    <div className="CheckInfo">
      <div className="about">
        <button id="back" onClick={() => navigate(-1)}>
          {`<`}
        </button>
        <text>이번 제주 여행은 ... {"\uD83C\uDF4A"}</text>
      </div>
      <div className="Q">
        <text>1. 여행일자를 선택해주세요.</text>
        <DatePicker
          locale={ko}
          dateFormat="yyyy.MM.dd"
          minDate={today}
          // maxDate={addMonths(new Date(), 1)}
          selected={selectedData.startDate}
          onChange={handleDateChange}
          startDate={selectedData.startDate}
          endDate={selectedData.endDate}
          selectsRange
          placeholderText="최대 2박 3일까지 선택 가능"
        />
      </div>
      <div className="Q">
        <text>2. 여행 시작과 종료 시간을 선택해주세요.</text>
        <div className="CheckTime">
          <text>시작</text>
          <select
            name="start"
            value={selectedData.times.start}
            onChange={handleTimeSelect}
          >
            <option value={"아침"}>아침 (8-9시)</option>
            <option value={"점심"}>점심 (12-13시)</option>
            <option value={"오후"}>오후 (14-15시)</option>
          </select>
          <text>|</text>
          <text>종료</text>
          <select
            name="end"
            value={selectedData.times.end}
            onChange={handleTimeSelect}
          >
            <option value={"18-20시"}>18-20시</option>
            <option value={"20-21시"}>20-21시</option>
            <option value={"21-22시"}>21-22시</option>
          </select>
        </div>
      </div>
      <div className="Q">
        <text>3. 이동수단으로 차를 이용하실 건가요?</text>
        <span className="car">
          <button
            className={selectedData.car === "O" ? "selected" : ""}
            onClick={() => handleCarSelect("O")}
          >
            O
          </button>
          <button
            className={selectedData.car === "X" ? "selected" : ""}
            onClick={() => handleCarSelect("X")}
          >
            X
          </button>
        </span>
      </div>
      <div className="Q">
        <text>4. 여행 테마를 선택해주세요. (최대 3개 선택 가능)</text>
        <span className="theme">
          <button
            className={
              selectedData.themes.includes("액티비티") ? "selected" : ""
            }
            onClick={() => handleThemeSelect("액티비티")}
          >
            액티비티
          </button>
          <button
            className={selectedData.themes.includes("자연") ? "selected" : ""}
            onClick={() => handleThemeSelect("자연")}
          >
            자연
          </button>
          <button
            className={selectedData.themes.includes("체험") ? "selected" : ""}
            onClick={() => handleThemeSelect("체험")}
          >
            체험
          </button>
          <br />
          <button
            className={
              selectedData.themes.includes("포토스팟") ? "selected" : ""
            }
            onClick={() => handleThemeSelect("포토스팟")}
          >
            포토스팟
          </button>
          <button
            className={selectedData.themes.includes("해변") ? "selected" : ""}
            onClick={() => handleThemeSelect("해변")}
          >
            해변
          </button>
          <button
            className={selectedData.themes.includes("휴식") ? "selected" : ""}
            onClick={() => handleThemeSelect("휴식")}
          >
            휴식
          </button>
        </span>
      </div>
      <div className="Q">
        <text>5. 동행자 유형을 선택해주세요. (필수 X)</text>
        <span className="with">
          <button
            className={selectedData.with === "부모님" ? "selected" : ""}
            onClick={() => handleWithSelect("부모님")}
          >
            부모님
          </button>
          <button
            className={selectedData.with === "아이" ? "selected" : ""}
            onClick={() => handleWithSelect("아이")}
          >
            아 이
          </button>
          <button
            className={selectedData.with === "연인" ? "selected" : ""}
            onClick={() => handleWithSelect("연인")}
          >
            연 인
          </button>
          <button
            className={selectedData.with === "친구" ? "selected" : ""}
            onClick={() => handleWithSelect("친구")}
          >
            친 구
          </button>
        </span>
      </div>
      <div className="Q">
        <text>6. 선호하는 여행 지역을 선택해주세요. (필수 X)</text>
        <span className="location">
          <button
            className={selectedData.location === "서부" ? "selected" : ""}
            onClick={() => handleLocationSelect("서부")}
          >
            서 부
          </button>
          <button
            className={selectedData.location === "동부" ? "selected" : ""}
            onClick={() => handleLocationSelect("동부")}
          >
            동 부
          </button>
        </span>
      </div>
      <button id="result" onClick={checkValidity}>
        추천된 경로 보기
      </button>
    </div>
  );
}

export default CheckInfo;
