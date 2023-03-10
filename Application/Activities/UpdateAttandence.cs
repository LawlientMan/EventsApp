using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttandence
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;
            public Handler(IUserAccessor userAccessor, DataContext dataContext)
            {
                _userAccessor = userAccessor;
                _dataContext = dataContext;

            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities
                    .Include(i => i.Attendees).ThenInclude(i => i.AppUser)
                    .SingleOrDefaultAsync(i => i.Id == request.Id);

                if (activity == null) return null;

                var user = await _dataContext.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                var hostUsername = activity.Attendees.FirstOrDefault(i => i.IsHost)?.AppUser?.UserName;
                var attendance = activity.Attendees.FirstOrDefault(i => i.AppUser.UserName == user.UserName);

                if (attendance != null && hostUsername == user.UserName)
                {
                    activity.IsCancelled = !activity.IsCancelled;
                }
                else if (attendance != null)
                {
                    activity.Attendees.Remove(attendance);
                }
                else
                {
                    activity.Attendees.Add(new Domain.ActivityAttendee()
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    });
                }

                var result = await _dataContext.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to update attandence");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}