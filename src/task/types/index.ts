export type TaskToProfile = {
  id: number;
  completed: boolean;
  task: string;
};

export enum StatusTask {
  ALL = 'all-tasks',
  COMPLETED = 'completed',
}
