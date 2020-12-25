// 2088-12-31 00:00:00 => 2088-12-31
export function splitDateTime(time) {
  time = time ? time : "-";
  return time.split(" ")[0];
}
export function filterguanji(boolean = "") {
  let string1 = "是";
  let string2 = "否";
  if (boolean) {
    return string1;
  } else if (boolean === false) {
    return string2;
  }
}
