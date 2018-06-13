# StaffFront

Trabalho da disciplina de Pesquisa e Inovação

# DOCUMENTAÇÃO

# Cronograma

![cronograma](https://github.com/marianacaramico/StaffFront/blob/master/cronograma.png)


# Atores

01. Usuário - designação genérica para comportamentos que podem ser realizados por qualquer tipo de usuário

02. Administrador - usuário administrativo

03. Solicitador - usuário que solicita uma tarefa

04. Realizador - usuário que realiza uma tarefa

![diagrama-atores](https://github.com/marianacaramico/StaffFront/blob/master/diagrama-atores.jpeg)


# Casos de uso

01. Realizar login - permite que um usuário identifique-se na plataforma

02. Realizar logout - permite que um usuário saia da plataforma

03. Visualizar a lista de tarefas disponíveis - exibe a lista de tarefas disponíveis para realização, suas tarefas em andamento (as designadas para você), e o histórico das tarefas realizadas

04. Estimar a realização de uma tarefa - a partir da lista de tarefas disponíveis, permite ao usuário realizador estimar um valor para realização de uma tarefa (cotação)

05. Aprovar a realização de uma tarefa - a partir da lista de tarefas estimadas (filtro), permite ao usuário solicitante aprovar a realização de uma tarefa (green light para realização)

06. Pagar pela realização de uma tarefa - após a aprovação, o usuário solicitante paga a plataforma, que retém o dinheiro até que o solicitante aprove a realização da tarefa com sucesso, para depois repassar o dinheiro ao usuário realizador

07. Avaliar a realização de uma tarefa - após a finalização da tarefa, o usuário solicitante pode avaliar a realização de uma tarefa

08. Preencher cadastro - permite ao usuário preencher os dados cadastrais

09. Editar dados cadastrais - permite a um usuário logado alterar seus dados cadastrais

10. Solicitar realização de tarefa - permite cadastrar uma nova tarefa disponivel para que um usuário realizador estime

![diagrama-casos-de-uso](https://github.com/marianacaramico/StaffFront/blob/master/diagrama-casos-de-uso.jpeg)


# Sitemap

01. Home - página inicial

02. Login - formulário de login

03. Home logada - apresenta um dashboard do usuário logado

04. Cadastro - formulário de cadastro

05. Lista de tarefas - visualização da relação de tarefas disponíveis

06. Solicitar tarefa - formulário para solicitação de nova tarefa

07. Estimar tarefa - formulário para o usuário realizador estimar esforço e preço para realizar uma tarefa disponível

08. Pagar pela realização - formulário com dados financeiros e confirmação do pagamento para realização de uma tarefa

09. Aprovar uma tarefa - formulário para aprovação da realização de uma tarefa

10. Avaliar tarefa - formulário para avaliação de uma tarefa realizada

![diagrama-robustness](https://github.com/marianacaramico/StaffFront/blob/master/diagrama-robustness.jpeg)


# Classes / modelo

USER

TASK

EVALUATION

PAYMENT

TASKESTIMATE

![diagrama-classes](https://github.com/marianacaramico/StaffFront/blob/master/diagrama-classes.jpeg)
