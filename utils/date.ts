import dayjs from "dayjs"

const formats = [
  "DD/MM/YYYY",
  "DD/MM/YYYY HH:mm",
  "DD/MM/YYYY HH:mm:ss",
] as const;


export function formatDate(
  dateString?: Date | string | number | null,
  fmt?: (typeof formats)[number]
): string {
  // const dateMs = sanitizeDateToMs(dateString);
  // const date = new Date(dateMs);
  // switch (fmt) {
  //   case "DD/MM/YYYY":
  //     return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  //   case "DD/MM/YYYY HH:mm":
  //     return `${date.getDate()}/${
  //       date.getMonth() + 1
  //     }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  //   case "DD/MM/YYYY HH:mm:ss":
  //     return `${date.getDate()}/${
  //       date.getMonth() + 1
  //     }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  //   default:
  //     return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  // }
  // console.log(" == dateString == ", dateString);
  return dayjs(dateString).format('DD/MM/YYYY')
}



export function sanitizeDateToMs(date?: Date | string | number | null): number {
  if (!date) return 0;

  if (typeof date === "string" && date !== "") {
    const parsed = Date.parse(date);
    return !isNaN(parsed) ? parsed : 0;
  }

  if (typeof date === "number") {
    return !isNaN(date) ? date : 0;
  }

  if (date instanceof Date) {
    const time = date.getTime();
    return !isNaN(time) ? time : 0;
  }

  return 0;
}
