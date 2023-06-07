using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;
            public readonly IUserAccessor _userAccessr;

            public Handler(IMapper mapper, DataContext dataContext, IUserAccessor userAccessr)
            {
                _dataContext = dataContext;
                _mapper = mapper;
                _userAccessr = userAccessr;
            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activitiesQuery = _dataContext.ActivityAttendees
                    .Where(i => i.AppUser.UserName == request.Username)
                    .OrderBy(i => i.Activity.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                    .AsQueryable();

                activitiesQuery = request.Predicate?.ToLowerInvariant() switch
                {
                    "past" => activitiesQuery.Where(i => i.Date < DateTime.UtcNow),
                    "hosting" => activitiesQuery.Where(i => i.HostUsername == _userAccessr.GetUsername()),
                    _ => activitiesQuery.Where(i => i.Date > DateTime.UtcNow)
                };

                List<UserActivityDto> result = await activitiesQuery.ToListAsync();
                return Result<List<UserActivityDto>>.Success(result);
            }
        }
    }
}