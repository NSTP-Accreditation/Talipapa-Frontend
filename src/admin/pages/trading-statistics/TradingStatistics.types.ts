import { LogInterface, RecordInterface } from '@/types/global.types';
import { PaginationInterface } from '@/types/pagination';

export type TradingStatisticsProps = {
  logsData?: PaginationInterface<LogInterface>;
  recordsData?: RecordInterface[];
  recordsToday?: RecordInterface[];
  totalPoints?: number;
  topList?: any[];
};
