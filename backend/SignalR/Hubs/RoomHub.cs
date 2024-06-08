using Microsoft.AspNetCore.SignalR;
using PlanningPoker.Models.Participants;
using PlanningPoker.Models.Rooms;
using PlanningPoker.Models.UserStory;
using PlanningPoker.Services.ParticipantService;
using PlanningPoker.Services.RoomService;
using PlanningPoker.Services.UserService;
using PlanningPoker.Services.UserStoryService;

namespace PlanningPoker.SignalR.Hubs
{
    public class RoomHub : Hub
    {
        private readonly IRoomService _roomService;
        private readonly IParticipantService _participantService;
        private readonly IUserStoryService _userStoryService;
        private readonly IUserService _userService;

        public RoomHub(
            IRoomService roomService,
            IParticipantService participantService,
            IUserStoryService userStoryService,
            IUserService userService)
        {
            _roomService = roomService;
            _participantService = participantService;
            _userStoryService = userStoryService;
            _userService = userService;
        }

        public async Task JoinRoom(int roomId, int? userId)
        {
            var room = await _roomService.GetRoomById(roomId);

            if (room == null)
                throw new Exception($"Room { roomId } not found");

            if (room.Participants.Count >= room.Capacity)
            {
                await Clients.Caller.SendAsync("NoRoomInRoom");
                return;
            }

            if (room.GameState == RoomGameState.VoteInProgress)
            {
                await Clients.Caller.SendAsync("VoteInProgress");
                return;
            }

            var participantName = await _userService.GetUsername(userId);

            await _roomService.Join(room, participantName, Context.ConnectionId, userId);

            var groupName = GetGroupName(room);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("UserJoined", participantName);
            await Clients.Group(groupName).SendAsync("EveryoneVoted", false);
            await Clients.Caller.SendAsync("RoomDetails", room);
            await Clients.Caller.SendAsync("ParticipantName", participantName);

            var votingState = _roomService.GetVotingState(room);
            await Clients.Group(groupName).SendAsync("VotingState", votingState);
        }

        public async Task SubmitVote(int roomId, string participantName, string? voteValue, int userStoryTaskId)
        {
            await _participantService.SubmitVote(participantName, Context.ConnectionId, voteValue);
            var room = await _roomService.GetRoomById(roomId);

            if (room == null)
                throw new Exception($"Room { roomId } not found");

            var groupName = GetGroupName(room);

            if (voteValue == null)
            {
                await Clients.Group(groupName).SendAsync("VoteWithdrawn", participantName);
                await Clients.Group(groupName).SendAsync("EveryoneVoted", false);
                await Clients.Group(groupName).SendAsync("TaskEstimation", null);

            }
            else
            {
                await Clients.Group(groupName).SendAsync("VoteSubmitted", participantName);
            }

            if (await IsVotingFinished(roomId))
            {
                await _roomService.SetGameState(roomId, RoomGameState.VoteFinished);

                var votingResults = _roomService.GetVotingResults(room);

                var estimation = await _userStoryService.EstimateTaskValue(userStoryTaskId, votingResults, room.VotingSystem);
                await _userStoryService.SaveVoters(userStoryTaskId, room.Participants);

                if (string.IsNullOrEmpty(estimation))
                    throw new Exception("Task estimation failed");

                await Clients.Group(groupName).SendAsync("VotingResults", votingResults);
                await Clients.Group(groupName).SendAsync("EveryoneVoted", true);
                await Clients.Group(groupName).SendAsync("TaskEstimation", estimation);

                return;
            }

            var votingState = _roomService.GetVotingState(room);
            await Clients.Group(groupName).SendAsync("VotingState", votingState);
        }

        private async Task<bool> IsVotingFinished(int roomId)
        {
            return await _roomService.HaveAllActiveParticipantsVoted(roomId);
        }

        public async Task AddUserStory(int roomId, string title, string description)
        {
            var room = await _roomService.GetRoomById(roomId);

            if (room == null)
                throw new Exception("No room with that ID");

            var userStory = new UserStory
            {
                RoomId = roomId,
                Title = title,
                Description = description
            };

            var success = await _userStoryService.AddUserStory(userStory);

            var groupName = GetGroupName(room);

            if (success)
            {
                await Clients.Group(groupName).SendAsync("UserStoryAdded", await _userStoryService.ListUserStories(room.Id));
                await ResetGame(room);
            }

            else
                await Clients.Caller.SendAsync("CreatingUserStoryFailed");
        }

        public async Task UpdateUserStory(int roomId, int userStoryId, string name, string description)
        {
            var room = await _roomService.GetRoomById(roomId);

            if (room == null)
                throw new Exception("No room with given ID");

            var success = await _userStoryService.UpdateUserStory(roomId, userStoryId, name, description);

            if (success)
            {
                await Clients.Group(GetGroupName(room)).SendAsync("UserStoryUpdated", await _userStoryService.ListUserStories(room.Id));
                await ResetGame(room);
            }

            else
                await Clients.Caller.SendAsync("UpdatingUserStoryFailed");
        }

        public async Task DeleteUserStory(int roomId, int userStoryId)
        {
            var room = await _roomService.GetRoomById(roomId);

            if (room == null)
                throw new Exception("No room with given ID");

            var success = await _userStoryService.DeleteUserStory(roomId, userStoryId);

            if (success)
            {
                await Clients.Group(GetGroupName(room)).SendAsync("UserStoryDeleted", await _userStoryService.ListUserStories(room.Id));
                await ResetGame(room);
            }

            else
                await Clients.Caller.SendAsync("DeletingUserStoryFailed");
        }

        public async Task CreateUserStoryTask(int roomId, int userStoryId, string title, string description)
        {
            var room = await _roomService.GetRoomById(roomId);

            if (room == null)
                throw new Exception("No room with given ID");

            var task = new UserStoryTask(userStoryId, title, description);
            var success = await _userStoryService.CreateUserStoryTask(task);

            if (success)
            {
                await Clients.Group(GetGroupName(room)).SendAsync("UserStoryTaskCreated", await _userStoryService.ListUserStories(room.Id));
                await ResetGame(room);
            }

            else
                await Clients.Caller.SendAsync("CreatingUserStoryTaskFailed");
        }

        public async Task UpdateUserStoryTask(int roomId, int userStoryTaskId, string title, string description)
        {
            var room = await _roomService.GetRoomById(roomId);

            if (room == null)
                throw new Exception("No room with given ID");

            var success = await _userStoryService.UpdateUserStoryTask(userStoryTaskId, title, description);

            if (success)
            {
                await Clients.Group(GetGroupName(room)).SendAsync("UserStoryTaskUpdated", await _userStoryService.ListUserStories(room.Id));
                await ResetGame(room);
            }

            else
                await Clients.Caller.SendAsync("UpdatingUserStoryTaskFailed");
        }

        public async Task DeleteUserStoryTask(int roomId, int userStoryTaskId)
        {
            var room = await _roomService.GetRoomById(roomId);

            if (room == null)
                throw new Exception("No room with given ID");

            var success = await _userStoryService.DeleteUserStoryTask(userStoryTaskId);

            if (success)
            {
                await Clients.Group(GetGroupName(room)).SendAsync("UserStoryTaskDeleted", await _userStoryService.ListUserStories(room.Id));
                await ResetGame(room);
            }

            else
                await Clients.Caller.SendAsync("DeletingUserStoryTaskFailed");
        }

        public async Task SetVotedTask(int roomId, int userStoryTaskId)
        {
            var room = await _roomService.GetRoomById(roomId);
            var userStoryTask = await _userStoryService.GetUserStoryTaskById(userStoryTaskId);

            if (room == null)
                throw new Exception("No room with given ID");

            if (userStoryTask == null)
                throw new Exception("No task with given ID");

            await _roomService.SetGameState(roomId, RoomGameState.VoteInProgress);
            var groupName = GetGroupName(room);

            await Clients.Group(groupName).SendAsync("GameState", RoomGameState.VoteInProgress);
            await Clients.Group(groupName).SendAsync("VotingStart", userStoryTask);

            await ResetPlayerVotes(room);
        }

        private async Task ResetGame(Room room)
        {
            await _roomService.SetGameState(room.Id, RoomGameState.GameReady);

            var groupName = GetGroupName(room);

            await ResetPlayerVotes(room);

            await Clients.Group(groupName).SendAsync("GameState", RoomGameState.GameReady);
            await Clients.Group(groupName).SendAsync("VotingStart", null);
        }

        private async Task ResetPlayerVotes(Room room)
        {
            var groupName = GetGroupName(room);

            foreach (var participant in room.Participants)
            {
                await _participantService.SubmitVote(participant.Name, participant.ConnectionId, null);
            }

            var votingState = _roomService.GetVotingState(room);

            await Clients.Group(groupName).SendAsync("VotingState", votingState);

        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var participant = await _participantService.GetParticipantByConnectionId(Context.ConnectionId);

            if (participant != null)
            {
                var room = await _roomService.GetRoomById(participant.RoomId);
                if (room != null)
                {
                    await ResetGame(room);
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetGroupName(room));
                    await Clients.Group(GetGroupName(room)).SendAsync("UserLeft", participant.Name);

                    await _participantService.LeaveRoom(participant);

                    var votingState = _roomService.GetVotingState(room);
                    await Clients.Group(GetGroupName(room)).SendAsync("VotingState", votingState);
                }
            }

            await base.OnDisconnectedAsync(exception);
        }

        private string GetGroupName(Room room)
        {
            return $"[{ room.Id }] { room.Name }";
        }
    }
}
