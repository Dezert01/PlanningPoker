﻿namespace PlanningPoker.Models.Rooms
{
    public class Participant
    {
        public Participant()
        {
            
        }

        public Participant(int roomId, string name, string connectionId, bool isOwner = false)
        {
            Name = name;
            Role = isOwner ? ParticipantRole.Owner : ParticipantRole.Base;
            Status = ParticipantStatus.Active;
            ConnectionId = connectionId;
            RoomId = roomId;
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public ParticipantRole Role { get; set; }
        public string? Vote { get; set; }
        public ParticipantStatus Status { get; set; }
        public string ConnectionId { get; set; }
        public int RoomId { get; set; }
    }
}
