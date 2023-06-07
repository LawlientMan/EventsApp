using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<ActivityDto>>>
        {
            public ActivityParams Params { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public readonly IUserAccessor _userAccessr;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessr)
            {
                _userAccessr = userAccessr;
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activitiesQuery = _context.Activities
                    .Where(a => a.Date >= request.Params.StartDate)
                    .OrderBy(i => i.Date)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                        new { currentUsername = _userAccessr.GetUsername() })
                    .AsQueryable();

                if (request.Params.IsGoing && !request.Params.IsHost)
                {
                    activitiesQuery = activitiesQuery.Where(i => i.Attendees.Any(a => a.Username == _userAccessr.GetUsername()));
                }

                if (request.Params.IsHost && !request.Params.IsGoing)
                {
                    activitiesQuery = activitiesQuery.Where(x=> x.HostUsername == _userAccessr.GetUsername());
                }

                var activities = await PagedList<ActivityDto>.CreateAsync(activitiesQuery,
                    request.Params.PageNumber, request.Params.PageSize, cancellationToken);

                return Result<PagedList<ActivityDto>>.Success(activities);
            }
        }
    }
}