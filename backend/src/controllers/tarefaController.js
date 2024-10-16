import Tarefa from "../models/tarefaModel.js";
import { z } from "zod";

const createSchema = z.object({
     tarefa: z.string({
          invalid_type_error: "A tarefa deve ser um texto",
          required_error: "Tarefa é obrigatória"
     })
          .min(3, { message: "a tarefa deve conter pelo menos 3 caracteres" })
          .max(255, { message: "a tarefa deve conter no máximo 255 caracteres" }),
})

const idSchema = z.object({
     id: z.string().uuid({ message: "id invalido" })
})


export const create = async (req, res) => {

     const createValidation = createSchema.safeParse(req.body);
     if (!createValidation.success) {
          res.status(400).json(createValidation.error)
          return
     }
     const { tarefa } = createValidation.data;

     const descricao = req.body?.descricao || null

     const novaTarefa = {
          tarefa,
          descricao
     }

     try {
          const insertTarefa = await Tarefa.create(novaTarefa)
          res.status(201).json(insertTarefa)
     } catch (error) {
          console.error(error)
          res.status(500).json({ err: "Erro ao cadastrar tarefa" })
     }
};
//8080/api/tarefas?page=1&limit=10
export const getAll = async (req, res) => {
     const page = parseInt(req.query.page) || 1
     const limit = parseInt(req.query.limit) || 10
     const offset = (page - 1) * 10

     try {
          const tarefas = await Tarefa.findAndCountAll({ offset: page, limit: limit })
          const totalPaginas = Math.ceil(tarefas.count / limit)
          res.status(200).json({
               totalTarefas: tarefas.count,
               totalPaginas,
               paginaAtual: page,
               itensPorPagina: limit,
               proximaPagina: totalPaginas === 0 ? null : `http://localhost:8080/api/tarefas/page=${page + 1}`,
               tarefas: tarefas.rows
          }
          )
     } catch (error) {
          console.error(error)
          res.status(500).json({ err: "deu erro buscando moral" })
     }
     res.status(200).json("Chegou no controlador")
};

export const getTarefa = async (req, res) => {
     const { id } = req.params

     const tarefa = await Tarefa.findByPk(id);
     if (tarefa === null) {
          console.log('Not found!');
     } else {
          console.log(tarefa instanceof Tarefa); // true
          res.status(200).json(tarefa)

     }
};

export const updateTarefa = async (req, res) => {
     res.status(200).json("Chegou no controlador")
};

export const updateStatusTarefa = async (req, res) => {
     const idValidation = idSchema.safeParse(req.params)
     if (!idValidation.success) {
          res.status(400).json({ message: idValidation.error })
          return
     }

     const id = idValidation.data.id
     try {
          const tarefa = await Tarefa.findOne({ raw: true, where: { id } })
          if (!tarefa) {
               res.status(404).json({ err: "tarefa não encontrada" })
               return
          }

          if (tarefa.status === 'pendente') {
               await Tarefa.update({ stutus: 'concluida' }, { where: { id } })
          } else if (tarefa.status === 'concluida') {
               await Tarefa.update({ stutus: 'pendente' }, { where: { id } })
          }

          const tarefaAtualizada = await Tarefa.findByPk(id)
          res.status(200).json(tarefaAtualizada)
     } catch (error) {
          console.error(error)
          res.status(500).json({ err: "erro ao atualizar" })
     }
};

export const getTarefaStatus = async (req, res) => {
     const { situacao } = req.params
     try {
          const tarefas = await Tarefa.findAll({ where: { status: situacao } })
          res.status(200).json({ tarefas })
     } catch (error) {
          console.error(error)
          res.status(500).json({ err: "deu erro buscando moral" })
     }
     res.status(200).json({ tarefas })

};

export const deleteTarefa = async (req, res) => {
     const idValidation = idSchema.safeParse(req.params)
     if (!idValidation.success) {
          res.status(400).json({ message: idValidation.error })
          return
     }

     const id = idValidation.data.id

     try {
          const tarefaDeletada = await Tarefa.destroy({
               where: { id },
          });
          if (tarefaDeletada === 0) {
               res.status(404).json({ message: "tarefa não existe" })
               return
          }
          console.log(tarefaDeletada)
          res.status(200).json({ message: "tarefa excluida" })
     } catch (error) {
          console.error(error)
          res.status(500).json({ message: "erro ao excluir tarefa" })

     }
}