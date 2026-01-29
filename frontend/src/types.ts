declare global {
  type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles?: string[];
  };
}
