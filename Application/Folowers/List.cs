using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Folowers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            private readonly IMapper _mapper;
            public readonly DataContext _context;
            public readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.Profile>();
                switch (request.Predicate)
                {
                    case "followers":
                        profiles = await _context.UserFollowings.Where(i => i.Target.UserName == request.Username)
                            .Select(i => i.Observer)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, 
                                new {currentUsername = _userAccessor.GetUsername()})
                            .ToListAsync();
                        break;

                    case "following":
                        profiles = await _context.UserFollowings.Where(i => i.Observer.UserName == request.Username)
                            .Select(i => i.Target)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, 
                                new {currentUsername = _userAccessor.GetUsername()})
                            .ToListAsync();
                        break;
                }

                return Result<List<Profiles.Profile>>.Success(profiles);
            }
        }
    }
}