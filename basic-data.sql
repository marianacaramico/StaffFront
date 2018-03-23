-- id_user_owner
-- 1 - Rodrigo Prates
-- 2 - Mariana
-- 3 - Pedro
-- 4 - Mateus
-- 5 - Laury

-- id_task_type
-- 1 - Entrega rapida
-- 2 - Supermercado
-- 3 - Serviços
-- 4 - Outros

-- TIPOS DE TASKS (3x)
-- Abertas para mim, em aberto
-- Abertas por mim, com dono, concluída
-- Abertas para mim, concluídas


-- ABERTAS POR MIM, SEM DONO, EM ABERTO
INSERT INTO TB_TASK(id_task_type, id_user_owner, title, description, creation_date, due_date, value, status) 
VALUES(1, 1, 'Entregar um documento no centro de Sao Paulo', 'Entregar um documento no predio do Banco do Brasil 
	no centro de Sao Paulo, ate as 17h de hoje, aos cuidados do sr. Jose.', GETDATE(), GETDATE()+10, 100, 'A')

INSERT INTO TB_TASK(id_task_type, id_user_owner, title, description, creation_date, due_date, value, status) 
VALUES(2, 1, 'Fazer minhas compras do mes', 'Comprar mantimentos para minha residencia e entregar em casa ate o final
	do dia. Lista: queijo, leite, presunto, pao, alface, chocolate, vinhos. Valor para as compras mais a
	realizacao do servico', GETDATE(), GETDATE()+5, 500, 'A')

INSERT INTO TB_TASK(id_task_type, id_user_owner, title, description, creation_date, due_date, value, status) 
VALUES(3, 1, 'Levar meu cachorro para passear', 'Levar meu cachorro para passear, mais ou menos 5km nas ruas da 
	Vila Mariana. Recolher as fezes do cachorro, garantir que ele nao se estresse com outros caes no passeio', 
	GETDATE(), GETDATE()+2, 30, 'A')


-- ABERTAS POR MIM, COM DONO, EM ABERTO
INSERT INTO TB_TASK(id_task_type, id_user_owner, title, description, creation_date, due_date, value, status) 
VALUES(3, 1, 'Fazer o projeto da disciplina Pesquisa e Inovacao', 'Desenvolver uma aplicacao web em Node + React, 
	com banco de dados SQL Server, hospedado no Azure Cloud.', GETDATE(), GETDATE()+30, 2000, 'A')

-- Precisa executar logo apos o statement acima. Revisar o id_task para pegar o id da task criada acima
-- Dono: Mateus
INSERT INTO TB_AGREEMENT(id_task, id_user, creation_date, conclusion_date, receipt) VALUES(4, 4, GETDATE(), 
	GETDATE()+20, 'Aceito fazer')

INSERT INTO TB_TASK(id_task_type, id_user_owner, title, description, creation_date, due_date, value, status) 
VALUES(3, 1, 'Levar um presente para a Mariana no hospital', 'Comprar um livro na Livraria Cultura e levar para
	a Mariana no hospital nove de julho, quarto S281, ate as 21h.', GETDATE(), GETDATE()+1, 100, 'A')

-- Precisa executar logo apos o statement acima. Revisar o id_task para pegar o id da task criada acima
-- Dono: Pedro
INSERT INTO TB_AGREEMENT(id_task, id_user, creation_date, conclusion_date, receipt) VALUES(5, 3, GETDATE(), 
	GETDATE()+1, 'Aceito!')

INSERT INTO TB_TASK(id_task_type, id_user_owner, title, description, creation_date, due_date, value, status) 
VALUES(4, 1, 'Fazer a documentacao do projeto de Pesquisa e Inovacao', 'Produzir todos os diagramas que o projeto
	requer: classes, casos de uso, robustness, modelagem do banco de dados e especificacoes tecnicas.', GETDATE(), 
	GETDATE()+30, 300, 'A')

-- Precisa executar logo apos o statement acima. Revisar o id_task para pegar o id da task criada acima
-- Dono: Laury
INSERT INTO TB_AGREEMENT(id_task, id_user, creation_date, conclusion_date, receipt) VALUES(6, 5, GETDATE(), 
	GETDATE()+30, 'Considered done')
