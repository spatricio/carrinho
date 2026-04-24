import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarefa, TarefaPayload } from '../models/tarefa.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  listar(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Tarefa> {
    return this.http.get<Tarefa>(`${this.apiUrl}/${id}`);
  }

  criar(payload: TarefaPayload): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.apiUrl, payload);
  }

  atualizar(id: number, payload: TarefaPayload): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, { ...payload, id });
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
