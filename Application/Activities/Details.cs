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
    public class Details
    {
        public class Query : IRequest<Result<ActivityDto>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<ActivityDto>>
        {
            private readonly DataContext _context;
            public readonly IMapper _mapper;
            public readonly IUserAccessor _userAccessr;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessr)
            {
                _mapper = mapper;
                _context = context;
                _userAccessr = userAccessr;
            }

            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                        new {currentUsername = _userAccessr.GetUsername()})
                    .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);

                return Result<ActivityDto>.Success(activity);
            }
        }
    }
}