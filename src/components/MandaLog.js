import React, {
    Component,
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef,
} from "react";
import styled, { ThemeProvider } from 'styled-components';
import Year from "react-live-clock";
import Month from "react-live-clock";
import theme from './theme';

function MandaLog() {
    const now = new Date();
    const todayWeak = now.getDay();
    const today = now.getDate();
    const lastday = new Date(now.getFullYear(), now.getMonth(), 0).getDate();

    const [daylist, setDaylist] = useState([]);

    const getAlldate = (today, lastday) => {
        let dates = [];

        dates[6] = today;
        for (let i = 5; i >= 0; i--) {
            today--;
            //마지막 날보다 날짜가 클경우 today를 1로 초기화.
            if (today <= 0) {
                today = lastday;
                dates[i] = today;
            }
            //일반 경우 그냥 날짜 추가
            else {
                dates[i] = today;
            }
        }
        return dates;
    };
    const getAllweak = (todayWeak) => {
        let strWeak = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let weaklist = [];

        //첫번째 오늘 날짜 적용

        weaklist[6] = strWeak[todayWeak];

        for (let i = 5; i >= 0; i--) {
            todayWeak--;
            if (todayWeak < 0) {
                todayWeak = 6;
                weaklist[i] = strWeak[todayWeak];
            } else {
                weaklist[i] = strWeak[todayWeak];
            }
        }

        return weaklist;
    };

    const CalendarDay = getAlldate(today, lastday);
    const CalendarWeak = getAllweak(todayWeak);

    const CalendarObject = [
        { weak: CalendarWeak[0], day: CalendarDay[0] },
        { weak: CalendarWeak[1], day: CalendarDay[1] },
        { weak: CalendarWeak[2], day: CalendarDay[2] },
        { weak: CalendarWeak[3], day: CalendarDay[3] },
        { weak: CalendarWeak[4], day: CalendarDay[4] },
        { weak: CalendarWeak[5], day: CalendarDay[5] },
        { weak: CalendarWeak[6], day: CalendarDay[6] },
    ];

    const Weak = useRef(null);

    const Alldate = useMemo(() => getAlldate(today, lastday), [daylist]);
    return (
        <ThemeProvider theme={theme}>
            <StyleList>
                <div className="Calendar">
                    <div className="Year-MonthList">
                        <p>
                            <span className="Year">
                                <Year
                                    id="Year"
                                    format={"YYYY"}
                                    ticking={false}
                                    timezone={"Asia/Seoul"}
                                />
                            </span>
                            &nbsp;&nbsp;
                            <span className="Month">
                                <Month format={"MMMM"} ticking={false} timezone={"Asia/Seoul"} />
                            </span>
                        </p>
                    </div>
                    <div className="DayList" ticking={false}>
                        <div className="daylistContainer">
                            {CalendarObject.map((calendar, index) => (
                                <div className="daylistSector">
                                    <div
                                        className={calendar.weak === "Sun" ? "weak Sun" : (
                                            calendar.weak === "Sat" ? "weak Sat" : "weak"
                                        )
                                        }
                                        ref={Weak}
                                    >
                                        {calendar.weak}
                                    </div>
                                    <div className="day">{calendar.day}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </StyleList>
        </ThemeProvider >
    );
}
let StyleList = styled.div`
.Calendar {
  margin-bottom: 140px;
  ${({ theme }) => theme.flexBox.columnCenter};
  text-align: center;
  width: 250px;
  overflow: initial;
  ${({ theme }) => theme.font.importPretendard};
  font-family: Pretendard-Regular;
  gap: 1rem;
  background-color: ${(props) => props.theme.bg};
  padding: 1rem 0;

  .Year-MonthList {
    color: ${(props) => props.theme.font1};
    .Year {
      font-size: 2rem;
    }

    .Month {
      font-size: 1.4rem;
    }
  }

  /* 요일과 날짜를 표시하는 컨테이너 (List)*/
  .DayList {
    width: 100%;
    height: 3.5rem;
    font-size: 0.875rem;
    color: ${(props) => props.theme.font1};
    justify-content: center;
    align-items: center;
    text-align: center;

    .daylistContainer{
        ${({ theme }) => theme.flexBox.rowCenter};
    }

    .daylistSector {
      width: 40px;
      justify-content: center;
      align-items: center;
      text-align: center;
      cursor: pointer;
      padding: 0.25rem;

      .Sun {
        color: red !important;
      }

      .Sat {
        color: ${(props) => props.theme.secondary} !important;
      }

      &:nth-child(7) {
        border: 0.04rem solid ${(props) => props.theme.border};
      }

      .weak {
        font-family: "Nanum Myeongjo";
        font-size: 0.8em;
        align-items: center; //수직 중앙 정렬
        justify-content: center; //수평 중앙 정렬
        color: ${(props) => props.theme.font2};
        text-align: center;
        margin-bottom: 1rem;
      }

      .day {
        font-weight: bold;
      }
    }
  }
}
`;
export default MandaLog;