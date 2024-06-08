import { UserHistory, VOTING_SYSTEM } from "@/model/user";
import { userStories } from "./userstory-data";

export const loginRes = {
  status: true,
  message: "Login successful",
  userId: "1",
};

export const registerRes = {
  status: true,
  message: "Registration successful",
  userId: "1",
};

export const currentUserRes = {
  userId: "1",
  username: "John Doe",
  email: "johndoe@gmail.com",
};

export const currentUserHistory: UserHistory[] = [
  {
    createdAt: new Date(),
    id: 1,
    name: "Room 1",
    votingSystem: VOTING_SYSTEM.FIBONACCI,
    userStories: [
      {
        description: "User story description",
        id: 1,
        tasks: [
          {
            description: "Task description",
            id: 1,
            title: "Task 1",
            votingResult: "1",
          },
          {
            description: "Task description",
            id: 2,
            title: "Task 2",
            votingResult: "2",
          },
        ],
        title: "User story 1",
      },
      {
        description: "User story description",
        id: 2,
        tasks: [
          {
            description: "Task description",
            id: 1,
            title: "Task 1",
            votingResult: "1",
          },
        ],
        title: "User story 2",
      },
      {
        description: "User story description",
        id: 3,
        tasks: [
          {
            description: "Task description",
            id: 1,
            title: "Task 1",
            votingResult: "1",
          },
          {
            description: "Task description",
            id: 2,
            title: "Task 2",
            votingResult: "2",
          },
          {
            description: "Task description",
            id: 3,
            title: "Task 3",
            votingResult: "3",
          },
        ],
        title: "User story 3",
      },
      {
        description: "User story description",
        id: 4,
        tasks: [
          {
            description: "Task description",
            id: 1,
            title: "Task 1",
            votingResult: "1",
          },
          {
            description: "Task description",
            id: 2,
            title: "Task 2",
            votingResult: "2",
          },
          {
            description: "Task description",
            id: 3,
            title: "Task 3",
            votingResult: "3",
          },
          {
            description: "Task description",
            id: 4,
            title: "Task 4",
            votingResult: "5",
          },
        ],
        title: "User story 4",
      },
      {
        description: "User story description",
        id: 5,
        tasks: [
          {
            description: "Task description",
            id: 1,
            title: "Task 1",
            votingResult: "1",
          },
          {
            description: "Task description",
            id: 2,
            title: "Task 2",
            votingResult: "2",
          },
          {
            description: "Task description",
            id: 3,
            title: "Task 3",
            votingResult: "3",
          },
          {
            description: "Task description",
            id: 4,
            title: "Task 4",
            votingResult: "5",
          },
          {
            description: "Task description",
            id: 5,
            title: "Task 5",
            votingResult: "8",
          },
        ],
        title: "User story 5",
      },
    ],
  },
  {
    createdAt: new Date(),
    id: 2,
    name: "Room 2",
    votingSystem: VOTING_SYSTEM.FIBONACCI,
    userStories: [
      {
        description: "User story description",
        id: 1,
        tasks: [
          {
            description: "Task description",
            id: 1,
            title: "Task 1",
            votingResult: "1",
          },
          {
            description: "Task description",
            id: 2,
            title: "Task 2",
            votingResult: "2",
          },
        ],
        title: "User story 1",
      },
      {
        description: "User story description",
        id: 2,
        tasks: [
          {
            description: "Task description",
            id: 1,
            title: "Task 1",
            votingResult: "1",
          },
        ],
        title: "User story 2",
      },
      {
        description: "User story description",
        id: 3,
        tasks: [
          {
            description: "Task description",
            id: 1,
            title: "Task 1",
            votingResult: "1",
          },
          {
            description: "Task description",
            id: 2,
            title: "Task 2",
            votingResult: "2",
          },
          {
            description: "Task description",
            id: 3,
            title: "Task 3",
            votingResult: "3",
          },
        ],
        title: "User story 3",
      },
    ],
  },
];
