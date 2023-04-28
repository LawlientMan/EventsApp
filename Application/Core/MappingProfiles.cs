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
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d=> d.DisplayName, o=> o.MapFrom(s=> s.AppUser.DisplayName))
                .ForMember(d=> d.Username, o=> o.MapFrom(s=> s.AppUser.UserName))
                .ForMember(d=> d.Bio, o=> o.MapFrom(s=> s.AppUser.Bio))
                .ForMember(d=> d.Image, o=> o.MapFrom(s=> s.AppUser.Photos.FirstOrDefault(i=> i.IsMain).Url));
            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d=> d.DisplayName, o=> o.MapFrom(s=> s.DisplayName))
                .ForMember(d=> d.Username, o=> o.MapFrom(s=> s.UserName))
                .ForMember(d=> d.Bio, o=> o.MapFrom(s=> s.Bio))
                .ForMember(d=> d.Image, o=> o.MapFrom(s=> s.Photos.FirstOrDefault(i=> i.IsMain).Url))
                .ForMember(d=> d.Photos, o=> o.MapFrom(s=> s.Photos));
        }
    }
}