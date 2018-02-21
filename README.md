# StaffFront

This project has the front-end portion of the Staff App. It is a React app, created with [Facebook React-App] (https://github.com/facebookincubator/create-react-app)

# DOCUMENTACAO INICIAL

# Atores

01. Usuario - designacao generica para comportamentos que podem ser realizados por qualquer tipo de usuario

02. Administrador - usuario administrativo

03. Solicitador - usuario que solicita uma tarefa

04. Realizador - usuario que realiza uma tarefa


# Casos de uso

01. Realizar login - permite que um usuario se identifique na plataforma

02. Realizar logout - permite que um usuario saia da plataforma

03. Visualizar a lista de tarefas disponiveis - exibe a lista de tarefas disponiveis para realizacao, suas tarefas em andamento (as designadas para voce), e o historico das tarefas realizadas

04. Estimar a realizacao de uma tarefa - a partir da lista de tarefas disponiveis, permite ao usuario realizador estimar um valor para realizacao de uma tarefa (cotacao)

05. Aprovar a realizacao de uma tarefa - a partir da lista de tarefas estimadas (filtro), permite ao usuario solicitante aprovar a realizacao de uma tarefa (green light para realizacao)

06. Pagar pela realizacao de uma tarefa - apos a aprovacao, o usuario solicitante paga a plataforma, que retem o dinheiro ate que o solicitante aprove a realizacao da tarefa com sucesso, para depois repassar o dinheiro ao usuario solicitador

07. Avaliar a realizacao de uma tarefa - apos a finalizacao da tarefa, o usuario solicitante pode avaliar a realizacao de uma tarefa

08. Preencher cadastro - permite ao usuario preencher os dados cadastrais

09. Editar dados cadastrais - permite a um usuario logado alterar seus dados cadastrais

10. Solicitar realizacao de tarefa - permite cadastrar uma nova tarefa disponivel para que um usuario realizador estime