export interface PromptT {
  _id: string;
  creator: UserT;
  prompt: string;
  tag: string;
}

export interface UserT {
  email: string;
  image: string;
  username: string;
  _id: string;
}
