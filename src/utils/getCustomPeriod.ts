import dayjs from "dayjs";

interface PeriodOptions {
  startDate: string | Date;
  endDate: string | Date;
}

export const getCustomPeriod = ({ startDate, endDate }: PeriodOptions) => {
  return {
    startDate: dayjs(startDate).startOf("day").toDate(),
    endDate: dayjs(endDate).endOf("day").toDate(),
  };
};