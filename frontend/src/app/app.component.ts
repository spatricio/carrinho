import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tarefa, TarefaPayload } from './models/tarefa.model';
import { TarefaService } from './services/tarefa.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private readonly tarefaService = inject(TarefaService);

  tarefas: Tarefa[] = [];
  tarefasFiltradas: Tarefa[] = [];

  filtroStatus: 'Todos' | 'Pendente' | 'Concluída' = 'Todos';

  formulario: TarefaPayload = {
    titulo: '',
    descricao: '',
    status: 'Pendente'
  };

  editandoId: number | null = null;
  carregando = false;
  mensagemSucesso = '';
  mensagemErro = '';

  get totalTarefas(): number {
    return this.tarefas.length;
  }

  get totalPendentes(): number {
    return this.tarefas.filter((tarefa) => tarefa.status === 'Pendente').length;
  }

  get totalConcluidas(): number {
    return this.tarefas.filter((tarefa) => tarefa.status === 'Concluída').length;
  }

  get percentualConclusao(): number {
    if (!this.totalTarefas) {
      return 0;
    }

    return Math.round((this.totalConcluidas / this.totalTarefas) * 100);
  }

  ngOnInit(): void {
    this.carregarTarefas();
  }

  carregarTarefas(): void {
    this.carregando = true;
    this.limparMensagens();

    this.tarefaService.listar().subscribe({
      next: (tarefas) => {
        this.tarefas = tarefas.map((tarefa) => ({
          ...tarefa,
          status: tarefa.status === 'Concluida' ? 'Concluída' : tarefa.status
        }));
        this.aplicarFiltro();
      },
      error: () => {
        this.mensagemErro = 'Nao foi possivel carregar as tarefas.';
      },
      complete: () => {
        this.carregando = false;
      }
    });
  }

  salvarTarefa(): void {
    if (!this.formulario.titulo.trim()) {
      this.mensagemErro = 'O titulo da tarefa e obrigatorio.';
      return;
    }

    if (this.editandoId) {
      this.atualizarTarefa(this.editandoId, this.formulario);
      return;
    }

    this.criarTarefa(this.formulario);
  }

  editarTarefa(tarefa: Tarefa): void {
    this.editandoId = tarefa.id;
    this.formulario = {
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      status: tarefa.status
    };
    this.limparMensagens();
  }

  excluirTarefa(id: number): void {
    const confirmou = window.confirm('Deseja realmente excluir esta tarefa?');
    if (!confirmou) {
      return;
    }

    this.limparMensagens();
    this.tarefaService.excluir(id).subscribe({
      next: () => {
        this.mensagemSucesso = 'Tarefa excluida com sucesso.';
        this.carregarTarefas();
      },
      error: () => {
        this.mensagemErro = 'Nao foi possivel excluir a tarefa.';
      }
    });
  }

  cancelarEdicao(): void {
    this.resetarFormulario();
    this.limparMensagens();
  }

  aplicarFiltro(): void {
    if (this.filtroStatus === 'Todos') {
      this.tarefasFiltradas = [...this.tarefas];
      return;
    }

    this.tarefasFiltradas = this.tarefas.filter(
      (tarefa) => tarefa.status === this.filtroStatus
    );
  }

  private criarTarefa(payload: TarefaPayload): void {
    this.limparMensagens();
    this.tarefaService.criar(payload).subscribe({
      next: () => {
        this.mensagemSucesso = 'Tarefa criada com sucesso.';
        this.resetarFormulario();
        this.carregarTarefas();
      },
      error: () => {
        this.mensagemErro = 'Nao foi possivel criar a tarefa.';
      }
    });
  }

  private atualizarTarefa(id: number, payload: TarefaPayload): void {
    this.limparMensagens();
    this.tarefaService.atualizar(id, payload).subscribe({
      next: () => {
        this.mensagemSucesso = 'Tarefa atualizada com sucesso.';
        this.resetarFormulario();
        this.carregarTarefas();
      },
      error: () => {
        this.mensagemErro = 'Nao foi possivel atualizar a tarefa.';
      }
    });
  }

  private resetarFormulario(): void {
    this.formulario = {
      titulo: '',
      descricao: '',
      status: 'Pendente'
    };
    this.editandoId = null;
  }

  private limparMensagens(): void {
    this.mensagemSucesso = '';
    this.mensagemErro = '';
  }
}
