using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.Models;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TarefasController : ControllerBase
{
    private static readonly HashSet<string> StatusValidos = new(StringComparer.OrdinalIgnoreCase)
    {
        "Pendente",
        "Concluida",
        "Concluída"
    };

    private readonly AppDbContext _context;

    public TarefasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tarefa>>> GetTarefas()
    {
        var tarefas = await _context.Tarefas
            .AsNoTracking()
            .OrderByDescending(t => t.DataCriacao)
            .ToListAsync();

        return Ok(tarefas);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Tarefa>> GetTarefaById(int id)
    {
        var tarefa = await _context.Tarefas
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tarefa is null)
        {
            return NotFound();
        }

        return Ok(tarefa);
    }

    [HttpPost]
    public async Task<ActionResult<Tarefa>> CreateTarefa(Tarefa tarefa)
    {
        if (!StatusValido(tarefa.Status))
        {
            return BadRequest("Status deve ser Pendente ou Concluída.");
        }

        tarefa.Id = 0;
        tarefa.DataCriacao = DateTime.UtcNow;

        tarefa.Status = NormalizarStatus(tarefa.Status);

        _context.Tarefas.Add(tarefa);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTarefaById), new { id = tarefa.Id }, tarefa);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTarefa(int id, Tarefa tarefaAtualizada)
    {
        if (id != tarefaAtualizada.Id)
        {
            return BadRequest("Id da URL diferente do Id do corpo da requisição.");
        }

        if (!StatusValido(tarefaAtualizada.Status))
        {
            return BadRequest("Status deve ser Pendente ou Concluída.");
        }

        var tarefa = await _context.Tarefas.FirstOrDefaultAsync(t => t.Id == id);

        if (tarefa is null)
        {
            return NotFound();
        }

        tarefa.Titulo = tarefaAtualizada.Titulo;
        tarefa.Descricao = tarefaAtualizada.Descricao;
        tarefa.Status = NormalizarStatus(tarefaAtualizada.Status);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTarefa(int id)
    {
        var tarefa = await _context.Tarefas.FirstOrDefaultAsync(t => t.Id == id);

        if (tarefa is null)
        {
            return NotFound();
        }

        _context.Tarefas.Remove(tarefa);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static bool StatusValido(string status)
    {
        return !string.IsNullOrWhiteSpace(status) && StatusValidos.Contains(status.Trim());
    }

    private static string NormalizarStatus(string status)
    {
        return string.Equals(status?.Trim(), "Concluida", StringComparison.OrdinalIgnoreCase)
            || string.Equals(status?.Trim(), "Concluída", StringComparison.OrdinalIgnoreCase)
            ? "Concluída"
            : "Pendente";
    }
}
