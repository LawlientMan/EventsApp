using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Folowers
{
    public class FollowTaggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;

            public Handler(IUserAccessor userAccessor, DataContext context)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(i => i.UserName == _userAccessor.GetUsername());
                if (user == null) return null;

                var targetUser = await _context.Users
                   .FirstOrDefaultAsync(i => i.UserName == request.TargetUsername);
                if (targetUser == null) return null;

                var followings = await _context.UserFollowings.FindAsync(user.Id, targetUser.Id);
                if (followings == null)
                {
                    followings = new UserFolowing()
                    {
                        Observer = user,
                        Target = targetUser
                    };

                    await _context.UserFollowings.AddAsync(followings);
                }
                else
                {
                    _context.UserFollowings.Remove(followings);
                }

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Problem with adding followers");
            }
        }
    }
}