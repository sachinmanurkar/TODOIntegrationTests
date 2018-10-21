Cypress.Commands.add('createDefaultTodos', function () {

    let TODO_ITEM_ONE = 'buy vegetables'
    let TODO_ITEM_TWO = 'buy fruits'
    let TODO_ITEM_THREE = 'book tickets'

    let cmd = Cypress.log({
      name: 'create default todos',
      message: [],
      consoleProps () {
     
        return {
          'Inserted Todos': [TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE],
        }
      },
    })
    cy.get('.new-todo', { log: false })
    .type(`${TODO_ITEM_ONE}{enter}`, { log: false })
    .type(`${TODO_ITEM_TWO}{enter}`, { log: false })
    .type(`${TODO_ITEM_THREE}{enter}`, { log: false })
  
    cy.get('.todo-list li', { log: false })
    .then(function ($listItems) {
      cmd.set({ $el: $listItems }).snapshot().end()
    })
  })
  
  Cypress.Commands.add('createTodo', function (todo) {
  
    let cmd = Cypress.log({
      name: 'create todo',
      message: todo,
      consoleProps () {
        return {
          'Inserted Todo': todo,
        }
      },
    })
  
    cy.get('.new-todo', { log: false }).type(`${todo}{enter}`, { log: false })

    cy.get('.todo-list', { log: false })
    .contains('li', todo.trim(), { log: false })
    .then(function ($li) {
      cmd.set({ $el: $li }).snapshot().end()
    })
  })