// DateTime.from is wrong export ago function
export class DateTime {
  constructor(dateObject) {}

  static mns = 1 / 1000;
  static snm = 1 / 60;
  static mnh = 1 / 60;
  static hnd = 1 / 24;
  static dny = 1 / 365;
  static mny = 1 / 12;

  static msns = 1000;
  static msnMinute = 60000;
  static msnHour = 3600000;
  static msnDay = 86400000;
  static msnYear = DateTime.msnDay * 365;

  // static thisYear() {
  //     let d = new Date()
  //     console.log(d.getFullYear())
  // }

  static daysIn(month) {
    const abbrv = month.slice(0, 3);
    if (DateTime.monthMap[month]) return DateTime.monthMap[month];
    else if (DateTime.monthMap[abbrv]) return DateTime.monthMap[abbrv];
  }

  static dayMap = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thurday",
    5: "Friday",
    6: "Saturday",
    7: null,

    toArray() {
      const arr = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      arr.abbrv = arr.abbreviate = () => arr.map(slice.bind(months, [0, 3]));
      return arr;
    },
  };

  static get days() {
    return DateTime.dayMap.toArray();
  }

  static get monthMap() {
    return {
      january: 31,
      get february() {
        if (DateTime.thisYearIsLeap()) return 29;
        return 28;
      },
      march: 31,
      april: 30,
      may: 31,
      june: 30,
      july: 31,
      august: 31,
      september: 30,
      october: 31,
      november: 30,
      december: 31,
    };
  }

  static get months() {
    const arr = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    arr.abbrv = arr.abbreviate = () => arr.map(slice.bind(arr, [0, 3]));
    return arr;
  }

  static get clock() {
    const curDate = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const hours = curDate.getHours();
    const minutes = curDate.getMinutes();
    const seconds = curDate.getSeconds();
    const context = hours >= 12 ? "pm" : "am";
    return {
      dow: days[curDate.getDay()],
      month: months[curDate.getMonth()],
      date: curDate.getDate(),

      hour: hours <= 12 ? hours : hours - 12,
      minute: minutes,
      second: seconds,
      miliseconds: curDate.getMilliseconds(),
      context,

      time: {
        hour: hours <= 12 ? hours.toString() : (hours - 12).toString(),
        minute:
          minutes >= 10
            ? minutes.toString()
            : minutes.toString().padStart(2, "0"),
        second:
          seconds >= 10
            ? seconds.toString()
            : seconds.toString().padStart(2, "0"),
        context,
        get string() {
          return (
            [this.hour, this.minute, this.second].join(":") + " " + context
          );
        },
        get default() {
          return [this.hour, this.minute].join(":") + " " + context;
        },
      },
    };
  }

  static get time() {
    return DateTime.clock.time.default;
  }

  static date = {
    standard: undefined,
    default: undefined,
    universal: undefined,
    east: undefined,
    west: undefined,
    central: undefined,
    leap: DateTime.thisYearIsLeap(),

    dayMap: {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thurday",
      5: "Friday",
      6: "Saturday",
      7: null,
    },

    get monthMap() {
      return {
        January: 31,
        get February() {
          if (DateTime.date.leap) return 29;
          return 28;
        },

        March: 31,
        April: 30,
        May: 31,
        June: 30,
        July: 31,
        August: 31,
        September: 30,
        October: 31,
        November: 30,
        December: 31,
      };
    },

    days: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      null,
    ],

    daysABRV: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", null],

    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
      null,
    ],

    monthsABRV: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Nov",
      "Dec",
      null,
    ],
  };

  static now() {
    return new Date();
  }

  static stamp() {
    return {
      day: DateTime.today(),
      month: DateTime.thisMonth(),
      year: DateTime.thisYear(),
      date: DateTime.currentDate(),
      time: DateTime.currentTime(),
      isLeap: DateTime.thisYearIsLeap(),
      ms: Date.now(),
    };
  }

  static compareStamps(current, prev) {
    return DateTime.from(new Date(current.ms), prev.ms);
  }

  static weekOf(stamp) {}

  static monthOf(stamp) {}

  static yearOf(stamp) {}
  static today() {
    return DateTime.date.days[new Date().getDay()];
  }

  static currentTime() {
    return new Date().toLocaleTimeString();
  }

  static currentDate() {
    return new Date().getDate();
  }

  static thisMonth() {
    return DateTime.date.months[new Date().getMonth()];
  }

  static thisYear() {
    return new Date().getFullYear();
  }

  static thisYearIsLeap() {
    return DateTime.isLeap(DateTime.thisYear());
  }

  static isLeap(year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  }

  static getLeaps(to, from) {
    function countFrom(lowest, highest) {
      let leapSince = 0;
      for (let i = lowest; i <= highest; i++) {
        if (DateTime.isLeap(i)) leapSince++;
      }
      return leapSince;
    }
    return to < from ? countFrom(to, from) : countFrom(from, to);
  }

  static daysInMonth(month, year) {
    let days = date.monthMap[month];
    if (date.isLeap(year && (month == "February" || month == "Feb"))) days = 29;
    return days;
  }

  static msnMonth(month, year) {
    let days = daysInMonth(month, year);
    let msInMonth = days * DateTime.msnDay;
    return msInMonth;
  }

  static hoursAgo(stamp) {
    const then = toHours(stamp);
    const now = toHours(Date.now());
    const diffy = now - then;
    return diffy;
  }

  static secondsAgo(stamp) {
    const then = toSecondsFloat(stamp);
    const now = toSecondsFloat(Date.now());
    const diffy = now - then;
    const ago = {
      seconds: Math.floor(diffy),
      milliseconds: null,
    };
    return ago;
  }

  static secondsLeft(milliseconds) {
    const minutes = toMinutesFloat(milliseconds);
    return minutes;
  }

  static toSeconds(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    return seconds;
  }
  static toSecondsFloat(milliseconds) {
    const seconds = milliseconds / 1000;
    return seconds;
  }

  static toMinutes(milliseconds) {
    let seconds = toSeconds(milliseconds);
    let minutes = Math.floor(seconds / 60);
    return minutes;
  }

  static toMinutesFloat(milliseconds) {
    const minutes = toSecondsFloat(milliseconds) / 60;
    const floored = Math.floor(minutes);
    const seconds = Math.floor((minutes - floored) / snm);

    const ago = {
      floored: floored,
      minutes: minutes,
      seconds: seconds,
      string: `${minutes} : minutes, and ${seconds} : seconds ago`,
    };
    return ago;
  }

  static minutesAgo(stamp) {
    const now = toMinutesFloat(Date.now()).minutes;
    const then = toMinutesFloat(stamp).minutes;
    const minutes = Math.floor(now - then);
    const seconds = Math.floor((now - then - Math.floor(now - then)) / snm);

    const ago = {
      minutes: minutes,
      seconds: seconds,
      string: `${minutes} minutes, and ${seconds} seconds ago`,
    };
    return ago;
  }

  static toHours(milliseconds) {
    let minutes = toMinutes(milliseconds);
    let hours = Math.floor(minutes / 60);
    return hours;
  }

  static toHoursFloat(milliseconds) {
    let minutes = toMinutesFloat(milliseconds);
    let hours = minutes / 60;
    return hours;
  }

  static toDays(milliseconds) {
    let hours = toHours(milliseconds);
    let days = Math.floor(hours / 24);
    return days;
  }

  static toDaysFloat(milliseconds) {
    let hours = toHoursFloat(milliseconds);
    let days = hours / 24;
    return days;
  }

  static toMonths(milliseconds) {}

  static toMonthsFloat(milliseconds) {}

  static toYears(milliseconds) {
    let days = toDays(milliseconds);
    let years = Math.floor(days / 365);
    return years;
  }

  // const minutesInYear = msnYear;

  static from(msDate, compare = Date.now()) {
    // since Date , compareMILISECONDS
    const since = new Date(msDate);
    const now = compare;
    const then = new Date(since).getTime();
    const nowDate = new Date(compare);
    const monthsInYear = 1 / 12;
    const msnYear = DateTime.msnDay * 365;
    const msInWeek = 604800000;
    const msInDay = 86400000;
    const msInHour = 3600000;
    const msInMin = 60000;
    const msInSec = 1000;
    const minutesInHour = 60;
    const secondsInMinute = 60;
    /* TODO
            DAYS ONLY WORKS IF IN SAME MONTH
            CALCULATE MONTHS SINCE AND AMOUNT OF DAYS BETWEEN EACH MONTH
            THEN GET DAYS
            MONTHS ALGO IS WRONG TOO!
            WEEKS ALGO IS WRONG!
        */
    const monthOf = DateTime.months[since.getMonth()];
    const prevMonthOf = DateTime.months[nowDate.getMonth()];
    const daysIn = DateTime.monthMap[monthOf];
    const prevDaysIn = DateTime.monthMap[prevMonthOf];
    const dayOf = since.getDate();
    const prevDayOf = nowDate.getDate();
    // const days = daysIn - dayOf;
    const days = Math.abs(dayOf - prevDayOf);
    const leapSince = DateTime.getLeaps(
      since.getFullYear(),
      new Date(now).getFullYear()
    );
    let msAgo = now - then;
    let context = "ago";
    if (msAgo < 0) {
      context = "til";
    }
    msAgo = Math.abs(msAgo);
    const years = msAgo >= msnYear ? msAgo / msnYear : 0;
    const monthsAgo = DateTime.getRemainder(years);
    // const months = monthsAgo / monthsInYear;
    // NULL SEE TODO
    const weeksAgo = msAgo >= msInWeek ? Math.floor(msAgo / msInWeek) : 0;
    // const weeks = monthsAgo / weeksInYear;
    // NULL SEE TODO
    const daysAgo =
      msAgo >= msInDay ? Math.floor(msAgo / msInDay) + leapSince : 0;
    // NULL SEE TODO
    const hoursAgo = msAgo >= msInHour ? Math.floor(msAgo / msInHour) : 0;
    const hours = hoursAgo;
    const minutesAgo = msAgo >= msInMin ? Math.floor(msAgo / msInMin) : 0;
    const minutes = Math.floor(
      DateTime.getRemainder(msAgo / msInHour) * minutesInHour
    );
    const secondsAgo = msAgo >= msInSec ? Math.floor(msAgo / msInSec) : 0;
    const seconds = Math.floor(
      DateTime.getRemainder(msAgo / msInMin) * secondsInMinute
    );
    const ago = {
      since: new Date(now),
      then: new Date(then),
      years: Math.floor(years),
      // months: Math.floor(months),
      days: days,
      yearsAgo: years,
      weeksAgo: weeksAgo,
      daysAgo: daysAgo,
      hoursAgo: hoursAgo,
      hours,
      minutesAgo: minutesAgo,
      minutes,
      secondsAgo: secondsAgo,
      seconds,
      milisecondsAgo: msAgo,
      // milliseconds: msAgo,
      leaps: leapSince,
      string: '',
    };
    if (ago.yearsAgo >= 1) {
      if (ago.months >= 1)
        ago.string = `${ago.years} Years, ${ago.months} Months ${context}`;
      else if (ago.months < 1) ago.string = `${ago.years} Years ${context}`;
    } else if (ago.weeksAgo < 4 && ago.weeksAgo > 2) {
      ago.string = `${ago.weeksAgo} Weeks ${context}`;
    } else if (ago.daysAgo < 14 && ago.daysAgo > 2) {
      ago.string = `${ago.daysAgo} Days ${context}`;
    } else if (ago.hoursAgo <= 48 && ago.hoursAgo >= 1) {
      if (ago.hoursAgo < 2 && ago.hoursAgo >= 1) {
        ago.string = `${ago.hoursAgo} Hour ${context}`;
      } else {
        ago.string = `${ago.hoursAgo} Hours ${context}`;
      }
    } else if (ago.minutesAgo < 59 && ago.minutesAgo > 1) {
      ago.string = `${ago.minutesAgo} Minutes ${context}`;
    } else if (ago.secondsAgo < 60 && ago.secondsAgo > 30) {
      ago.string = `${ago.secondsAgo} Seconds ${context}`;
    } else if (ago.secondsAgo < 30) {
      ago.string = "Just Now";
      ago.time = 0;
      ago["context"] = context;
      return ago;
    } else {
      return ago;
    }
    ago.time = ago.string.split(" ")[0];
    ago.suffix = ago.string.split(" ")[1];
    ago["context"] = context;
    return ago;
  }
  static getRemainder(float) {
    // miliseconds left after floored value IN DECIMAL
    return float - Math.floor(float);
  }
}
const mns = 1/1000;
const snm = 1/60;
const mnh = 1/60; 
const hnd = 1/24;
const dny = 1/365;
const mny = 1/12;

const msns = 1000;
const msnMinute = 60000;
const msnHour = 3600000;
const msnDay = 86400000;
const msnYear = msnDay * 365;

export const date = {
    standard: undefined,
    default: undefined,
    universal: undefined,
    east: undefined,
    west: undefined,
    central: undefined,
    leap: false,
    dayMap: {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thurday',
        5: 'Friday',
        6: 'Saturday',
        7: null,
    },
    monthMap: {
        'January': 31,
        get 'February'(){
            if (this.leap) return 29
            return 28;
        },
        'March': 31,
        'April': 30,
        'May': 31,
        'June': 30,
        'July': 31,
        'August': 31,
        'September': 30,
        'October': 31,
        'November': 30,
        'December': 31,
    },
    days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday',null],
    daysABRV: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat', null],
    months: ['January','February','March','April','May','June','July','August','September','October','November','December', null],
    monthsABRV: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Nov', 'Dec', null],
    isLeap: (year) => {
        return ((year % 4 == 0) && (year % 100 !=0)) || (year % 400 == 0)     
    },
    getLeaps: (to,from) => {
        function countFrom(lowest,highest) {
            let leapSince = 0;
            for (let i = lowest; i <= highest; i++) {
                if (date.isLeap(i))
                    leapSince++;
            }
            return leapSince;
        }
        return to < from ? countFrom(to,from) : countFrom(from,to);
    }
}

export function stamp() {
    return Date.now();
}

export function thisMonth() {
    let month = new Date(Date.now()).getMonth
    return date.months[month];
}

export function thisYear() {
    return new Date(Date.now()).getFullYear();
}

export function daysInMonth(month,year) {
    let days = date.monthMap[month];
    if (date.isLeap(year && (month == "February" || month == "Feb")))
        days = 29;
    return days;
}

export function msnMonth(month,year) {
    let days = daysInMonth(month, year)
    let msInMonth = days * msnDay;
    return msInMonth;
}

export function hoursAgo(stamp) {
    const then = toHours(stamp);
    const now = toHours(Date.now());
    const diffy = now - then; 
    return diffy;
}

export function secondsAgo(stamp) {
    const then = toSecondsFloat(stamp);
    const now = toSecondsFloat(Date.now());
    const diffy = now - then;
    const ago = {
        seconds: Math.floor(diffy),
        milliseconds: null,
    }
    return ago;
}

export function secondsLeft(milliseconds) {
    const minutes = toMinutesFloat(milliseconds);
    return minutes;
}

export function toSeconds(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    return seconds;
}

export function toSecondsFloat(milliseconds) {
    const seconds = milliseconds / 1000;
    return seconds;
}

export function toMinutes(milliseconds) {
    let seconds = toSeconds(milliseconds);
    let minutes = Math.floor(seconds / 60);
    return minutes;
}

export function toMinutesFloat(milliseconds) {
    const minutes = toSecondsFloat(milliseconds) / 60;
    const floored = Math.floor(minutes);
    const seconds = Math.floor((minutes - floored) / snm);

    const ago = {
        floored: floored,
        minutes: minutes,
        seconds: seconds,
        string: `${minutes} : minutes, and ${seconds} : seconds ago`,
    }
    return ago;
}

export function minutesAgo(stamp) {
    const now = toMinutesFloat(Date.now()).minutes;
    const then = toMinutesFloat(stamp).minutes;
    const minutes = Math.floor(now - then);
    const seconds = Math.floor(((now - then) - Math.floor(now - then)) / snm);

    const ago = {
        minutes: minutes,
        seconds: seconds,
        string: `${minutes} minutes, and ${seconds} seconds ago`,
    }
    return ago;
}

export function toHours(milliseconds) {
    let minutes = toMinutes(milliseconds);
    let hours = Math.floor(minutes / 60);
    return hours;
}

export function toHoursFloat(milliseconds) {
    let minutes = toMinutesFloat(milliseconds);
    let hours = minutes / 60;
    return hours;
}

export function toDays(milliseconds) {
    let hours = toHours(milliseconds);
    let days = Math.floor(hours / 24);
    return days;
}

export function toDaysFloat(milliseconds) {
    let hours = toHoursFloat(milliseconds);
    let days = hours / 24;
    return days;
}

export function toMonths(milliseconds) {

}

export function toMonthsFloat(milliseconds) {

}

export function toYears(milliseconds) {
    let days = toDays(milliseconds);
    let years = Math.floor(days / 365);
    return years;
}
// const minutesInYear = msnYear;
export function ago(since) {
    const now = Date.now();
    const then = since.getTime();
    
    const monthsInYear = 1/12;

    const msInWeek = 604800000;
    const msInDay = 86400000;
    const msInHour = 3600000;
    const msInMin = 60000;
    const msInSec = 1000;
    
    const monthOf = date.months[since.getMonth()]

    const daysIn = date.monthMap[monthOf];
    const dayOf = since.getDate();
    const days = daysIn - dayOf;

    const leapSince = date.getLeaps(since.getFullYear(), new Date(now).getFullYear())
    let msAgo = now - then;
    let context = 'ago'
    if (msAgo < 0) {
        context = 'til'
    }

    msAgo = Math.abs(msAgo);

    const years = msAgo / msnYear;
    const monthsAgo = getRemainder(years);
    const months = monthsAgo / monthsInYear;

    // const weeks = monthsAgo / weeksInYear;

    const weeksAgo = Math.floor(msAgo / msInWeek);
    const daysAgo = (Math.floor(msAgo / msInDay) + leapSince);
    const hoursAgo = Math.floor(msAgo / msInHour);
    const minutesAgo = Math.floor(msAgo / msInMin);
    const secondsAgo = Math.floor(msAgo / msInSec);

    const ago = {
        since: new Date(now),
        then: new Date(then),

        years: Math.floor(years),
        months: Math.floor(months),
        days: days,

        yearsAgo: years,
        weeksAgo: weeksAgo,
        daysAgo: daysAgo,
        hoursAgo: hoursAgo,
        minutesAgo: minutesAgo,
        secondsAgo: secondsAgo,

        leaps: leapSince,
        string: undefined,
    };
    
    if (ago.yearsAgo >= 1) {
        if (ago.months >= 1) 
            ago.string = `${ago.years} Years, ${ago.months} Months ${context}`
        else if (ago.months < 1 ) 
            ago.string = `${ago.years} Years ${context}`
    } else if (months < 12 & months >= 1) {
        let rounded = ago.months === 1 && days > 0 ? 2 : 1
        ago.string = `${rounded} ${rounded === 1 ? 'Month' : 'Months'} ${context}`
    }
    else if (ago.weeksAgo < 4 && ago.weeksAgo > 2) {
        ago.string = `${ago.weeksAgo} Weeks ${context}`
    }

    else if (ago.daysAgo < 14 && ago.daysAgo > 2) {
        ago.string = `${ago.daysAgo} Days ${context}`
    }
    else if (ago.hoursAgo <= 48 && ago.hoursAgo >= 1) {
        if (ago.hoursAgo < 2 && ago.hoursAgo >=1) {
            ago.string = `${ago.hoursAgo} Hour ${context}`
        } else {
            ago.string = `${ago.hoursAgo} Hours ${context}`
        }
    }
    else if (ago.minutesAgo < 59 && ago.minutesAgo > 1) {
        ago.string = `${ago.minutesAgo} Minutes ${context}`
    }
    else if (ago.secondsAgo < 60 && ago.secondsAgo > 30) {
        ago.string = `${ago.secondsAgo} Seconds ${ago}`
    }
    else if (ago.secondsAgo < 30) {
        ago.string = `Just Now`
    }
    else {
        return ago;
    }
    ago.time = ago.string.split(' ')[0];
    ago.suffix = ago.string.split(' ')[1];
    ago['context'] = context;

    return ago;
}
export function getRemainder(float) {
    return float - Math.floor(float);
}
// 333309223436
// const testDay = new Date('2012-02-08T00:00:00')
// const yesterday = new Date('2022-08-30T00:00:00');
// const coupleHoursAgo = new Date('2022-08-31T16:32:00');
// const nextHour = new Date(Date.now() + msnHour);
// const thirtyTwoMintues = new Date(Date.now() + (msnMinute * 32));

// const testFrom = from(nextHour);
// console.log(testFrom)
