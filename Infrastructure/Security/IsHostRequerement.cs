using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequerement : IAuthorizationRequirement
    {
    }

    public class IsHostRequerementHandler : AuthorizationHandler<IsHostRequerement>
    {
        private readonly DataContext _dataContext;
        private readonly IHttpContextAccessor _contextAccessor;

        public IsHostRequerementHandler(DataContext dataContext, IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
            _dataContext = dataContext;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequerement requirement)
        {
            var userId = _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(userId == null) return;

            var activityId = Guid.Parse(_contextAccessor.HttpContext?.Request.RouteValues
                .SingleOrDefault(i=> i.Key == "id").Value?.ToString());

            var attandee = await _dataContext.ActivityAttendees
                .AsNoTracking()
                .SingleOrDefaultAsync(i=> i.AppUserId == userId && i.ActivityId == activityId);
                
            if(attandee == null) return;

            if(attandee.IsHost) context.Succeed(requirement);
        }
    }
}