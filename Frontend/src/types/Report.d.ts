export interface Report {
  id: number;
  title: string;
  content: string;
  priority: string;
  status: string;
  category: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
  assignee?: {
    name: string;
    email: string;
  };
}
