using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Result<Profile>>
        {
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Profile>>
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

            public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users
                    .ProjectTo<Profile>(_mapper.ConfigurationProvider,
                        new { currentUsername = _userAccessr.GetUsername() })
                    .SingleOrDefaultAsync(i => i.Username == request.UserName);

                if (user == null) return null;

                return Result<Profile>.Success(user);
            }
        }
    }
}