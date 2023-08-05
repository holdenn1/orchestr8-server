export type TaskToProfile = {
  id: number;
  completed: boolean;
  task: string;
  createAt: Date;
  updateAt: Date;
};

export enum StatusTask {
  ALL = 'all-tasks',
  COMPLETED = 'completed',
}
