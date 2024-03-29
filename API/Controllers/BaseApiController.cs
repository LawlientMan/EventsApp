using API.Extensions;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??=
            HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (result == null) return NotFound();
            if (result.IsSuccess)
            {
                return result.Value != null ? Ok(result.Value) : NotFound();
            }

            return BadRequest(result.Error);
        }

        protected ActionResult HandlePagedResult<T>(Result<PagedList<T>> result)
        {
            if (result == null) return NotFound();
            if (result.IsSuccess)
            {
                if (result.Value != null)
                {
                    Response.AddPaginationHeader(result.Value);
                    return Ok(result.Value);
                }
                else
                {
                    return NotFound();
                }
            }

            return BadRequest(result.Error);
        }
    }
}