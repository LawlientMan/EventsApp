using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles: Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>().ReverseMap();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d=> d.HostUsername, o=> o.MapFrom(s=> s.Attendees.FirstOrDefault(i=> i.IsHost).AppUser.UserName));
            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(d=> d.DisplayName, o=> o.MapFrom(s=> s.AppUser.DisplayName))
                .ForMember(d=> d.UserName, o=> o.MapFrom(s=> s.AppUser.UserName))
                .ForMember(d=> d.Bio, o=> o.MapFrom(s=> s.AppUser.Bio));
        }
    }
}