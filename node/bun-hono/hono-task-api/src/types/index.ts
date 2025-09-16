export type User = {
  id: number;
  username: string;
  password: string;
  role: string;
  createdAt: Date;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  user_id: number;
  createdAt: Date;
};
