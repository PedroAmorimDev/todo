import React from "react"
import { Form, Button } from "react-bootstrap"
import axios from 'axios'

const ToDoForm = () => {

     const [tarefa, setTarefa] = React.useState('');
     const [descricao, setDescricao] = React.useState(null);
     const [message, setMessage] = React.useState(null);
     const [loading, setLoading] = React.useState(null);


     const handlePost = async (event) => {
          event.preventDefault()
          setLoading("carregando...")
          try {
               await axios.post("http://localhost:8080/api/tarefas", {
                    tarefa,
                    descricao
               })
               setMessage("Tarefa criada com sucesso!")
          } catch (error) {
               setMessage("Não foi possível salvar a sua tarefa!")
          }
     }

     return (
          <Form onSubmit={handlePost}>
               <Form.Group className="mb-3">
                    <Form.Label>Título</Form.Label>
                    <Form.Control type="text" placeholder="Digite o tarefa da tarefa"
                         value={tarefa}
                         onChange={(e) => setTarefa(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                         We'll never share your email with anyone else.
                    </Form.Text>
               </Form.Group>

               <Form.Group className="mb-3">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control type="text" placeholder="Digite a descrição da sua tarefa(opcional)"
                         value={descricao}
                         onChange={(e) => setDescricao(e.target.value)}
                    />
               </Form.Group>
               <Button variant="primary" type="submit">
                    Cadastrar tarefa
               </Button>
               {message ? <p>{message}</p> : <p>{loading}</p>}
          </Form>
     )
}

export default ToDoForm