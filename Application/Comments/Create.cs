using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<Result<CommentDto>>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Body).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<CommentDto>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;

            public Handler(IUserAccessor userAccessor, DataContext dataContext, IMapper mapper)
            {
                _userAccessor = userAccessor;
                _dataContext = dataContext;
                _mapper = mapper;
            }

            public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities.FirstOrDefaultAsync(i => i.Id == request.ActivityId);
                if (activity == null) return null;

                var user = await _dataContext.Users.Include(i => i.Photos)
                    .FirstOrDefaultAsync(i => i.UserName == _userAccessor.GetUsername());
                if (user == null) return null;

                var comment = new Comment()
                {
                    Author = user,
                    Activity = activity,
                    Body = request.Body
                };

                await _dataContext.Comments.AddAsync(comment);
                var success = await _dataContext.SaveChangesAsync() > 0;

                if (success) return Result<CommentDto>.Success(_mapper.Map<CommentDto>(comment));
                return Result<CommentDto>.Failure("Problem with adding comment");
            }
        }
    }
}